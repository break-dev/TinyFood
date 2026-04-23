import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { Platform } from "react-native";
import { supabase } from "../../../service/supabase.client";
import { AuthResponse } from "./responses";
import { AuthRegisterRequest } from "./requests";

// Necesario para que el navegador cierre automáticamente al volver a la app
WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // Genera la URL de retorno correcta automáticamente:
      // Añadimos un path explícito porque a veces Supabase/Android fallan
      // al hacer redirect a una URL base (sin ruta).
      // En Expo Go esto generará: exp://IP:PORT/--/auth/callback
      const redirectTo = makeRedirectUri({ path: 'auth/callback' });
      console.log("[Auth] URL de redirección (Asegúrate de tener esto en Supabase):", redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account', // Obliga a Google a preguntar qué cuenta usar siempre
          }
        },
      });

      if (error) {
        console.log("[Auth] Error signInWithOAuth:", error.message);
        return { success: false, message: error.message };
      }
      
      if (!data?.url) {
        return { success: false, message: "No se obtuvo la URL de autenticación" };
      }

      console.log("[Auth] URL generada para WebView/Browser:", data.url);
      
      // En Android físico, retornamos la URL directamente para que la UI la abra en una WebView,
      // evitando por completo el bug de Chrome Custom Tabs y el Account Chooser nativo.
      if (Platform.OS === 'android') {
        return { success: true, message: data.url };
      }

      const browserOptions = {
        ephemeralBrowserSession: true, // Fuerza sesión limpia sin cookies previas
      };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, browserOptions);
      console.log("[Auth] Navegador cerrado. Resultado:", result.type);

      if (result.type === "success" && result.url) {
        return await this.createSessionFromUrl(result.url);
      }

      if (result.type === "cancel") {
        return { success: false, message: "Inicio de sesión cancelado" };
      }

      // Si el resultado es 'dismiss' (el usuario cerró manual o el navegador no reportó success),
      // dejamos que el Linking.useURL global en _layout.tsx lo maneje si es que llegó el link.
      return { success: false, message: "Autenticación no completada" };
    } catch (error: any) {
      console.error("[Auth] Error inesperado:", error);
      return {
        success: false,
        message: error.message ?? "Error al iniciar sesión con Google",
      };
    }
  }

  static async createSessionFromUrl(url: string): Promise<AuthResponse> {
    try {
      console.log("[Auth] Procesando URL de retorno:", url);
      const { params, errorCode } = QueryParams.getQueryParams(url);

      if (errorCode) return { success: false, message: errorCode };
      
      const { access_token, refresh_token, code } = params;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) return { success: false, message: error.message };
        return { success: true, message: "Sesión iniciada correctamente" };
      }

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) return { success: false, message: error.message };
        return { success: true, message: "Sesión iniciada correctamente" };
      }

      return { success: false, message: "No se encontraron tokens en la respuesta" };
    } catch (error: any) {
      console.error("[Auth] Error procesando sesión:", error);
      return { success: false, message: error.message || "Error procesando sesión" };
    }
  }

  static async registerWithEmail({ name, email, password }: AuthRegisterRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre: name } },
    });

    if (error) return { success: false, message: error.message };

    return {
      success: true,
      message: "Registro exitoso",
      data: data.session
        ? {
            userId: data.user!.id,
            email: data.user!.email!,
            accessToken: data.session.access_token,
          }
        : undefined,
    };
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}

import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "../../../service/supabase.client";
import { AuthResponse } from "./responses";
import { AuthRegisterRequest } from "./requests";

// Necesario para que el navegador cierre automáticamente al volver a la app
WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  /**
   * Flujo OAuth de Google via navegador web.
   * Abre el navegador del sistema, el usuario elige su cuenta de Google,
   * Supabase valida y crea/recupera la sesión.
   * Si la cuenta ya existe → inicia sesión. Si no → la registra automáticamente.
   */
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const redirectTo = makeRedirectUri({ scheme: "tinyfood", path: "auth/callback" });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (error) return { success: false, message: error.message };
      if (!data.url) return { success: false, message: "No se obtuvo la URL de autenticación" };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type !== "success") {
        return { success: false, message: "Inicio de sesión cancelado" };
      }

      // Extraer el código/tokens del URL de retorno y establecer sesión
      const url = new URL(result.url);
      const accessToken = url.searchParams.get("access_token");
      const refreshToken = url.searchParams.get("refresh_token");

      // Si vienen como fragment (#) en vez de query params
      const hash = result.url.split("#")[1] ?? "";
      const params = new URLSearchParams(hash);
      const fragmentAccessToken = params.get("access_token");
      const fragmentRefreshToken = params.get("refresh_token");

      const finalAccessToken = accessToken ?? fragmentAccessToken;
      const finalRefreshToken = refreshToken ?? fragmentRefreshToken;

      if (finalAccessToken && finalRefreshToken) {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: finalAccessToken,
          refresh_token: finalRefreshToken,
        });

        if (sessionError) return { success: false, message: sessionError.message };

        return {
          success: true,
          message: "Sesión iniciada correctamente",
          data: {
            userId: sessionData.user!.id,
            email: sessionData.user!.email!,
            accessToken: sessionData.session!.access_token,
          },
        };
      }

      // Si no hay tokens en el URL, onAuthStateChange los detectará automáticamente
      return { success: true, message: "Sesión iniciada correctamente" };
    } catch (error: any) {
      return {
        success: false,
        message: error.message ?? "Error al iniciar sesión con Google",
      };
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

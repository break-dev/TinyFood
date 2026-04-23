import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { Platform } from "react-native";
import { supabase } from "../../../service/supabase.client";
import { AuthResponse } from "./responses";
import { AuthRegisterRequest } from "./requests";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
});

export class AuthService {
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // 1. Iniciar sesión nativamente con Google
      await GoogleSignin.hasPlayServices();
      
      // Forzar que siempre pregunte qué cuenta usar limpiando la sesión anterior
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignorar si no había sesión previa
      }

      const userInfo = await GoogleSignin.signIn();
      
      // 2. Extraer el idToken
      const idToken = userInfo?.data?.idToken;

      if (!idToken) {
        return { success: false, message: "No se pudo obtener el token de Google" };
      }

      // 3. Enviar el token a Supabase (crea o loguea al usuario automáticamente)
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        console.log("[Auth] Error signInWithIdToken:", error.message);
        return { success: false, message: error.message };
      }

      return { success: true, message: "Sesión iniciada correctamente con Google" };
    } catch (error: any) {
      console.error("[Auth] Error inesperado en Google Sign In:", error);
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

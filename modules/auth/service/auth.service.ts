import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from "../../../common/config/supabase.config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ApiResponse } from "@/common/service/common.responses";
import { RES_Auth } from "./auth.responses";
import {
  errorResponse,
  successResponse,
} from "@/common/functions/make-api-response";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ["profile", "email"],
});

export class AuthService {
  static async authWithGoogle(): Promise<ApiResponse<RES_Auth>> {
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
        return errorResponse("No se pudo obtener el token de Google");
      }

      // 3. Enviar el token a Supabase (crea o loguea al usuario automáticamente)
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        console.log("[Auth] Error signInWithIdToken:", error.message);
        return errorResponse(error.message);
      }

      return successResponse<RES_Auth>(
        null,
        "Sesión iniciada correctamente con Google",
      );
    } catch (error: any) {
      console.error("[Auth] Error inesperado en Google Sign In:", error);
      return errorResponse(
        error.message ?? "Error al iniciar sesión con Google",
      );
    }
  }

  static async crearSupabaseSessionFromUrl(
    url: string,
  ): Promise<ApiResponse<RES_Auth>> {
    try {
      console.log("[Auth] Procesando URL de retorno:", url);
      const { params, errorCode } = QueryParams.getQueryParams(url);

      if (errorCode) return { success: false, data: null, message: errorCode };

      const { access_token, refresh_token, code } = params;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) return errorResponse(error.message);
        return successResponse<RES_Auth>(null, "Sesión iniciada correctamente");
      }

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) return errorResponse(error.message);
        return successResponse<RES_Auth>(null, "Sesión iniciada correctamente");
      }

      return errorResponse("No se encontraron tokens en la respuesta");
    } catch (error: any) {
      console.error("[Auth] Error procesando sesión:", error);
      return errorResponse(error.message || "Error procesando sesión");
    }
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}

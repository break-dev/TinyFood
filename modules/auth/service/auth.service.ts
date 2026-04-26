import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from "../../../common/config/supabase.config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ApiResponse } from "@/common/service/common.responses";
import { RES_Auth } from "./auth.responses";
import {
  errorResponse,
  successResponse,
} from "@/common/utils/functions/make-api-response";
import { SocketService } from "@/common/service/socket.service";
import { socket } from "@/common/config/socket.config";

export class AuthService {
  /**
   * Configuración inicial de Google Sign In
   */
  static configure() {
    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        scopes: ["profile", "email"],
      });
    } catch (error) {
      console.error("[AuthService] Error al configurar GoogleSignin:", error);
    }
  }

  /**
   * Login con Google nativo + Supabase
   */
  static async authWithGoogle(): Promise<ApiResponse<RES_Auth>> {
    try {
      AuthService.configure(); // Asegurar configuración
      await GoogleSignin.hasPlayServices();
      try {
        await GoogleSignin.signOut();
      } catch (e) {}

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken;

      if (!idToken)
        return errorResponse("No se pudo obtener el token de Google");

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) return errorResponse(error.message);

      return successResponse<RES_Auth>(null, "Sesión iniciada");
    } catch (error: any) {
      return errorResponse(error.message ?? "Error en Google Sign In");
    }
  }

  /**
   * Procesa la URL de retorno para establecer la sesión de Supabase
   */
  static async crearSupabaseSessionFromUrl(
    url: string,
  ): Promise<ApiResponse<RES_Auth>> {
    try {
      const { params, errorCode } = QueryParams.getQueryParams(url);
      if (errorCode) return { success: false, data: null, message: errorCode };

      const { access_token, refresh_token, code } = params;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) return errorResponse(error.message);
        return successResponse<RES_Auth>(null, "Sesión iniciada");
      }

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) return errorResponse(error.message);
        return successResponse<RES_Auth>(null, "Sesión iniciada");
      }

      return errorResponse("No se encontraron tokens en la respuesta");
    } catch (error: any) {
      return errorResponse(error.message || "Error procesando sesión");
    }
  }

  /**
   * Verificar si el usuario ya existe en la API
   */
  static async autenticar(): Promise<ApiResponse<RES_Auth>> {
    return SocketService.emit("auth:autenticar");
  }

  /**
   * Registrar nuevo usuario con datos de perfil
   */
  static async registrar(perfil: any): Promise<ApiResponse<RES_Auth>> {
    return SocketService.emit("auth:registrar", perfil);
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
    socket.disconnect();
  }
}

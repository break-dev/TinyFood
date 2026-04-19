import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { supabase } from "../../../service/supabase.client";
import { AuthResponse } from "./responses";

export class AuthService {
  /**
   * Configura el SDK nativo de Google Sign-In.
   * Debe llamarse una sola vez al iniciar la app.
   */
  static configure() {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    });
  }

  /**
   * Flujo nativo de Google Sign-In.
   * Abre el diálogo de selección de cuenta de Google y obtiene el idToken
   * que luego valida Supabase. Sin navegador, sin deep links.
   */
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();

      if (response.type === "cancelled") {
        return { success: false, message: "Inicio de sesión cancelado" };
      }

      const idToken = response.data?.idToken;

      if (!idToken) {
        return { success: false, message: "No se obtuvo el token de Google" };
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) return { success: false, message: error.message };

      return {
        success: true,
        message: "Sesión iniciada correctamente",
        data: {
          userId: data.user!.id,
          email: data.user!.email!,
          accessToken: data.session!.access_token,
        },
      };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return { success: false, message: "Inicio de sesión cancelado" };
      }
      if (error.code === statusCodes.IN_PROGRESS) {
        return { success: false, message: "Inicio de sesión en curso" };
      }
      return {
        success: false,
        message: error.message ?? "Error al iniciar sesión con Google",
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Si falla el signOut de Google, continea con Supabase
    }
    await supabase.auth.signOut();
  }
}

import { supabase } from '../../core/service/supabase.client';
import { AuthLoginRequest, AuthRegisterRequest } from './requests';
import { AuthResponse } from './responses';

export class AuthService {
  static async loginWithEmail(payload: AuthLoginRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) return { success: false, message: error.message };

    return {
      success: true,
      message: 'Sesión iniciada correctamente',
      data: {
        userId: data.user!.id,
        email: data.user!.email!,
        accessToken: data.session!.access_token,
      },
    };
  }

  static async registerWithEmail(payload: AuthRegisterRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: { nombre: payload.name },
      },
    });

    if (error) return { success: false, message: error.message };

    // Si Supabase requiere confirmación de email, session puede ser null
    if (!data.session) {
      return {
        success: true,
        message: 'Revisa tu correo para confirmar tu cuenta',
      };
    }

    return {
      success: true,
      message: 'Cuenta creada correctamente',
      data: {
        userId: data.user!.id,
        email: data.user!.email!,
        accessToken: data.session.access_token,
      },
    };
  }

  static async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) return { success: false, message: error.message };

    return {
      success: true,
      message: 'Sesión iniciada con Google',
      data: {
        userId: data.user!.id,
        email: data.user!.email!,
        accessToken: data.session!.access_token,
      },
    };
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}

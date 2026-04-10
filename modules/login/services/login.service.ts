import { LoginRequest } from "./requests";
import { LoginResponse } from "./responses";

export class LoginService {
  /**
   * Ejecuta el inicio de sesión
   * @param payload RequestBody
   * @param onComplete Acción opcional a ejecutar en el `finally` (ej. detener loader)
   */
  public static async authenticate(
    payload: LoginRequest,
    onComplete?: () => void,
  ): Promise<LoginResponse> {
    try {
      // Mock Request
      // const response = await api.post<LoginResponse>('/auth/login', payload);
      // return response.data;

      // Delay artificial simulando red
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        message: "Sesión iniciada con éxito",
        data: {
          accessToken: "mock-jwt-token",
          refreshToken: "mock-refresh-token",
          user: {
            id: "1",
            name: "Demo Admin",
            email: payload.email || "correo@ejemplo.com",
          },
        },
      };
    } catch (error: any) {
      console.error("[LoginService] authenticate error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Error inesperado al intentar iniciar sesión.",
        error: error.message,
      };
    } finally {
      if (onComplete) {
        onComplete();
      }
    }
  }
}

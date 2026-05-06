import { socket } from "../config/socket.config";
import { supabase } from "../config/supabase.config";
import { ApiResponse } from "./common.responses";

export class SocketService {
  /**
   * Desconecta el socket manualmente y limpia cualquier estado.
   */
  static disconnect() {
    if (socket.connected) {
      console.log("[SocketService] Desconectando socket...");
      socket.disconnect();
    }
  }

  /**
   * Helper universal para emitir eventos por socket con el token de Supabase.
   */
  static async emit<T = any>(
    event: string,
    body: any = {},
    timeoutMs: number = 8000
  ): Promise<ApiResponse<T>> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token && event !== "auth:autenticar") {
      return {
        success: false,
        message: "No hay sesión activa",
        data: null as T,
      };
    }

    return new Promise((resolve) => {
      // Si el socket está desconectado, intentamos conectar
      if (!socket.connected) {
        console.log("[SocketService] Intentando conectar socket...");
        socket.auth = { token };
        socket.connect();
      }

      const timeoutId = setTimeout(() => {
        console.log(`[SocketService] Timeout en evento: ${event}`);
        resolve({
          success: false,
          message: "El servidor tardó demasiado en responder",
          data: null as T,
        });
      }, timeoutMs);

      socket.emit(
        event,
        { event, token, body },
        (response: ApiResponse<T>) => {
          clearTimeout(timeoutId);
          resolve(response);
        },
      );
    });
  }
}

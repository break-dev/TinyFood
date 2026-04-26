import { socket } from "../config/socket.config";
import { supabase } from "../config/supabase.config";
import { ApiResponse } from "./common.responses";

export class SocketService {
  /**
   * Helper universal para emitir eventos por socket con el token de Supabase.
   */
  static async emit<T = any>(
    event: string,
    body: any = {},
    timeoutMs: number = 10000
  ): Promise<ApiResponse<T>> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    return new Promise((resolve, reject) => {
      if (!socket.connected) socket.connect();

      const timeoutId = setTimeout(() => {
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

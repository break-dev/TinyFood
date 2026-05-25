import { SocketService } from "@/common/service/socket.service";
import { ApiResponse } from "@/common/service/common.responses";

export interface IAConfiguracion {
  dificultad: "rapido" | "chef";
  estilosComida: string[];
  equipamiento: string[];
}

export class ConfiguracionService {
  /**
   * Guarda las preferencias de IA y cocina del usuario en la base de datos remota
   */
  static async guardarPreferenciasIA(
    configuracion: IAConfiguracion
  ): Promise<ApiResponse<any>> {
    return SocketService.emit("usuario:actualizar_perfil", {
      configuracion,
    });
  }
}

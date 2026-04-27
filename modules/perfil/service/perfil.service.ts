import { SocketService } from "@/common/service/socket.service";
import { ApiResponse } from "@/common/service/common.responses";
import { REQ_ActualizarPerfil } from "./perfil.requests";
import { RES_Perfil } from "./perfil.responses";

export class PerfilService {
  static async actualizarPerfil(
    data: REQ_ActualizarPerfil,
  ): Promise<ApiResponse<RES_Perfil>> {
    return SocketService.emit("usuario:actualizar_perfil", data);
  }
}
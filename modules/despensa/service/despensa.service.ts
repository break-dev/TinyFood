import { SocketService } from "@/common/service/socket.service";
import { ApiResponse } from "@/common/service/common.responses";
import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";
import { RES_Comida, RES_TipDiario, RES_Recetas } from "./despensa.responses";
import {
  REQ_ActualizarComida,
  REQ_RegistrarComida,
  REQ_AnalizarImagen,
  RES_AnalizarImagen,
} from "./despensa.requests";

export class DespensaService {
  static async listarComida(): Promise<ApiResponse<RES_Comida[]>> {
    return SocketService.emit("despensa:listar_comida", {});
  }

  static async registrarComida(
    data: REQ_RegistrarComida,
  ): Promise<ApiResponse<RES_Comida>> {
    return SocketService.emit("despensa:registrar_comida", data);
  }

  static async actualizarComida(
    data: REQ_ActualizarComida,
  ): Promise<ApiResponse<RES_Comida>> {
    return SocketService.emit("despensa:actualizar_comida", data);
  }

  static async eliminarComida(id: number): Promise<ApiResponse<null>> {
    return SocketService.emit("despensa:eliminar_comida", { id });
  }
  static async analizarImagen(
    data: REQ_AnalizarImagen,
  ): Promise<ApiResponse<RES_AnalizarImagen>> {
    return SocketService.emit("despensa:analizar_imagen", data);
  }
  static async tipDiario(): Promise<ApiResponse<RES_TipDiario>> {
    return SocketService.emit("despensa:tip_diario", {});
  }

  static async recomendarRecetas(
    cantidad: number = 3,
  ): Promise<ApiResponse<RES_Recetas>> {
    return SocketService.emit("despensa:recomendar_recetas", { cantidad });
  }
}

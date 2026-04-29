import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";

export interface RES_Comida {
  id: number;
  id_usuario: number;
  nombre: string;
  cantidad: string;
  descripcion?: string;
  incluir_hora: boolean;
  fecha_compra?: string;
  hora_compra?: string;
  fecha_vencimiento?: string;
  hora_vencimiento?: string;
  tags?: string;
  created_at: string;
  estado: EstadoComida;
}

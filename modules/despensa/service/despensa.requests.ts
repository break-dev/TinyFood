import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";

export interface REQ_RegistrarComida {
  nombre: string;
  cantidad: string;
  descripcion?: string;
  incluir_hora?: boolean;
  fecha_compra?: string;
  hora_compra?: string;
  fecha_vencimiento?: string;
  hora_vencimiento?: string;
  tags?: string;
  estado?: EstadoComida;
}

export interface REQ_ActualizarComida extends Partial<REQ_RegistrarComida> {
  id: number;
}

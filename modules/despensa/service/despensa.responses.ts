import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";

export interface RES_Comida {
  id: number;
  id_usuario: number;
  //
  nombre: string;
  cantidad: string; // 1/4, una porcion, 1kg, etc
  descripcion?: string;
  //
  // se usa para comidas que se usan apenas se compran como
  // algo ya preparado, o algo que se quiere usar luego de
  // X horas etc. Y para comida que vencen pronto.
  incluir_hora: boolean;
  fecha_compra?: string;
  hora_compra?: string;
  //
  fecha_vencimiento?: string;
  hora_vencimiento?: string;
  //
  tags?: string; // etiquetas autollenadas por IA, ej: vegetariano, vegano, etc.
  //
  created_at: string;
  estado: EstadoComida;
}

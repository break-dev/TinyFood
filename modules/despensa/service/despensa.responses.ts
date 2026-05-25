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
export interface RES_TipDiario {
  titulo: string;
  consejo: string;
  urgencia: 'alta' | 'media' | 'baja';
  emoji: string;
  hay_tip: boolean;
  alimentos_proximos?: number;
}
 
export interface RES_Receta {
  nombre: string;
  descripcion: string;
  tiempo_minutos: number;
  dificultad: 'fácil' | 'media' | 'difícil';
  porciones: number;
  ingredientes_usados: string[];
  ingredientes_extra: string[];
  pasos: string[];
  calorias_aprox: number;
  emoji: string;
}
 
export interface RES_Recetas {
  recetas: RES_Receta[];
  total: number;
  ingredientes_usados: number;
}

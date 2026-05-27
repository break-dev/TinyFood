import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";

export interface RES_Comida {
  id: number;
  id_usuario: number;
  nombre: string;
  cantidad: string;
  descripcion: string | null;
  fecha_vencimiento: Date | null;
  tags: string[];
  created_at: Date;
  estado: EstadoComida;
}

export interface RES_TipDiario {
  titulo: string;
  consejo: string;
  urgencia: "alta" | "media" | "baja";
  emoji: string;
  hay_tip: boolean;
  alimentos_proximos?: number;
}

export interface RES_Receta {
  nombre: string;
  descripcion: string;
  tiempo_minutos: number;
  dificultad: "fácil" | "media" | "difícil";
  porciones: number;
  ingredientes_usados: string[];
  ingredientes_extra: string[];
  pasos: string[];
  calorias_aprox: number;
  emoji: string;
}

export interface RES_AnalizarImagenItem {
  nombre: string;
  cantidad: string;
  categoria: string;
  tags: string[];
  descripcion: string;
  dias_duracion_estimados: number;
  fecha_vencimiento?: string; // ISO string
}

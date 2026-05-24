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
export interface REQ_AnalizarImagen {
  foto_b64: string;    // base64 de la imagen
  mime_type?: string;  // por defecto 'image/jpeg'
}
 
export interface RES_AnalizarImagen {
  nombre: string;
  cantidad: string;
  categoria: string;
  tags: string;
  descripcion: string;
  dias_duracion_estimados: number;
  fecha_vencimiento?: string; // ISO string
  confianza: 'alta' | 'media' | 'baja';
}

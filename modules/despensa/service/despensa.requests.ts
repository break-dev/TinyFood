import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";

export interface REQ_RegistrarComida {
  nombre: string;
  cantidad: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  tags?: string[];
  estado?: EstadoComida;
}

export interface REQ_ActualizarComida extends Partial<REQ_RegistrarComida> {
  id: number;
}

export interface REQ_AnalizarImagen {
  foto_b64: string; // base64 de la imagen
  mime_type?: string; // por defecto 'image/jpeg'
}

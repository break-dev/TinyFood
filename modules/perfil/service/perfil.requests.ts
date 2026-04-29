interface Condicion {
  nombre: string;
  descripcion: string;
}

export interface REQ_ActualizarPerfil {
  peso?: number;
  talla?: number;
  nivel_actividad?: number;
  informacion_medica?: Condicion[];
  alimentos_prohibidos?: string[];
  preferencias?: string[];
  fecha_nacimiento?: string;
}

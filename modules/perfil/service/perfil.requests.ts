import { ObjetivoFisico } from "@/common/utils/enums/objetivo-fisico";

interface Condicion {
  nombre: string;
  descripcion: string;
}

export interface REQ_ActualizarPerfil {
  nombre?: string;
  foto_b64?: string | null;
  peso?: number;
  talla?: number;
  nivel_actividad?: number;
  genero?: string;
  informacion_medica?: Condicion[];
  alimentos_prohibidos?: string[];
  preferencias?: string[];
  fecha_nacimiento?: string;
  objetivo_fisico?: ObjetivoFisico;
}

import { Genero } from "@/common/utils/enums/genero";
import { ObjetivoFisico } from "@/common/utils/enums/objetivo-fisico";

export interface RES_Auth {
  id: number;
  id_supabase: string;
  //
  nombre: string;
  fecha_nacimiento?: string | null;
  url_foto?: string | null;
  genero?: Genero;
  //
  peso?: number | null;
  talla?: number | null;
  //
  nivel_actividad?: number | null; // del 1 al 5
  informacion_medica?: { nombre: string; descripcion?: string }[] | null;
  alimentos_prohibidos?: string[] | null;
  preferencias?: string[] | null;
  objetivo_fisico?: ObjetivoFisico | null;
  //
  created_at?: Date | string;
}

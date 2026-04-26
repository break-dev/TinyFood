export interface RES_Auth {
  id: number;
  id_supabase: string;
  nombre: string;
  url_foto?: string | null;
  peso?: number | null;
  talla?: number | null;
  fecha_nacimiento?: string | null;
  nivel_actividad?: number | null; // del 1 al 5
  informacion_medica?: string[] | null;
  alimentos_prohibidos?: string[] | null;
  preferencias?: string[] | null;
  created_at?: Date | string;
}

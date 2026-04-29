export interface RES_Perfil {
  id: number;
  id_supabase: string;
  nombre: string;
  url_foto?: string | null;
  peso?: number | null;
  talla?: number | null;
  fecha_nacimiento?: string | null;
  nivel_actividad?: number | null;
  informacion_medica?: string | null;
  alimentos_prohibidos: string[];
  preferencias: string[];
  created_at: string;
}

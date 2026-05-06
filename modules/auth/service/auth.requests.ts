export interface REQ_RegistrarUsuario {
  nombre: string;
  fecha_nacimiento?: string | null;
  //
  peso?: number | null;
  talla?: number | null;
  //
  nivel_actividad?: number | null; // del 1 al 5
  informacion_medica?: { nombre: string; descripcion?: string }[] | null;
  alimentos_prohibidos?: string[] | null;
  preferencias?: string[] | null;
}

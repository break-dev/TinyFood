import { Genero } from "@/common/utils/enums/genero";
import { ObjetivoFisico } from "@/common/utils/enums/objetivo-fisico";

export interface REQ_RegistrarUsuario {
  nombre: string;
  fecha_nacimiento?: string | null;
  genero: Genero;
  //
  peso?: number | null;
  talla?: number | null;
  //
  nivel_actividad?: number | null; // del 1 al 5
  informacion_medica?: { nombre: string; descripcion?: string }[] | null;
  alimentos_prohibidos?: string[] | null;
  preferencias?: string[] | null;
  objetivo_fisico?: ObjetivoFisico | null;
  foto_b64?: string | null;
}

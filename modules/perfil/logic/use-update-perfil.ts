import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "@/common/logic/use-auth-state";
import { PerfilService } from "../service/perfil.service";
import * as Haptics from "expo-haptics";
import { RES_Auth } from "@/modules/auth/service/auth.responses";
import { Genero } from "@/common/utils/enums/genero";
import { ObjetivoFisico } from "@/common/utils/enums/objetivo-fisico";

interface Condicion {
  nombre: string;
  descripcion: string;
}

interface FormData {
  nombre: string;
  fecha_nacimiento: string;
  peso: string;
  talla: string;
  nivel_actividad: number;
  informacion_medica: Condicion[];
  alimentos_prohibidos: string;
  preferencias: string;
  url_foto: string | null;
  localUri?: string;
  genero: Genero;
  objetivo_fisico: ObjetivoFisico;
}

const buildInitialForm = (usuario: any): FormData => ({
  nombre: usuario?.nombre ?? "",
  fecha_nacimiento: usuario?.fecha_nacimiento
    ? usuario.fecha_nacimiento.toString().split("T")[0]
    : "",
  peso: usuario?.peso?.toString() ?? "",
  talla: usuario?.talla?.toString() ?? "",
  nivel_actividad: usuario?.nivel_actividad ?? 1,
  informacion_medica: Array.isArray(usuario?.informacion_medica)
    ? usuario.informacion_medica.map((item: any) =>
        typeof item === "object" && item !== null
          ? { nombre: item.nombre ?? "", descripcion: item.descripcion ?? "" }
          : { nombre: String(item), descripcion: "" },
      )
    : [],
  alimentos_prohibidos: Array.isArray(usuario?.alimentos_prohibidos)
    ? usuario.alimentos_prohibidos.join(", ")
    : "",
  preferencias: Array.isArray(usuario?.preferencias)
    ? usuario.preferencias.join(", ")
    : "",
  url_foto: usuario?.url_foto ?? null,
  genero: usuario?.genero ?? Genero.Masculino,
  objetivo_fisico: usuario?.objetivo_fisico ?? ObjetivoFisico.Mantener,
});

export function useUpdatePerfil() {
  const { usuario, token, setUser } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>(() =>
    buildInitialForm(usuario),
  );

  useEffect(() => {
    if (usuario) {
      setFormData(buildInitialForm(usuario));
    }
  }, [usuario]); // Se dispara cada vez que el objeto usuario cambia

  const resetForm = useCallback(() => {
    setFormData(buildInitialForm(usuario));
  }, [usuario]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const foto =
        formData.url_foto === null
          ? null
          : formData.url_foto && !formData.url_foto.startsWith("http")
            ? formData.url_foto
            : undefined;

      const res = await PerfilService.actualizarPerfil({
        nombre: formData.nombre || undefined,
        peso: parseFloat(formData.peso) || undefined,
        talla: parseFloat(formData.talla) || undefined,
        nivel_actividad: formData.nivel_actividad,
        informacion_medica: formData.informacion_medica,
        alimentos_prohibidos: formData.alimentos_prohibidos
          ? formData.alimentos_prohibidos.split(",").map((s) => s.trim())
          : [],
        preferencias: formData.preferencias
          ? formData.preferencias.split(",").map((s) => s.trim())
          : [],
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
        genero: formData.genero,
        objetivo_fisico: formData.objetivo_fisico,
        foto_b64: foto,
      });

      if (res.success && res.data) {
        await setUser(res.data as unknown as RES_Auth, token);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
    } catch (error) {
      console.error("[useUpdatePerfil] Error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return { formData, setFormData, isLoading, resetForm, handleSave };
}

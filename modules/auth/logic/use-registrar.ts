import { useEffect, useState } from "react";
import { AuthService } from "../service/auth.service";
import { useAuthStore } from "@/common/stores/auth.store";
import { useRouter } from "@/common/logic/use-router";
import { supabase } from "@/common/config/supabase.config";
import * as Haptics from "expo-haptics";

import { Genero } from "@/common/utils/enums/genero";
import { ObjetivoFisico } from "@/common/utils/enums/objetivo-fisico";

/**
 * Hook para gestionar el flujo de registro multi-paso.
 */
export const useRegistrar = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    nombre: "",
    peso: "",
    talla: "",
    fecha_nacimiento: "",
    nivel_actividad: 2,
    genero: Genero.Masculino,
    objetivo_fisico: ObjetivoFisico.Mantener,
    foto_b64: "",
    localUri: "",
    alimentos_prohibidos: [] as string[],
    preferencias: [] as string[],
    informacion_medica: [] as { nombre: string; descripcion: string }[],
  });

  const { setUser } = useAuthStore();
  const router = useRouter();

  // Pre-llenar datos desde Supabase (si vienen de Google/Social)
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          nombre:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            prev.nombre,
          localUri: user.user_metadata?.avatar_url || prev.localUri,
          // Si el proveedor social diera la fecha de nacimiento (raro pero posible)
          fecha_nacimiento:
            user.user_metadata?.birthdate || prev.fecha_nacimiento,
        }));
      }
    });
  }, []);

  /**
   * Avanzar al siguiente paso o finalizar el registro.
   */
  const nextStep = () => {
    if (step < totalSteps) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  /**
   * Retroceder al paso anterior.
   */
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  /**
   * Procesa los datos del formulario para enviarlos a la API.
   */
  const getPreparedData = () => {
    // Validar y formatear fecha de nacimiento
    let fechaNac = undefined;
    if (formData.fecha_nacimiento) {
      if (formData.fecha_nacimiento.includes("-")) {
        const date = new Date(formData.fecha_nacimiento);
        if (!isNaN(date.getTime())) fechaNac = date.toISOString();
      } else if (
        formData.fecha_nacimiento.includes("/") &&
        formData.fecha_nacimiento.length === 10
      ) {
        const [day, month, year] = formData.fecha_nacimiento.split("/");
        const parsedDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
        );
        if (!isNaN(parsedDate.getTime())) fechaNac = parsedDate.toISOString();
      }
    }

    return {
      nombre: formData.nombre,
      peso: parseFloat(formData.peso) || undefined,
      talla: parseFloat(formData.talla) || undefined,
      fecha_nacimiento: fechaNac,
      nivel_actividad: formData.nivel_actividad,
      genero: formData.genero,
      objetivo_fisico: formData.objetivo_fisico,
      foto_b64: formData.foto_b64 || undefined,
      informacion_medica: formData.informacion_medica,
      alimentos_prohibidos: formData.alimentos_prohibidos,
      preferencias: formData.preferencias,
    };
  };

  /**
   * Finalizar el registro enviando todos los datos recolectados.
   */
  const handleFinish = async () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const preparedData = getPreparedData();
      const apiRes = await AuthService.registrar(preparedData);

      if (apiRes.success) {
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
      } else {
        throw new Error(apiRes.message as string);
      }
    } catch (error: any) {
      console.error("[useRegistrar] Error al finalizar:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    totalSteps,
    formData,
    setFormData,
    loading,
    nextStep,
    prevStep,
    handleFinish,
  };
};

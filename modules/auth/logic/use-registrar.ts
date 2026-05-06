import { useEffect, useState } from "react";
import { AuthService } from "../service/auth.service";
import { useAuthStore } from "@/common/stores/auth.store";
import { useRouter } from "@/common/logic/use-router";
import { supabase } from "@/common/config/supabase.config";
import * as Haptics from "expo-haptics";

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
   * Saltar el registro detallado y crear perfil con datos básicos.
   */
  const handleSkip = async () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const apiRes = await AuthService.registrar({
        nombre:
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          undefined,
      });

      if (apiRes.success) {
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
        // Redirección automática via layout
      }
    } catch (e) {
      console.error("[useRegistrar] Error al saltar:", e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Finalizar el registro enviando todos los datos recolectados.
   */
  const handleFinish = async () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      // Enviar directamente los arreglos nativos del estado
      const alimentosArr = formData.alimentos_prohibidos;
      const preferenciasArr = formData.preferencias;

      // Convertir informacion médica ya está en el formato correcto
      const infoMedicaArr = formData.informacion_medica;

      // Validar y formatear fecha de nacimiento (DD/MM/YYYY -> ISO)
      let fechaNac = undefined;
      if (
        formData.fecha_nacimiento &&
        formData.fecha_nacimiento.length === 10
      ) {
        const [day, month, year] = formData.fecha_nacimiento.split("/");
        if (day && month && year) {
          // Javascript Date usa meses del 0 al 11, por eso restamos 1 al mes
          const parsedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
          );
          if (!isNaN(parsedDate.getTime())) {
            fechaNac = parsedDate.toISOString();
          }
        }
      }

      const apiRes = await AuthService.registrar({
        nombre: formData.nombre || undefined,
        peso: parseFloat(formData.peso) || undefined,
        talla: parseFloat(formData.talla) || undefined,
        fecha_nacimiento: fechaNac,
        nivel_actividad: formData.nivel_actividad,
        informacion_medica: infoMedicaArr,
        alimentos_prohibidos: alimentosArr,
        preferencias: preferenciasArr,
      });

      if (apiRes.success) {
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
        // Redirección automática via layout
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
    handleSkip,
  };
};

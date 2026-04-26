import { useState } from "react";
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
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    peso: "",
    talla: "",
    nivel_actividad: 2,
    alimentos_prohibidos: "",
    preferencias: "",
  });

  const { setUser } = useAuthStore();
  const router = useRouter();

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
      const apiRes = await AuthService.registrar({
        nombre: "Usuario",
      });

      if (apiRes.success) {
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
        router.replace("/(tabs)" as any);
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
      const apiRes = await AuthService.registrar({
        peso: parseFloat(formData.peso) || undefined,
        talla: parseFloat(formData.talla) || undefined,
        nivel_actividad: formData.nivel_actividad,
        alimentos_prohibidos: formData.alimentos_prohibidos,
        preferencias: formData.preferencias,
      });

      if (apiRes.success) {
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
        router.replace("/(tabs)" as any);
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

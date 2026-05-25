import { useState, useEffect } from "react";
import { useAuthState } from "@/common/logic/use-auth-state";
import { useConfigStore } from "../store/config.store";
import { ConfiguracionService, IAConfiguracion } from "../service/configuracion.service";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

export function useConfiguracion() {
  const { usuario, token, setUser } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);

  // Configuraciones locales desde Zustand (tema, haptics, caducidad, recordatorios)
  const localConfig = useConfigStore();

  // Estados locales para el formulario de IA (remoto)
  const [dificultad, setDificultad] = useState<"rapido" | "chef">("rapido");
  const [estilosComida, setEstilosComida] = useState<string[]>([]);
  const [equipamiento, setEquipamiento] = useState<string[]>([]);

  // Inicializar preferencias de IA con las configuraciones del usuario logueado
  useEffect(() => {
    if (usuario?.configuracion) {
      const config = usuario.configuracion as Partial<IAConfiguracion>;
      setDificultad(config.dificultad || "rapido");
      setEstilosComida(config.estilosComida || []);
      setEquipamiento(config.equipamiento || []);
    }
  }, [usuario]);

  // Guardar preferencias de IA en base de datos
  const handleSaveIA = async () => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsLoading(true);
    try {
      const payload: IAConfiguracion = {
        dificultad,
        estilosComida,
        equipamiento,
      };

      const res = await ConfiguracionService.guardarPreferenciasIA(payload);

      if (res.success && res.data) {
        await setUser(res.data, token);
        if (localConfig.vibracionHaptics) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Toast.show({
          type: "success",
          text1: "Guardado",
          text2: "Preferencias de cocina actualizadas correctamente ✨",
        });
        return true;
      } else {
        throw new Error(res.message || "Error al actualizar las preferencias");
      }
    } catch (error) {
      console.error("[useConfiguracion] Error guardando preferencias de IA:", error);
      if (localConfig.vibracionHaptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron guardar las preferencias 😢",
      });
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Acciones para alternar chips de comida
  const toggleEstilo = (estilo: string) => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEstilosComida((prev) =>
      prev.includes(estilo) ? prev.filter((item) => item !== estilo) : [...prev, estilo]
    );
  };

  // Acciones para alternar equipamiento
  const toggleEquipamiento = (item: string) => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEquipamiento((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Cambiar dificultad (Rápido vs Chef)
  const changeDificultad = (dificil: "rapido" | "chef") => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDificultad(dificil);
  };

  return {
    localConfig,
    dificultad,
    estilosComida,
    equipamiento,
    toggleEstilo,
    toggleEquipamiento,
    changeDificultad,
    handleSaveIA,
    isLoading,
  };
}

import { useState } from "react";
import { DespensaService } from "../service/despensa.service";
import { RES_Receta } from "../service/despensa.responses";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

export function useRecetas() {
  const [recetas, setRecetas] = useState<RES_Receta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [yaGeneradas, setYaGeneradas] = useState(false);

  const generarRecetas = async (cantidad: number = 3) => {
    try {
      setCargando(true);
      const res = await DespensaService.recomendarRecetas(cantidad);
      if (res.success && res.data) {
        setRecetas(res.data);
        setYaGeneradas(true);
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Sin recetas",
          text2: res.message ?? "Agrega alimentos a tu despensa primero.",
        });
      }
    } catch (error) {
      console.error("[useRecetas] Error:", error);
      Toast.show({ type: "error", text1: "Error al generar recetas" });
    } finally {
      setCargando(false);
    }
  };

  const limpiarRecetas = () => {
    setRecetas([]);
    setYaGeneradas(false);
  };

  return { recetas, cargando, yaGeneradas, generarRecetas, limpiarRecetas };
}

import { Dispatch, SetStateAction } from "react";
import { DespensaService } from "../service/despensa.service";
import { RES_Comida } from "../service/despensa.responses";
import { REQ_ActualizarComida } from "../service/despensa.requests";
import * as Haptics from "expo-haptics";

export function useActualizarDespensa(
  setComidas: Dispatch<SetStateAction<RES_Comida[]>>,
) {
  const actualizarComida = async (data: REQ_ActualizarComida) => {
    try {
      const res = await DespensaService.actualizarComida(data);
      if (res && res.success && res.data) {
        setComidas((prev) =>
          prev.map((c) => (c.id === data.id ? res.data! : c)),
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      if (!res)
        console.error(
          "[useActualizarDespensa] Actualización: Respuesta nula del servidor",
        );
    } catch (error) {
      console.error("[useActualizarDespensa] Error actualizar:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return false;
  };

  return { actualizarComida };
}

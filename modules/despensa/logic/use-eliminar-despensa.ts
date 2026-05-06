import { Dispatch, SetStateAction } from "react";
import { DespensaService } from "../service/despensa.service";
import { RES_Comida } from "../service/despensa.responses";
import * as Haptics from "expo-haptics";

export function useEliminarDespensa(
  setComidas: Dispatch<SetStateAction<RES_Comida[]>>,
) {
  const eliminarComida = async (id: number) => {
    try {
      const res = await DespensaService.eliminarComida(id);
      if (res && res.success) {
        setComidas((prev) => prev.filter((c) => c.id !== id));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      if (!res)
        console.error(
          "[useEliminarDespensa] Eliminación: Respuesta nula del servidor",
        );
    } catch (error) {
      console.error("[useEliminarDespensa] Error eliminar:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return false;
  };

  return { eliminarComida };
}

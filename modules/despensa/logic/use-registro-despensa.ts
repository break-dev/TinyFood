import { Dispatch, SetStateAction } from "react";
import { DespensaService } from "../service/despensa.service";
import { RES_Comida } from "../service/despensa.responses";
import { REQ_RegistrarComida } from "../service/despensa.requests";
import * as Haptics from "expo-haptics";

export function useRegistroDespensa(
  setComidas: Dispatch<SetStateAction<RES_Comida[]>>,
) {
  const registrarComida = async (data: REQ_RegistrarComida) => {
    try {
      const res = await DespensaService.registrarComida(data);
      if (res && res.success && res.data) {
        setComidas((prev) => [res.data!, ...prev]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      if (!res)
        console.error(
          "[useRegistroDespensa] Registro: Respuesta nula del servidor",
        );
    } catch (error) {
      console.error("[useRegistroDespensa] Error registrar:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return false;
  };

  return { registrarComida };
}

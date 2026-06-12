import { RES_Comida } from "../service/despensa.responses";
import { SocketService } from "@/common/service/socket.service";
import Toast from "react-native-toast-message";

export function useConsumirDespensa(
  setComidas: React.Dispatch<React.SetStateAction<RES_Comida[]>>
) {
  const consumirComida = async (id: number, cantidadRestante: string) => {
    try {
      const response = await SocketService.emit("despensa:consumir_comida", {
        id,
        cantidadRestante,
      });

      if (response?.success && response.data) {
        setComidas((prev) =>
          prev.map((c) => (c.id === id ? response.data : c))
        );
        Toast.show({
          type: "success",
          text1: "¡Consumo registrado!",
          text2: response.message || "Se actualizó la despensa",
        });
        return true;
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response?.message || "Hubo un problema al registrar el consumo",
        });
        return false;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo comunicar con el servidor",
      });
      return false;
    }
  };

  return { consumirComida };
}

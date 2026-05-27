import { useState } from "react";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

import { DespensaService } from "../service/despensa.service";
import { RES_AnalizarImagenItem } from "../service/despensa.responses";
import {
  useImagePicker,
  ImagePickerResult,
} from "@/common/logic/use-image-picker";

// Hook que abre la cámara/galería, envía la imagen al backend y devuelve
// los datos del alimento identificado para auto-rellenar el formulario.
interface UseAnalizarImagenReturn {
  analizando: boolean;
  abrirCamara: () => Promise<RES_AnalizarImagenItem[] | null>;
  abrirGaleria: () => Promise<RES_AnalizarImagenItem[] | null>;
}

export function useAnalizarImagen(): UseAnalizarImagenReturn {
  const [analizando, setAnalizando] = useState(false);
  const { pickFromCamera, pickFromGallery } = useImagePicker();

  //  Utilidad: procesar y enviar la imagen seleccionada
  const enviarImagen = async (
    result: ImagePickerResult | null,
  ): Promise<RES_AnalizarImagenItem[] | null> => {
    if (!result) return null;

    setAnalizando(true);

    try {
      const response = await DespensaService.analizarImagen({
        foto_b64: result.dataUrl,
      });

      if (!response.success || !response.data) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Toast.show({
          type: "error",
          text1: "No identificado",
          text2: response.message ?? "Intenta con una foto más clara.",
        });
        return null;
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const nombres = response.data.map((item) => item.nombre).join(", ");
      Toast.show({
        type: "success",
        text1:
          response.data.length > 1
            ? "¡Alimentos identificados! 🎉"
            : "¡Alimento identificado! 🎉",
        text2: nombres,
      });

      return response.data;
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo analizar la imagen.",
      });
      return null;
    } finally {
      setAnalizando(false);
    }
  };

  // Abrir cámara
  const abrirCamara = async (): Promise<RES_AnalizarImagenItem[] | null> => {
    const result = await pickFromCamera();
    return enviarImagen(result);
  };

  // Abrir galería
  const abrirGaleria = async (): Promise<RES_AnalizarImagenItem[] | null> => {
    const result = await pickFromGallery();
    return enviarImagen(result);
  };

  return { analizando, abrirCamara, abrirGaleria };
}

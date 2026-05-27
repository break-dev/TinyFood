import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { getDataUrlFromB64 } from "@/common/utils/functions/get-data-url-from-b64";

export interface ImagePickerResult {
  base64: string;
  dataUrl: string;
  uri: string;
}

export function useImagePicker() {
  const pickFromCamera = async (): Promise<ImagePickerResult | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Sin permiso",
          text2: "Necesitamos acceso a la cámara.",
        });
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0] || !result.assets[0].base64) {
        return null;
      }

      const asset = result.assets[0];
      const base64 = asset.base64!;
      const dataUrl = await getDataUrlFromB64(base64);

      return {
        base64,
        dataUrl,
        uri: asset.uri,
      };
    } catch (error) {
      console.error("[useImagePicker] Error en cámara:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al abrir la cámara.",
      });
      return null;
    }
  };

  const pickFromGallery = async (): Promise<ImagePickerResult | null> => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Sin permiso",
          text2: "Necesitamos acceso a la galería.",
        });
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result.canceled || !result.assets?.[0] || !result.assets[0].base64) {
        return null;
      }

      const asset = result.assets[0];
      const base64 = asset.base64!;
      const dataUrl = await getDataUrlFromB64(base64);

      return {
        base64,
        dataUrl,
        uri: asset.uri,
      };
    } catch (error) {
      console.error("[useImagePicker] Error en galería:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al abrir la galería.",
      });
      return null;
    }
  };

  return {
    pickFromCamera,
    pickFromGallery,
  };
}

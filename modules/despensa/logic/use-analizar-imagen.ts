// Hook que abre la cámara/galería, envía la imagen al backend y devuelve
// los datos del alimento identificado para auto-rellenar el formulario.


import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import { DespensaService } from '../service/despensa.service';
import { RES_AnalizarImagen } from '../service/despensa.requests';

interface UseAnalizarImagenReturn {
  analizando: boolean;
  abrirCamara: () => Promise<RES_AnalizarImagen | null>;
  abrirGaleria: () => Promise<RES_AnalizarImagen | null>;
}

export function useAnalizarImagen(): UseAnalizarImagenReturn {
  const [analizando, setAnalizando] = useState(false);

  // ── Utilidad: procesar la imagen seleccionada ───────────────────────────────
  const procesarImagen = async (
    result: ImagePicker.ImagePickerResult,
  ): Promise<RES_AnalizarImagen | null> => {
    if (result.canceled || !result.assets?.[0]) return null;

    const asset = result.assets[0];

    if (!asset.base64) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo leer la imagen. Intenta de nuevo.',
      });
      return null;
    }

    setAnalizando(true);

    try {
      // Detectar mimeType desde la URI
      const extension = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const mimeMap: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
      };
      const mime_type = mimeMap[extension] ?? 'image/jpeg';

      const response = await DespensaService.analizarImagen({
        foto_b64: asset.base64,
        mime_type,
      });

      if (!response.success || !response.data) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Toast.show({
          type: 'error',
          text1: 'No identificado',
          text2: response.message ?? 'Intenta con una foto más clara.',
        });
        return null;
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: '¡Alimento identificado! 🎉',
        text2: response.data.nombre,
      });

      return response.data;
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo analizar la imagen.',
      });
      return null;
    } finally {
      setAnalizando(false);
    }
  };

  // ── Abrir cámara ────────────────────────────────────────────────────────────
  const abrirCamara = async (): Promise<RES_AnalizarImagen | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Sin permiso',
        text2: 'Necesitamos acceso a la cámara.',
      });
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    return procesarImagen(result);
  };

  // ── Abrir galería ───────────────────────────────────────────────────────────
  const abrirGaleria = async (): Promise<RES_AnalizarImagen | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Sin permiso',
        text2: 'Necesitamos acceso a la galería.',
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

    return procesarImagen(result);
  };

  return { analizando, abrirCamara, abrirGaleria };
}
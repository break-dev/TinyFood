import { useState, useEffect } from "react";
import { AuthService } from "../service/auth.service";
import { useAuthStore } from "@/common/stores/auth.store";
import { useRouter } from "@/common/logic/use-router";
import { supabase } from "@/common/config/supabase.config";
import { routes } from "@/common/utils/variables/routes";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

/**
 * Hook para el Paso 1: Autenticación con Google/Supabase
 * y verificación de existencia de perfil en la API.
 */
export const useAutenticar = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  // Animaciones
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  /**
   * Acción principal de login
   */
  const handleAuth = async () => {
    setLoading(true);
    try {
      console.log("[useAutenticar] Iniciando authWithGoogle...");
      // 1. Login nativo con Google + Supabase Auth
      const googleRes = await AuthService.authWithGoogle();
      console.log("[useAutenticar] Resultado googleRes:", googleRes);
      if (!googleRes.success) {
        throw new Error(googleRes.message as string);
      }

      console.log("[useAutenticar] Solicitando autenticar a la API...");
      // 2. Preguntar a la API si el usuario ya tiene perfil (Paso 1 del diagrama)
      const apiRes = await AuthService.autenticar();
      console.log("[useAutenticar] Resultado apiRes:", apiRes);

      if (apiRes.success) {
        // CASO: Usuario YA EXISTE
        console.log("[useAutenticar] Usuario existe, guardando en store...");
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
        // NO hacemos router.replace aquí.
        // El PublicLayout detectará el 'usuario' y hará el Redirect solo.
      } else if (apiRes.message === "USER_NOT_FOUND") {
        // CASO: Usuario NO EXISTE
        console.log(
          "[useAutenticar] Usuario NO existe, navegando a register...",
        );
        router.navigate("/(public)/register" as any); // Esta sí es necesaria manual
      } else {
        throw new Error(apiRes.message as string);
      }
    } catch (error: any) {
      console.error("[useAutenticar] Error:", error.message);
    } finally {
      console.log("[useAutenticar] Terminando loading...");
      setLoading(false);
    }
  };

  const onLoginPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleAuth();
  };

  return {
    loading,
    onLoginPress,
    animatedLogoStyle,
  };
};

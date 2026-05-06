import { useState, useEffect } from "react";
import { AuthService } from "../service/auth.service";
import { useRouter } from "@/common/logic/use-router";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAuthState } from "@/common/logic/use-auth-state";

/**
 * Hook para el Paso 1: Autenticación con Google/Supabase
 * y verificación de existencia de perfil en la API.
 */
export const useAutenticar = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, isRegistering } = useAuthState();
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

  // Escuchar si el usuario debe registrarse (determinado por el RootLogic)
  useEffect(() => {
    if (isRegistering && loading) {
      console.log("[useAutenticar] Detectado isRegistering, navegando...");
      router.navigate("/(public)/register" as any);
      setLoading(false);
    }
  }, [isRegistering, loading]);

  /**
   * Acción principal de login
   */
  const handleAuth = async () => {
    setLoading(true);
    try {
      console.log("[useAutenticar] Iniciando authWithGoogle...");
      // 1. Login nativo con Google + Supabase Auth
      // Al completarse, Supabase disparará el evento SIGNED_IN
      // que useRootLogic capturará para hacer la verificación con la API.
      const googleRes = await AuthService.authWithGoogle();
      console.log("[useAutenticar] Resultado googleRes:", googleRes);

      if (!googleRes.success) {
        setLoading(false);
        if (googleRes.message === "CANCELLED") return;
        throw new Error(googleRes.message as string);
      }

      // NO llamamos a AuthService.autenticar() aquí.
      // Dejamos que useRootLogic haga el trabajo pesado para evitar duplicados.
      // El useEffect de arriba se encargará de la navegación si es necesario.
    } catch (error: any) {
      console.error("[useAutenticar] Error:", error.message);
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

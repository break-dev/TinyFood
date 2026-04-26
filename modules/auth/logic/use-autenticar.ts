import { useState } from "react";
import { AuthService } from "../service/auth.service";
import { useAuthStore } from "@/common/stores/auth.store";
import { useRouter } from "@/common/logic/use-router";
import { supabase } from "@/common/config/supabase.config";

/**
 * Hook para el Paso 1: Autenticación con Google/Supabase
 * y verificación de existencia de perfil en la API.
 */
export const useAutenticar = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    try {
      // 1. Login nativo con Google + Supabase Auth
      const googleRes = await AuthService.authWithGoogle();
      if (!googleRes.success) {
        throw new Error(googleRes.message as string);
      }

      // 2. Preguntar a la API si el usuario ya tiene perfil (Paso 1 del diagrama)
      const apiRes = await AuthService.autenticar();

      if (apiRes.success) {
        // CASO: Usuario YA EXISTE
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
        router.replace("/(tabs)" as any); // Al dashboard
      } else if (apiRes.message === "USER_NOT_FOUND") {
        // CASO: Usuario NO EXISTE
        router.navigate("/auth/register" as any); // Al formulario de registro
      } else {
        throw new Error(apiRes.message as string);
      }
    } catch (error: any) {
      console.error("[useAutenticar] Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleAuth, loading };
};

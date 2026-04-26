import { useState } from "react";
import { AuthService } from "../service/auth.service";
import { useAuthStore } from "@/common/stores/auth.store";
import { useRouter } from "@/common/logic/use-router";
import { supabase } from "@/common/config/supabase.config";

/**
 * Hook para el Paso 2: Registro de información personal
 * una vez que se confirma que el usuario no existe en la API.
 */
export const useRegistrar = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleRegister = async (perfilData: {
    nombre: string;
    peso?: number;
    talla?: number;
    fecha_nacimiento?: string;
  }) => {
    setLoading(true);
    try {
      // Llamar a la API: registrar (Paso 2 del diagrama)
      const apiRes = await AuthService.registrar(perfilData);

      if (apiRes.success) {
        // Registro exitoso -> Obtener token y guardar perfil completo
        const { data } = await supabase.auth.getSession();
        setUser(apiRes.data, data.session?.access_token || null);
        router.replace("/(tabs)" as any);
      } else {
        throw new Error(apiRes.message as string);
      }
    } catch (error: any) {
      console.error("[useRegistrar] Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading };
};

import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../config/supabase.config";
import { useRouter } from "./use-router";
import { routes } from "../utils/variables/routes";

/**
 * Hook global para gestionar el cierre de sesión en cualquier parte de la app.
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      router.replace(routes.auth);
    } catch (error) {
      console.error("[useLogout] Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleLogout };
}

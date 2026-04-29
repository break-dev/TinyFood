import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../config/supabase.config";

/**
 * Hook global para gestionar el cierre de sesión en cualquier parte de la app.
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // El listener de Auth en _layout se encargará de redirigir al login
    } catch (error) {
      console.error("[useLogout] Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleLogout };
}

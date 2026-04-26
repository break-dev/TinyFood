import { useEffect } from "react";
import * as Linking from "expo-linking";
import { supabase } from "../config/supabase.config";
import { useAuthState } from "./use-auth-state";

/**
 * Hook para orquestar la lógica inicial de la aplicación.
 * Maneja la sesión de Supabase, la autenticación con la API y los Deep Links.
 */
export const useRootLogic = () => {
  const url = Linking.useLinkingURL();
  const { setUser, logout, isInitialized, setInitialized, getUsuario } =
    useAuthState();

  useEffect(() => {
    // 1. Intentar cargar sesión inicial al montar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Evitar petición si ya está cargado (por si el listener fue más rápido)
        if (getUsuario()) return;

        const { AuthService } = await import(
          "../../modules/auth/service/auth.service"
        );
        AuthService.configure();
        const res = await AuthService.autenticar();
        if (res.success) {
          setUser(res.data, session.access_token);
          return;
        }
      }
      setInitialized(true);
    });

    // 2. Escuchar cambios de sesión posteriores
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session) {
          // Si ya tenemos el usuario, no hace falta pedirlo de nuevo
          if (getUsuario()) {
            setInitialized(true);
            return;
          }

          const { AuthService } = await import(
            "../../modules/auth/service/auth.service"
          );
          AuthService.configure();
          const res = await AuthService.autenticar();
          if (res.success) {
            setUser(res.data, session.access_token);
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("[RootLogic] Auth State Change Error:", error);
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Manejar Deep Links
  useEffect(() => {
    if (url) {
      import("../../modules/auth/service/auth.service")
        .then(({ AuthService }) => {
          AuthService.configure();
          AuthService.crearSupabaseSessionFromUrl(url);
        })
        .catch((err) => console.error("[RootLogic] Deep Link Error:", err));
    }
  }, [url]);

  return {
    isInitialized,
  };
};

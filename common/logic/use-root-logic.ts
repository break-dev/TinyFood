import React, { useEffect } from "react";
import * as Linking from "expo-linking";
import { useSegments } from "expo-router";
import { supabase } from "../config/supabase.config";
import { useAuthState } from "./use-auth-state";
import { AuthService } from "../../modules/auth/service/auth.service";
import { SocketService } from "../service/socket.service";

/**
 * Hook para orquestar la lógica inicial de la aplicación.
 * Maneja la sesión de Supabase, la autenticación con la API y los Deep Links.
 */
export const useRootLogic = () => {
  const url = Linking.useLinkingURL();
  const segments = useSegments();
  const {
    setUser,
    logout,
    isInitialized,
    setInitialized,
    getUsuario,
    isRegistering,
    setRegistering,
  } = useAuthState();

  const isChecking = React.useRef(false);

  useEffect(() => {
    const checkSession = async (session: any) => {
      // Si estamos en una ruta pública, NUNCA intentamos autenticar con la API de forma automática.
      // Esto evita el spam de conexiones WebSocket si el usuario ya está en el flujo de auth.
      const isInPublicRoute = segments[0] === "(public)";
      if (isInPublicRoute) {
        setInitialized(true);
        return;
      }

      if (isChecking.current) return;
      isChecking.current = true;

      try {
        if (session) {
          // Si ya tenemos el usuario en el store o estamos registrándonos, no hacemos nada
          if (getUsuario() || isRegistering) return;

          AuthService.configure();

          // Intentar autenticar con la API
          const res = await AuthService.autenticar();

          if (res.success) {
            setUser(res.data, session.access_token);
            return;
          }

          // Si el usuario no existe en la API, desconectamos el socket para evitar spam
          if (res.message === "USER_NOT_FOUND") {
            setRegistering(true);
            SocketService.disconnect();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("[RootLogic] Session Check Error:", error);
      } finally {
        isChecking.current = false;
        setInitialized(true);
      }
    };

    // 1. Carga inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSession(session);
    });

    // 2. Listener de cambios
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "SIGNED_OUT") {
        logout();
        SocketService.disconnect();
      } else if (_event === "SIGNED_IN" || _event === "TOKEN_REFRESHED") {
        checkSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Manejar Deep Links
  useEffect(() => {
    if (url) {
      AuthService.configure();
      AuthService.crearSupabaseSessionFromUrl(url);
    }
  }, [url]);

  return {
    isInitialized,
  };
};

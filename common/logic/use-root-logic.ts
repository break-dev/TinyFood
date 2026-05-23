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
    const checkSession = async (session: any, force = false) => {
      if (isChecking.current && !force) return;
      isChecking.current = true;

      try {
        if (session) {
          // Si estamos en una ruta pública y no es un login forzado, saltamos
          const isInPublicRoute = segments[0] === "(public)";
          if (isInPublicRoute && !force) {
            console.log("[RootLogic] Saltando check automático en ruta pública");
            setInitialized(true);
            return;
          }

          // Si ya tenemos el usuario en el store o ya sabemos que es registro, saltamos
          if (getUsuario() || (isRegistering && !force)) {
            setInitialized(true);
            return;
          }

          AuthService.configure();

          // Intentar autenticar con la API
          const res = await AuthService.autenticar();

          if (res.success) {
            setUser(res.data, session.access_token);
            setRegistering(false);
          } else {
            // Si el usuario no existe en la API, marcamos que está en registro
            if (res.message === "USER_NOT_FOUND") {
              setRegistering(true);
            }
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

    // 1. Carga inicial: Intentamos solo una vez
    setRegistering(false); // Limpiar estado transitorio de registro al iniciar para evitar bucles de redirección
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkSession(session);
      else setInitialized(true);
    });

    // 2. Listener de cambios: Solo actuamos ante eventos reales
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[RootLogic] Auth Event: ${event}`);
      
      if (event === "SIGNED_OUT") {
        logout();
        SocketService.disconnect();
      } else if (event === "SIGNED_IN") {
        // En SIGNED_IN forzamos la verificación porque es un login explícito
        checkSession(session, true);
      } else if (event === "TOKEN_REFRESHED") {
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

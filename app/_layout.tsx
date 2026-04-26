import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { supabase } from "../common/config/supabase.config";
import { useAuthStore } from "../common/stores/auth.store";
import "../global.css";

export default function RootLayout() {
  const url = Linking.useLinkingURL();
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Escuchar cambios de autenticación en Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Intentar recuperar el perfil de nuestra API si hay sesión
        const { AuthService } = await import(
          "../modules/auth/service/auth.service"
        );
        const res = await AuthService.autenticar();
        if (res.success) {
          setUser(res.data, session.access_token);
        }
      } else {
        // Limpiar store si se cierra sesión
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, logout]);

  useEffect(() => {
    if (url) {
      import("../modules/auth/service/auth.service").then(({ AuthService }) => {
        AuthService.crearSupabaseSessionFromUrl(url);
      });
    }
  }, [url]);

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

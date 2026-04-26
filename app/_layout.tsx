import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import { supabase } from "../common/config/supabase.config";
import { useAuthStore } from "../common/stores/auth.store";
import "../global.css";

export default function RootLayout() {
  const url = Linking.useLinkingURL();
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    // 1. Intentar cargar sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { AuthService } = await import(
          "../modules/auth/service/auth.service"
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

    // 2. Escuchar cambios posteriores
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session) {
          const { AuthService } = await import(
            "../modules/auth/service/auth.service"
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
        console.error("[RootLayout] Auth State Change Error:", error);
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (url) {
      import("../modules/auth/service/auth.service")
        .then(({ AuthService }) => {
          AuthService.configure();
          AuthService.crearSupabaseSessionFromUrl(url);
        })
        .catch((err) => console.error("[RootLayout] Deep Link Error:", err));
    }
  }, [url]);

  // Mientras no se haya verificado la sesión, mostramos un cargando
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

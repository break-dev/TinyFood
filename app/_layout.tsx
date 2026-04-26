import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { supabase } from "../common/config/supabase.config";
import { useAuthStore } from "../common/stores/auth.store";
import "../global.css";

export default function RootLayout() {
  const url = Linking.useLinkingURL();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

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

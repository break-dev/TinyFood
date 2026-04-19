import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../service/supabase.client";
import { AuthService } from "../modules/auth/service/auth.service";
import "../global.css";

// Configura el SDK nativo de Google Sign-In una sola vez al arrancar la app
AuthService.configure();

function AuthStateListener() {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return;

    const inHome = segments[0] === "home";

    if (session && !inHome) {
      router.replace("/home");
    } else if (!session && inHome) {
      router.replace("/");
    }
  }, [session, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthStateListener />
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
      </Stack>
    </SafeAreaProvider>
  );
}

import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../service/supabase.client";
import * as Linking from "expo-linking";
import "../global.css";

function AuthStateListener() {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  // Si openAuthSessionAsync se cerró (dismissed) prematuramente o estamos en Android
  // donde los intents pueden llegar asíncronamente, este hook captura el URL.
  const url = Linking.useURL();
  useEffect(() => {
    if (url) {
      import("../modules/auth/service/auth.service").then(({ AuthService }) => {
        AuthService.createSessionFromUrl(url);
      });
    }
  }, [url]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("[Auth] getSession inicial:", data.session ? "sesión activa" : "sin sesión");
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Auth] onAuthStateChange evento:", event, "| sesión:", session ? "activa" : "null");
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return;

    const inHome = segments[0] === "home";
    console.log("[Nav] session:", session ? "activa" : "null", "| inHome:", inHome);

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

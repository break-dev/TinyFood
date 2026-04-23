import { useState } from "react";
import { Alert, Platform } from "react-native";
import { supabase } from "../../../service/supabase.client";
import { AuthService } from "../service/auth.service";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const response = await AuthService.loginWithGoogle();

    if (!response.success) {
      setIsLoading(false);
      if (response.message !== "Inicio de sesión cancelado") {
        Alert.alert("Error al iniciar sesión", response.message);
      }
      return;
    }

    // En Android, el servicio retorna la URL para que abramos la WebView
    if (Platform.OS === 'android' && response.message.startsWith('http')) {
      setAuthUrl(response.message);
      return; // El loading se apagará cuando termine el WebView
    }

    // Flujo normal para iOS/Web
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" && session) {
        setIsLoading(false);
        subscription.unsubscribe();
      } else if (event === "SIGNED_OUT") {
        setIsLoading(false);
        subscription.unsubscribe();
      }
    });

    setTimeout(() => {
      setIsLoading(false);
      subscription.unsubscribe();
    }, 60_000);
  };

  const handleWebViewNavigation = (url: string) => {
    // Supabase a veces hace fallback a la "Site URL" (tinyfood://) si no le gusta la IP local
    // o si la configuración de Redirect URLs tiene problemas de puertos.
    // También interceptamos exp:// o auth/callback si Supabase respeta el redirect_to original.
    if (url.includes('auth/callback') || url.startsWith('exp://') || url.startsWith('tinyfood://')) {
      // Importante: Si la URL tiene un error o un token, la cerramos y procesamos
      if (url.includes('#access_token') || url.includes('?error') || url.includes('#error')) {
        setAuthUrl(null); // Cerrar WebView
        console.log("[Auth] WebView interceptó URL con tokens:", url.substring(0, 50) + "...");
        
        AuthService.createSessionFromUrl(url).then((res) => {
          if (!res.success) {
            Alert.alert("Error de sesión", res.message);
          }
          setIsLoading(false);
        });
      }
    }
  };

  const cancelWebView = () => {
    setAuthUrl(null);
    setIsLoading(false);
  };

  return { isLoading, authUrl, handleGoogleLogin, handleWebViewNavigation, cancelWebView };
}

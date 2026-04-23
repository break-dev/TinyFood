import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../../service/supabase.client";
import { AuthService } from "../service/auth.service";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const response = await AuthService.loginWithGoogle();

    if (!response.success) {
      setIsLoading(false);
      // Ignorar cancelaciones nativas (típicamente el error termina con "canceled" o el message es el de la librería)
      if (
        !response.message.toLowerCase().includes("cancel") && 
        response.message !== "Inicio de sesión cancelado"
      ) {
        Alert.alert("Error al iniciar sesión", response.message);
      }
      return;
    }

    // El inicio de sesión fue exitoso nativamente.
    // Como enviamos el idToken a Supabase, `onAuthStateChange` debería detectar el SIGNED_IN automáticamente
    // en la raíz de la app y navegar a la pantalla principal.
    // Por si acaso, escuchamos aquí solo para quitar el loading si no se hace globalmente rápido.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
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
    }, 15_000); // Reducir a 15s ya que el flujo nativo es mucho más rápido
  };

  return { isLoading, handleGoogleLogin };
}

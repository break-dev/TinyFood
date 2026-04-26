import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../../common/config/supabase.config";
import { AuthService } from "../service/auth.service";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    const response = await AuthService.authWithGoogle();

    if (!response.success) {
      setIsLoading(false);
      // Ignorar cancelaciones nativas (típicamente el error termina con "canceled" o el message es el de la librería)
      if (
        response.message &&
        !response.message.toLowerCase().includes("cancel") &&
        !response.message.toLowerCase().includes("cancelado")
      ) {
        Alert.alert("Error al iniciar sesión", response.message);
      }
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
    }, 15000);
  };

  return { isLoading, handleGoogleAuth };
}

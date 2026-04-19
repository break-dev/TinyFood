import { useState } from "react";
import { Alert } from "react-native";

import { AuthService } from "../service/auth.service";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const response = await AuthService.loginWithGoogle();
    setIsLoading(false);

    // La navegación la maneja AuthStateListener vía onAuthStateChange en _layout.tsx
    if (
      !response.success &&
      response.message !== "Inicio de sesión cancelado"
    ) {
      Alert.alert("Error al iniciar sesión", response.message);
    }
  };

  return { isLoading, handleGoogleLogin };
}

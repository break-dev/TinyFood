import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { AuthService } from "../service/auth.service";

export function useRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Incompleto", "Completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    const response = await AuthService.registerWithEmail({
      name,
      email,
      password,
    });
    setIsLoading(false);

    if (response.success) {
      if (response.data) {
        router.replace("/home");
      } else {
        Alert.alert(
          "Verifica tu correo",
          "Te enviamos un correo de confirmación. Una vez confirmado podrás iniciar sesión.",
          [{ text: "OK", onPress: () => router.replace("/") }],
        );
      }
    } else {
      Alert.alert("Error al registrarse", response.message);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    const response = await AuthService.loginWithGoogle();
    setIsLoading(false);

    if (!response.success && response.message !== "Inicio de sesión cancelado") {
      Alert.alert("Error", response.message);
    }
  };

  const goToLogin = () => router.replace("/");

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleRegister,
    handleGoogleRegister,
    goToLogin,
  };
}

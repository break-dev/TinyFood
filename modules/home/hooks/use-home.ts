import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { supabase } from "../../core/service/supabase.client";
import { AuthService } from "../../auth/services/auth.service";

export function useHome() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;

    if (!user) {
      // Si no hay sesión activa, regresa al login
      router.replace("/");
      return;
    }

    setUserEmail(user.email ?? "");
    // Intenta usar el nombre del metadata (viene del registro o de Google)
    const nombre =
      user.user_metadata?.nombre ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Usuario";
    setUserName(nombre);
    setIsLoading(false);
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: async () => {
          await AuthService.logout();
          router.replace("/");
        },
      },
    ]);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    userName,
    userEmail,
    isLoading,
    handleLogout,
  };
}

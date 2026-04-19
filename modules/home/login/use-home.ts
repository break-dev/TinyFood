import { useState, useEffect } from "react";
import { Alert } from "react-native";

import { supabase } from "../../../service/supabase.client";
import { AuthService } from "../../auth/service/auth.service";

export function useHome() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;

    if (!user) {
      setIsLoading(false);
      return; // AuthStateListener en _layout.tsx maneja la redirección
    }

    setUserEmail(user.email ?? "");
    setUserName(
      user.user_metadata?.full_name ||
        user.user_metadata?.nombre ||
        user.email?.split("@")[0] ||
        "Usuario",
    );
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
          // AuthStateListener detecta la sesión null y redirige al login automáticamente
        },
      },
    ]);
  };

  return { userName, userEmail, isLoading, handleLogout };
}

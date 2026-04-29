import { useState } from "react";
import { Alert } from "react-native";
import { despensaService } from "../service/despensa.service";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          await despensaService.logout();
          setIsLoading(false);
        },
      },
    ]);
  };

  return { isLoading, handleLogout };
}

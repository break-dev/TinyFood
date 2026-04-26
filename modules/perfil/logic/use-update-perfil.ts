import { useState } from "react";
import { Alert } from "react-native";

export function useUpdatePerfil() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePerfil = () => {
    Alert.alert(
      "Actualizar perfil",
      "¿Seguro que deseas actualizar tu perfil?",
    );
  };

  return { isLoading, handleUpdatePerfil };
}

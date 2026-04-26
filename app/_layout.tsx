import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";
import { useRootLogic } from "../common/logic/use-root-logic";
import "../global.css";

export default function RootLayout() {
  const { isInitialized } = useRootLogic();

  // Mientras no se haya verificado la sesión, mostramos un cargando
  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

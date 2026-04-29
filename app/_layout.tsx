// Ignorar advertencia de SafeAreaView deprecado (viene de librerías externas)
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator, LogBox } from "react-native";
import { useRootLogic } from "../common/logic/use-root-logic";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_700Bold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import Toast from "react-native-toast-message";
import "../global.css";

export default function RootLayout() {
  const { isInitialized } = useRootLogic();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
    Outfit_900Black,
  });

  if (!isInitialized || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <Slot />
          <Toast />
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

// Ignorar advertencia de SafeAreaView deprecado (viene de librerías externas)
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator, LogBox } from "react-native";
import { useRootLogic } from "../common/logic/use-root-logic";
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from '../widget-task-handler';
import { registerBackgroundFetchAsync } from '../background-tasks';

registerWidgetTaskHandler(widgetTaskHandler);

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_700Bold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "../common/logic/use-app-theme";

export default function RootLayout() {
  const { isInitialized } = useRootLogic();
  useAppTheme(); // Activa el listener global y la sincronización de temas

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
    Outfit_900Black,
  });

  useEffect(() => {
    registerBackgroundFetchAsync().catch(console.error);

    // Rotación automática de los widgets de Ejercicio y Vencimiento cada 30 segundos
    const interval = setInterval(async () => {
      try {
        // Rotar ejercicio
        const eIndexStr = await AsyncStorage.getItem('tinyfood_exercise_index');
        const currentEIndex = parseInt(eIndexStr || '0', 10) || 0;
        await AsyncStorage.setItem('tinyfood_exercise_index', String(currentEIndex + 1));

        // Rotar vencimiento
        const expireIndexStr = await AsyncStorage.getItem('tinyfood_expire_index');
        const currentExpireIndex = parseInt(expireIndexStr || '0', 10) || 0;
        await AsyncStorage.setItem('tinyfood_expire_index', String(currentExpireIndex + 1));

        // Rotar recetas
        const rIndexStr = await AsyncStorage.getItem('tinyfood_recipe_index');
        const currentRIndex = parseInt(rIndexStr || '0', 10) || 0;
        await AsyncStorage.setItem('tinyfood_recipe_index', String(currentRIndex + 1));

        const { updateAllWidgets } = require('../background-tasks');
        await updateAllWidgets();
      } catch (e) {
        console.error('Error rotando widgets en primer plano:', e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

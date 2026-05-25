import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings } from "lucide-react-native";
import { useConfiguracion } from "../logic/use-configuracion";
import { useAppTheme } from "@/common/logic/use-app-theme";
import { SeccionPreferencias } from "./components/seccion-preferencias";
import { SeccionSistema } from "./components/seccion-sistema";
import { SeccionApariencia } from "./components/seccion-apariencia";

export const ConfiguracionScreen = () => {
  const insets = useSafeAreaInsets();
  const { themeBg, themeText, themeBorder, iconColor } = useAppTheme();
  const configIA = useConfiguracion();

  return (
    <View className={`flex-1 ${themeBg}`} style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className={`flex-row items-center px-6 py-6 border-b ${themeBorder}`}>
        <View className="mr-3">
          <Settings size={26} color={iconColor} strokeWidth={2.5} />
        </View>
        <Text
          className={`text-2xl ml-2 ${themeText}`}
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Ajustes
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`flex-1 px-6 py-4 ${themeBg}`}
      >
        {/* Sección 1: Inteligencia Artificial (Remoto) */}
        <SeccionPreferencias {...configIA} />

        {/* Sección 2: Sistema (Local) */}
        <SeccionSistema />

        {/* Sección 3: Apariencia */}
        <SeccionApariencia />

        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

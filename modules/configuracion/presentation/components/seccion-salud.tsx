import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Activity, Droplets, Minus, Plus } from "lucide-react-native";
import { useAppTheme } from "@/common/logic/use-app-theme";
import * as Haptics from "expo-haptics";
import { useConfigStore } from "../../store/config.store";

export const SeccionSalud = () => {
  const { isDark, themeText, iconColor } = useAppTheme();
  const vibracionHaptics = useConfigStore((state) => state.vibracionHaptics);
  const metaAguaDiaria = useConfigStore((state) => state.metaAguaDiaria);
  const setMetaAguaDiaria = useConfigStore((state) => state.setMetaAguaDiaria);

  const changeAgua = (amount: number) => {
    if (vibracionHaptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMeta = Math.max(500, Math.min(5000, metaAguaDiaria + amount));
    if (newMeta !== metaAguaDiaria) {
      setMetaAguaDiaria(newMeta);
    }
  };

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4 px-2">
        <Activity size={20} color={iconColor} strokeWidth={2.5} />
        <Text
          className={`text-xl ml-2 ${themeText}`}
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Salud
        </Text>
      </View>

      <View
        className={`rounded-[32px] p-5 shadow-sm border ${
          isDark
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-gray-100"
        }`}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <View
              className={`h-10 w-10 items-center justify-center rounded-xl mr-3 ${
                isDark ? "bg-blue-950/30" : "bg-blue-50"
              }`}
            >
              <Droplets size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text
                className={`text-base ${themeText}`}
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Meta diaria de agua
              </Text>
              <Text
                className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
                style={{ fontFamily: "Outfit_400Regular" }}
              >
                Ajusta tu objetivo (ml)
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-gray-50 dark:bg-neutral-950 p-2 rounded-2xl">
          <TouchableOpacity
            onPress={() => changeAgua(-250)}
            className={`p-3 rounded-xl ${
              isDark ? "bg-neutral-900" : "bg-white"
            } shadow-sm border border-gray-100 dark:border-neutral-800`}
          >
            <Minus size={20} color={iconColor} />
          </TouchableOpacity>
          <Text
            className={`text-2xl ${themeText}`}
            style={{ fontFamily: "Outfit_900Black" }}
          >
            {metaAguaDiaria} ml
          </Text>
          <TouchableOpacity
            onPress={() => changeAgua(250)}
            className={`p-3 rounded-xl ${
              isDark ? "bg-neutral-900" : "bg-white"
            } shadow-sm border border-gray-100 dark:border-neutral-800`}
          >
            <Plus size={20} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

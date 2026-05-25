import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sun, Moon, Smartphone } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useConfigStore, AparienciaTipo } from "../../store/config.store";
import { useAppTheme } from "@/common/logic/use-app-theme";

export const SeccionApariencia = () => {
  const { isDark, themeText, themeCardBg, themeBorder } = useAppTheme();
  const localConfig = useConfigStore();

  const handleSelectTema = (tema: AparienciaTipo) => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    localConfig.setApariencia(tema);
  };

  return (
    <View className="mb-12">
      <View className="flex-row items-center mb-4">
        <View className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl mr-3">
          <Sun size={18} color="#10b981" strokeWidth={2.5} />
        </View>
        <Text
          className={`text-lg ${themeText}`}
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Apariencia
        </Text>
      </View>

      <View className={`${themeCardBg} p-5 rounded-[32px] border ${themeBorder}`}>
        <Text
          className="text-gray-400 dark:text-neutral-500 text-xs uppercase tracking-widest mb-3 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Tema de la aplicación
        </Text>
        <View className="flex-row gap-3">
          {([
            { id: "claro", label: "Claro" },
            { id: "oscuro", label: "Oscuro" },
            { id: "sistema", label: "Sistema" },
          ] as const).map((opt) => {
            const active = localConfig.apariencia === opt.id;
            const iconColor = active ? "white" : (isDark ? "#a3a3a3" : "#6b7280");
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                onPress={() => handleSelectTema(opt.id)}
                className={`flex-1 py-4 rounded-[20px] items-center justify-center border flex-row gap-2 ${
                  active
                    ? "bg-orange-500 border-orange-500"
                    : `bg-white dark:bg-neutral-800 ${themeBorder}`
                }`}
                style={
                  active
                    ? {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                    : undefined
                }
              >
                {opt.id === "claro" && (
                  <View>
                    <Sun size={15} color={iconColor} strokeWidth={2.5} />
                  </View>
                )}
                {opt.id === "oscuro" && (
                  <View>
                    <Moon size={15} color={iconColor} strokeWidth={2.5} />
                  </View>
                )}
                {opt.id === "sistema" && (
                  <View>
                    <Smartphone size={15} color={iconColor} strokeWidth={2.5} />
                  </View>
                )}
                <Text
                  className={`text-xs ${
                    active ? "text-white" : "text-gray-600 dark:text-gray-300"
                  }`}
                  style={{
                    fontFamily: active
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  }}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

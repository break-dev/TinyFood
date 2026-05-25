import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Cpu, Minus, Plus } from "lucide-react-native";
import { MotiView } from "moti";
import * as Haptics from "expo-haptics";
import { useConfigStore } from "../../store/config.store";
import { useAppTheme } from "@/common/logic/use-app-theme";

// Custom Animated Switch Component
const CustomSwitch = ({
  value,
  onPress,
}: {
  value: boolean;
  onPress: () => void;
}) => {
  const { isDark } = useAppTheme();
  
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View
        className={`w-[56px] h-8 rounded-full p-1 flex-row items-center ${
          value ? "bg-orange-500" : (isDark ? "bg-neutral-800 border border-neutral-700" : "bg-gray-200")
        }`}
      >
        <MotiView
          animate={{
            translateX: value ? 24 : 0,
          }}
          transition={{
            type: "spring",
            damping: 18,
            stiffness: 150,
          }}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 1,
            elevation: 1,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export const SeccionSistema = () => {
  const { isDark, themeText, themeCardBg, themeBorder, dividerColor } = useAppTheme();
  const localConfig = useConfigStore();

  const handleToggleSwitch = (key: "vibracionHaptics" | "recordatorios") => {
    const isHaptic = localConfig.vibracionHaptics;
    if (isHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (key === "vibracionHaptics") {
      localConfig.setVibracionHaptics(!localConfig.vibracionHaptics);
    } else {
      localConfig.setRecordatorios(!localConfig.recordatorios);
    }
  };

  const handleIncrementDias = () => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    localConfig.setAvisoDiasCaducidad(
      Math.min(15, localConfig.avisoDiasCaducidad + 1)
    );
  };

  const handleDecrementDias = () => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    localConfig.setAvisoDiasCaducidad(
      Math.max(1, localConfig.avisoDiasCaducidad - 1)
    );
  };

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <View className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl mr-3">
          <Cpu size={18} color="#3b82f6" strokeWidth={2.5} />
        </View>
        <Text
          className={`text-lg ${themeText}`}
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Sistema y Notificaciones
        </Text>
      </View>

      <View className={`${themeCardBg} p-5 rounded-[32px] border ${themeBorder} gap-6`}>
        {/* Días Caducidad */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text
              className={`text-base ${themeText}`}
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Aviso de Caducidad
            </Text>
            <Text
              className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
              style={{ fontFamily: "Outfit_400Regular" }}
            >
              Días de anticipación para avisar sobre productos a vencer.
            </Text>
          </View>

          <View
            className="flex-row items-center bg-white dark:bg-neutral-800 p-1 rounded-2xl border"
            style={{
              borderColor: dividerColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <TouchableOpacity
              onPress={handleDecrementDias}
              className="w-10 h-10 bg-gray-50 dark:bg-neutral-900 rounded-xl items-center justify-center"
            >
              <Minus size={14} color={isDark ? "#f3f4f6" : "#4b5563"} strokeWidth={3} />
            </TouchableOpacity>
            <Text
              className={`mx-4 text-base ${themeText}`}
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              {localConfig.avisoDiasCaducidad} d
            </Text>
            <TouchableOpacity
              onPress={handleIncrementDias}
              className="w-10 h-10 bg-gray-50 dark:bg-neutral-900 rounded-xl items-center justify-center"
            >
              <Plus size={14} color={isDark ? "#f3f4f6" : "#4b5563"} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-[1px]" style={{ backgroundColor: dividerColor }} />

        {/* Vibración Háptica */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text
              className={`text-base ${themeText}`}
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Vibración Háptica
            </Text>
            <Text
              className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
              style={{ fontFamily: "Outfit_400Regular" }}
            >
              Respuesta física al tocar botones e interactuar.
            </Text>
          </View>
          <CustomSwitch
            value={localConfig.vibracionHaptics}
            onPress={() => handleToggleSwitch("vibracionHaptics")}
          />
        </View>

        <View className="h-[1px]" style={{ backgroundColor: dividerColor }} />

        {/* Recordatorios */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text
              className={`text-base ${themeText}`}
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Recordatorios Diarios
            </Text>
            <Text
              className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
              style={{ fontFamily: "Outfit_400Regular" }}
            >
              Alertas periódicas sobre tus ingredientes y compras.
            </Text>
          </View>
          <CustomSwitch
            value={localConfig.recordatorios}
            onPress={() => handleToggleSwitch("recordatorios")}
          />
        </View>
      </View>
    </View>
  );
};

import React from "react";
import {
  View,
  Text as Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Scan,
  Timer,
  Utensils,
  Apple,
  ChevronRight,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useAutenticar } from "../logic/use-autenticar";
import { useAppTheme } from "@/common/logic/use-app-theme";

export const AuthScreen = () => {
  const { loading, onLoginPress, animatedLogoStyle } = useAutenticar();
  const { isDark } = useAppTheme();

  const pills = [
    {
      Icon: Scan,
      label: "Foto IA",
      color: isDark ? "text-emerald-450 text-emerald-400" : "text-emerald-600",
      bg: isDark ? "bg-emerald-950/20 border-emerald-900/30" : "bg-emerald-50 border-white",
      iconColor: isDark ? "#34d399" : "#10b981",
    },
    {
      Icon: Timer,
      label: "Cero Desperdicio",
      color: isDark ? "text-orange-450 text-orange-400" : "text-orange-600",
      bg: isDark ? "bg-orange-950/20 border-orange-900/30" : "bg-orange-50 border-white",
      iconColor: isDark ? "#fb923c" : "#f97316",
    },
    {
      Icon: Utensils,
      label: "Recetas",
      color: isDark ? "text-blue-450 text-blue-400" : "text-blue-600",
      bg: isDark ? "bg-blue-950/20 border-blue-900/30" : "bg-blue-50 border-white",
      iconColor: isDark ? "#60a5fa" : "#3b82f6",
    },
  ];

  return (
    <View className={`flex-1 ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      {/* Decorative Circles */}
      <MotiView
        from={{ opacity: 0, scale: 0.5, translateX: 50 }}
        animate={{ opacity: isDark ? 0.2 : 0.5, scale: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 1500 }}
        className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-100 dark:bg-orange-950"
      />
      <MotiView
        from={{ opacity: 0, scale: 0.5, translateX: -50 }}
        animate={{ opacity: isDark ? 0.3 : 0.8, scale: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 1500, delay: 500 }}
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-50 dark:bg-orange-950"
      />

      <View className="flex-1 items-center justify-center px-10">
        {/* Logo Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="mb-8 items-center"
        >
          <View className="h-40 w-40 items-center justify-center rounded-[48px] bg-orange-500 shadow-2xl shadow-orange-500/50 overflow-hidden">
            {/* Mascot peek replacement or better visual */}
            <Apple size={80} color="white" strokeWidth={1.5} />
          </View>
        </MotiView>

        {/* Text Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          className="mb-10 items-center"
        >
          <Text
            className="text-6xl text-gray-900 dark:text-white tracking-tighter"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            TinyFood
          </Text>
          <View className="mt-2 mb-5 h-1.5 w-20 rounded-full bg-orange-400" />
          <Text
            className="text-center text-xl text-gray-500 dark:text-neutral-400 leading-7"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            Tu asistente inteligente para una{"\n"}vida saludable y sin
            desperdicio
          </Text>
        </MotiView>

        {/* Feature Pills */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 600 }}
          className="mb-14 flex-row flex-wrap justify-center gap-3"
        >
          {pills.map((item, idx) => (
            <View
              key={idx}
              className={`flex-row items-center rounded-full ${item.bg} px-5 py-3 border`}
            >
              <item.Icon
                size={16}
                color={item.iconColor}
              />
              <Text
                className={`ml-2 text-sm font-bold ${item.color}`}
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </MotiView>

        {/* Action Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 900 }}
          className="w-full"
        >
          <TouchableOpacity
            onPress={onLoginPress}
            disabled={loading}
            activeOpacity={0.9}
            className={`flex-row items-center justify-center rounded-[32px] bg-gray-900 dark:bg-orange-500 h-20 shadow-xl ${
              loading ? "opacity-70" : ""
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center">
                <Text
                  className="text-xl text-white mr-2"
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  Continuar con Google
                </Text>
                <ChevronRight size={24} color="white" strokeWidth={3} />
              </View>
            )}
          </TouchableOpacity>

          <Text
            className="mt-8 text-center text-xs text-gray-400 dark:text-neutral-500 px-6 leading-5"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            Al continuar, aceptas nuestros{" "}
            <Text className="text-gray-600 dark:text-neutral-350 font-bold">
              Términos de Servicio
            </Text>{" "}
            y{" "}
            <Text className="text-gray-600 dark:text-neutral-350 font-bold">
              Política de Privacidad
            </Text>
            .
          </Text>
        </MotiView>
      </View>

      {/* Footer Decoration */}
      <View className="absolute bottom-12 w-full items-center">
        <View className="h-1.5 w-12 rounded-full bg-gray-100 dark:bg-neutral-850" />
      </View>
    </View>
  );
};

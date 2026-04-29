import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepActivity = ({ data, setData }: Props) => {
  const levels = [
    { id: 1, label: "Sedentario", desc: "Poca o ninguna actividad" },
    { id: 2, label: "Ligero", desc: "Ejercicio 1-3 días/semana" },
    { id: 3, label: "Moderado", desc: "Ejercicio 3-5 días/semana" },
    { id: 4, label: "Activo", desc: "Ejercicio 6-7 días/semana" },
    { id: 5, label: "Muy Activo", desc: "Atleta o trabajo físico" },
  ];

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      className="flex-1"
    >
      {/* Header: Title */}
      <View className="mb-10">
        <Text
          className="mb-3 text-4xl text-gray-900 tracking-tighter"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Actividad
        </Text>
        <Text
          className="text-lg text-gray-500 leading-6"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          ¿Qué tan activo eres en tu día a día? Esto nos ayuda a ajustar tu quema
          calórica.
        </Text>
      </View>

      <View className="space-y-4">
        {levels.map((level) => (
          <TouchableOpacity
            key={level.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setData({ ...data, nivel_actividad: level.id });
            }}
            activeOpacity={0.8}
            className={`flex-row items-center rounded-[32px] border-2 p-6 shadow-sm ${
              data.nivel_actividad === level.id
                ? "border-orange-500 bg-orange-50/50 shadow-orange-500/10"
                : "border-gray-50 bg-white shadow-black/5"
            }`}
          >
            <View className="flex-1">
              <Text
                className={`text-xl ${
                  data.nivel_actividad === level.id
                    ? "text-orange-600"
                    : "text-gray-900"
                }`}
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                {level.label}
              </Text>
              <Text
                className="text-sm text-gray-400 mt-1"
                style={{ fontFamily: "Outfit_400Regular" }}
              >
                {level.desc}
              </Text>
            </View>
            {data.nivel_actividad === level.id && (
              <View className="bg-orange-500 rounded-full p-1">
                <Ionicons name="checkmark" size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

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
      <View className="mb-8">
        <Text className="mb-2 text-3xl font-bold text-gray-900">Actividad</Text>
        <Text className="text-gray-500">
          ¿Qué tan activo eres en tu día a día?
        </Text>
      </View>

      {levels.map((level) => (
        <TouchableOpacity
          key={level.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setData({ ...data, nivel_actividad: level.id });
          }}
          className={`mb-4 flex-row items-center rounded-2xl border-2 p-4 ${
            data.nivel_actividad === level.id
              ? "border-orange-500 bg-orange-50"
              : "border-gray-100 bg-white"
          }`}
        >
          <View className="flex-1">
            <Text
              className={`text-lg font-bold ${
                data.nivel_actividad === level.id
                  ? "text-orange-600"
                  : "text-gray-900"
              }`}
            >
              {level.label}
            </Text>
            <Text className="text-gray-500">{level.desc}</Text>
          </View>
          {data.nivel_actividad === level.id && (
            <Ionicons name="checkmark-circle" size={24} color="#f97316" />
          )}
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

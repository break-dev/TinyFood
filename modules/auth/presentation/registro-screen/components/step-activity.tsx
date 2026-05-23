import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ObjetivoFisico } from "@/common/utils/enums/objetivo-fisico";

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

  const goals = [
    { id: ObjetivoFisico.Mantener, label: "Mantener", desc: "Mantener peso" },
    {
      id: ObjetivoFisico.PerderPeso,
      label: "Perder Peso",
      desc: "Reducir grasa",
    },
    {
      id: ObjetivoFisico.GanarPeso,
      label: "Ganar Peso",
      desc: "Aumentar masa",
    },
  ];

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      className="flex-1"
    >
      {/* Header: Title */}
      <View className="mb-8">
        <Text
          className="mb-3 text-4xl text-gray-900 tracking-tighter"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Objetivo & Actividad
        </Text>
        <Text
          className="text-lg text-gray-500 leading-6"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          Configura tu meta física y tu ritmo diario para ajustar tus
          necesidades calóricas.
        </Text>
      </View>

      {/* Objetivo Físico */}
      <Text
        className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1 font-bold"
        style={{ fontFamily: "Outfit_700Bold" }}
      >
        Objetivo Físico
      </Text>
      <View className="flex-row gap-2 mb-8">
        {goals.map((g) => {
          const isSelected = data.objetivo_fisico === g.id;
          return (
            <TouchableOpacity
              key={g.id}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setData({ ...data, objetivo_fisico: g.id });
              }}
              className="flex-1 py-4 px-1 rounded-[20px] items-center justify-center border"
              style={
                isSelected
                  ? {
                      backgroundColor: "#f97316",
                      borderColor: "#f97316",
                      shadowColor: "#f97316",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      elevation: 3,
                    }
                  : {
                      backgroundColor: "#f9fafb",
                      borderColor: "#f3f4f6",
                    }
              }
            >
              <Text
                className={`text-xs text-center capitalize ${
                  isSelected ? "text-white" : "text-gray-500"
                }`}
                style={{
                  fontFamily: isSelected
                    ? "Outfit_700Bold"
                    : "Outfit_400Regular",
                }}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Nivel de Actividad */}
      <Text
        className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1 font-bold"
        style={{ fontFamily: "Outfit_700Bold" }}
      >
        Nivel de Actividad
      </Text>
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

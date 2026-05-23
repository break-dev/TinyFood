import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ObjetivoFisico } from "@/common/utils/enums/objetivo-fisico";

interface Props {
  data: any;
  setData: (data: any) => void;
}

const levels = [
  { id: 1, label: "Sedentario", desc: "Poca o ninguna actividad" },
  { id: 2, label: "Ligero", desc: "Ejercicio 1-3 días/semana" },
  { id: 3, label: "Moderado", desc: "Ejercicio 3-5 días/semana" },
  { id: 4, label: "Activo", desc: "Ejercicio 6-7 días/semana" },
  { id: 5, label: "Muy Activo", desc: "Atleta o trabajo físico" },
];

const goals = [
  { id: ObjetivoFisico.Mantener, label: "Mantener", desc: "Mantener peso" },
  { id: ObjetivoFisico.PerderPeso, label: "Perder Peso", desc: "Reducir grasa" },
  { id: ObjetivoFisico.GanarPeso, label: "Ganar Peso", desc: "Aumentar masa" },
];

export const SheetActividad = ({ data, setData }: Props) => (
  <View>
    <Text
      className="text-3xl text-gray-900 tracking-tighter mb-1"
      style={{ fontFamily: "Outfit_900Black" }}
    >
      Objetivo & Actividad
    </Text>
    <Text
      className="text-gray-400 text-sm mb-6"
      style={{ fontFamily: "Outfit_400Regular" }}
    >
      Configura tu meta física y tu ritmo diario
    </Text>

    {/* Sección de Objetivo */}
    <Text
      className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1"
      style={{ fontFamily: "Outfit_900Black" }}
    >
      Mi Objetivo Físico
    </Text>
    <View className="flex-row gap-2 mb-6">
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
            className={`flex-1 py-4 px-1 rounded-[20px] items-center justify-center border ${
              isSelected
                ? "bg-orange-500 border-orange-500"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <Text
              className={`text-xs text-center capitalize ${
                isSelected ? "text-white" : "text-gray-500"
              }`}
              style={{
                fontFamily: isSelected ? "Outfit_700Bold" : "Outfit_400Regular",
              }}
            >
              {g.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {/* Sección de Actividad */}
    <Text
      className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1"
      style={{ fontFamily: "Outfit_900Black" }}
    >
      Nivel de Actividad
    </Text>
    {levels.map((level) => (
      <TouchableOpacity
        key={level.id}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setData({ ...data, nivel_actividad: level.id });
        }}
        className={`mb-3 flex-row items-center rounded-2xl border-2 p-4 ${
          data.nivel_actividad === level.id
            ? "border-orange-500 bg-orange-50"
            : "border-gray-100 bg-white"
        }`}
      >
        <View className="flex-1">
          <Text
            className={`text-base font-bold ${
              data.nivel_actividad === level.id
                ? "text-orange-600"
                : "text-gray-900"
            }`}
          >
            {level.label}
          </Text>
          <Text className="text-gray-500 text-sm">{level.desc}</Text>
        </View>
        {data.nivel_actividad === level.id && (
          <Ionicons name="checkmark-circle" size={24} color="#f97316" />
        )}
      </TouchableOpacity>
    ))}
  </View>
);

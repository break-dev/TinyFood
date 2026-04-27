import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { ALERGIAS_SUGERIDAS } from "@/common/utils/enums/alergias";
import { DIETAS_SUGERIDAS } from "@/common/utils/enums/dietas";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepFood = ({ data, setData }: Props) => {
  const [customAlergia, setCustomAlergia] = useState("");
  const [customDieta, setCustomDieta] = useState("");

  // Manejar Alergias / Alimentos Prohibidos
  const toggleAlergia = (item: string) => {
    const isSelected = data.alimentos_prohibidos.includes(item);
    if (isSelected) {
      setData({
        ...data,
        alimentos_prohibidos: data.alimentos_prohibidos.filter((i: string) => i !== item),
      });
    } else {
      setData({
        ...data,
        alimentos_prohibidos: [...data.alimentos_prohibidos, item],
      });
    }
  };

  const addCustomAlergia = () => {
    if (customAlergia.trim() && !data.alimentos_prohibidos.includes(customAlergia.trim())) {
      setData({
        ...data,
        alimentos_prohibidos: [...data.alimentos_prohibidos, customAlergia.trim()],
      });
    }
    setCustomAlergia("");
  };

  // Manejar Dietas / Preferencias
  const toggleDieta = (item: string) => {
    const isSelected = data.preferencias.includes(item);
    if (isSelected) {
      setData({
        ...data,
        preferencias: data.preferencias.filter((i: string) => i !== item),
      });
    } else {
      setData({
        ...data,
        preferencias: [...data.preferencias, item],
      });
    }
  };

  const addCustomDieta = () => {
    if (customDieta.trim() && !data.preferencias.includes(customDieta.trim())) {
      setData({
        ...data,
        preferencias: [...data.preferencias, customDieta.trim()],
      });
    }
    setCustomDieta("");
  };

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      className="flex-1"
    >
      {/* Header: Title */}
      <View className="mb-6">
        <Text className="mb-2 text-3xl font-bold text-gray-900">Alimentos</Text>
        <Text className="text-gray-500">
          Cuéntanos qué no puedes comer y qué dieta prefieres seguir.
        </Text>
      </View>

      {/* SECCIÓN 1: ALERGIAS */}
      <View className="mb-8">
        <Text className="mb-2 font-bold text-gray-700 text-lg">
          Alergias / Alimentos Prohibidos
        </Text>
        
        {/* Sugerencias Alergias */}
        <View className="mb-3 flex-row flex-wrap gap-2">
          {ALERGIAS_SUGERIDAS.map((alergia) => {
            const isSelected = data.alimentos_prohibidos.includes(alergia);
            return (
              <TouchableOpacity
                key={alergia}
                onPress={() => toggleAlergia(alergia)}
                className={`rounded-full px-4 py-2 border ${
                  isSelected
                    ? "border-orange-500 bg-orange-100"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={
                    isSelected ? "font-bold text-orange-700" : "text-gray-600"
                  }
                >
                  {alergia} {isSelected && "✓"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input Libre Alergias */}
        <View className="flex-row items-center rounded-2xl border border-gray-200 bg-white px-4 py-1 mb-2">
          <TextInput
            className="flex-1 py-2 text-base"
            placeholder="Otro (Ej: Fresas)"
            value={customAlergia}
            onChangeText={setCustomAlergia}
            onSubmitEditing={addCustomAlergia}
          />
          <TouchableOpacity onPress={addCustomAlergia}>
            <Ionicons name="add-circle" size={32} color="#f97316" />
          </TouchableOpacity>
        </View>

        {/* Chips Agregados Manualmente (Que no están en sugerencias) */}
        <View className="flex-row flex-wrap gap-2">
          {data.alimentos_prohibidos
            .filter((a: string) => !ALERGIAS_SUGERIDAS.includes(a))
            .map((item: string) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleAlergia(item)}
                className="rounded-full px-4 py-2 border border-orange-500 bg-orange-100 flex-row items-center"
              >
                <Text className="font-bold text-orange-700 mr-1">{item}</Text>
                <Ionicons name="close" size={16} color="#c2410c" />
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <View className="h-[1px] w-full bg-gray-200 mb-8" />

      {/* SECCIÓN 2: DIETAS */}
      <View className="mb-8">
        <Text className="mb-2 font-bold text-gray-700 text-lg">
          Preferencias o Dietas
        </Text>
        
        {/* Sugerencias Dietas */}
        <View className="mb-3 flex-row flex-wrap gap-2">
          {DIETAS_SUGERIDAS.map((dieta) => {
            const isSelected = data.preferencias.includes(dieta);
            return (
              <TouchableOpacity
                key={dieta}
                onPress={() => toggleDieta(dieta)}
                className={`rounded-full px-4 py-2 border ${
                  isSelected
                    ? "border-green-500 bg-green-100"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={
                    isSelected ? "font-bold text-green-700" : "text-gray-600"
                  }
                >
                  {dieta} {isSelected && "✓"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input Libre Dietas */}
        <View className="flex-row items-center rounded-2xl border border-gray-200 bg-white px-4 py-1 mb-2">
          <TextInput
            className="flex-1 py-2 text-base"
            placeholder="Otra (Ej: Dieta Mediterránea)"
            value={customDieta}
            onChangeText={setCustomDieta}
            onSubmitEditing={addCustomDieta}
          />
          <TouchableOpacity onPress={addCustomDieta}>
            <Ionicons name="add-circle" size={32} color="#22c55e" />
          </TouchableOpacity>
        </View>

        {/* Chips Agregados Manualmente Dietas */}
        <View className="flex-row flex-wrap gap-2">
          {data.preferencias
            .filter((d: string) => !DIETAS_SUGERIDAS.includes(d))
            .map((item: string) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleDieta(item)}
                className="rounded-full px-4 py-2 border border-green-500 bg-green-100 flex-row items-center"
              >
                <Text className="font-bold text-green-700 mr-1">{item}</Text>
                <Ionicons name="close" size={16} color="#15803d" />
              </TouchableOpacity>
            ))}
        </View>
      </View>

    </Animated.View>
  );
};

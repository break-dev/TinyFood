import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { ALERGIAS_SUGERIDAS } from "@/common/utils/variables/alergias";
import { DIETAS_SUGERIDAS } from "@/common/utils/variables/dietas";

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
        alimentos_prohibidos: data.alimentos_prohibidos.filter(
          (i: string) => i !== item,
        ),
      });
    } else {
      setData({
        ...data,
        alimentos_prohibidos: [...data.alimentos_prohibidos, item],
      });
    }
  };

  const addCustomAlergia = () => {
    if (
      customAlergia.trim() &&
      !data.alimentos_prohibidos.includes(customAlergia.trim())
    ) {
      setData({
        ...data,
        alimentos_prohibidos: [
          ...data.alimentos_prohibidos,
          customAlergia.trim(),
        ],
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
      <View className="mb-10">
        <Text
          className="mb-3 text-4xl text-gray-900 tracking-tighter"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Alimentos
        </Text>
        <Text
          className="text-lg text-gray-500 leading-6"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          Cuéntanos qué no puedes comer y qué dieta prefieres seguir para
          personalizar tus recetas.
        </Text>
      </View>

      {/* SECCIÓN 1: ALERGIAS */}
      <View className="mb-10">
        <Text
          className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Alergias / Prohibidos
        </Text>

        {/* Sugerencias Alergias */}
        <View className="mb-6 flex-row flex-wrap gap-3">
          {ALERGIAS_SUGERIDAS.map((alergia) => {
            const isSelected = data.alimentos_prohibidos.includes(alergia);
            return (
              <TouchableOpacity
                key={alergia}
                onPress={() => toggleAlergia(alergia)}
                activeOpacity={0.8}
                className={`rounded-2xl px-5 py-3 border shadow-sm ${
                  isSelected
                    ? "border-orange-500 bg-orange-500 shadow-orange-500/20"
                    : "border-gray-50 bg-white shadow-black/5"
                }`}
              >
                <Text
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                  style={{
                    fontFamily: isSelected
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  }}
                >
                  {alergia} {isSelected && " ✓"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input Libre Alergias */}
        <View className="flex-row items-center rounded-3xl border border-gray-100 bg-gray-50 px-5 py-2 mb-4 shadow-sm">
          <TextInput
            className="flex-1 py-3"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 16,
              color: "#0f172a",
              fontWeight: "normal",
            }}
            placeholder="Otro (Ej: Fresas)"
            placeholderTextColor="#cbd5e1"
            value={customAlergia}
            onChangeText={setCustomAlergia}
            onSubmitEditing={addCustomAlergia}
          />
          <TouchableOpacity onPress={addCustomAlergia} className="ml-2">
            <Ionicons name="add-circle" size={36} color="#f97316" />
          </TouchableOpacity>
        </View>

        {/* Chips Agregados Manualmente */}
        <View className="flex-row flex-wrap gap-2">
          {data.alimentos_prohibidos
            .filter((a: string) => !ALERGIAS_SUGERIDAS.includes(a))
            .map((item: string) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleAlergia(item)}
                className="rounded-xl px-4 py-2 bg-orange-100/50 border border-orange-200 flex-row items-center"
              >
                <Text
                  className="text-orange-700 mr-2"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {item}
                </Text>
                <Ionicons name="close" size={16} color="#f97316" />
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* SECCIÓN 2: DIETAS */}
      <View className="mb-10">
        <Text
          className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Preferencias o Dietas
        </Text>

        {/* Sugerencias Dietas */}
        <View className="mb-6 flex-row flex-wrap gap-3">
          {DIETAS_SUGERIDAS.map((dieta) => {
            const isSelected = data.preferencias.includes(dieta);
            return (
              <TouchableOpacity
                key={dieta}
                onPress={() => toggleDieta(dieta)}
                activeOpacity={0.8}
                className={`rounded-2xl px-5 py-3 border shadow-sm ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500 shadow-emerald-500/20"
                    : "border-gray-50 bg-white shadow-black/5"
                }`}
              >
                <Text
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                  style={{
                    fontFamily: isSelected
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  }}
                >
                  {dieta} {isSelected && " ✓"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input Libre Dietas */}
        <View className="flex-row items-center rounded-3xl border border-gray-100 bg-gray-50 px-5 py-2 mb-4 shadow-sm">
          <TextInput
            className="flex-1 py-3"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 16,
              color: "#0f172a",
              fontWeight: "normal",
            }}
            placeholder="Otra (Ej: Dieta Mediterránea)"
            placeholderTextColor="#cbd5e1"
            value={customDieta}
            onChangeText={setCustomDieta}
            onSubmitEditing={addCustomDieta}
          />
          <TouchableOpacity onPress={addCustomDieta} className="ml-2">
            <Ionicons name="add-circle" size={36} color="#10b981" />
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
                className="rounded-xl px-4 py-2 bg-emerald-100/50 border border-emerald-200 flex-row items-center"
              >
                <Text
                  className="text-emerald-700 mr-2"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {item}
                </Text>
                <Ionicons name="close" size={16} color="#10b981" />
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </Animated.View>
  );
};

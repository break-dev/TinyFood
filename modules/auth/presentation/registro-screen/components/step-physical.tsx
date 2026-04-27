import React, { useRef } from "react";
import { View, Text, TextInput, Image } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepPhysical = ({ data, setData }: Props) => {
  // Referencias para saltar entre inputs
  const mesRef = useRef<TextInput>(null);
  const anioRef = useRef<TextInput>(null);

  // Extraer valores actuales del string DD/MM/YYYY
  const [d = "", m = "", a = ""] = (data.fecha_nacimiento || "").split("/");

  const updateDate = (dia: string, mes: string, anio: string) => {
    setData({ ...data, fecha_nacimiento: `${dia}/${mes}/${anio}` });
  };

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      className="flex-1"
    >
      {/* Header: Title */}
      <View className="mb-8">
        <Text className="mb-2 text-3xl font-bold text-gray-900">Sobre ti</Text>
        <Text className="text-gray-500">
          Necesitamos estos datos para calcular tus necesidades nutricionales.
        </Text>
      </View>

      {/* Fila: Peso y Talla */}
      <View className="mb-6 flex-row gap-4">
        <View className="flex-1">
          <Text className="mb-2 font-semibold text-gray-700">Peso (kg)</Text>
          <View className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4">
            <Ionicons name="fitness-outline" size={20} color="#6b7280" />
            <TextInput
              className="ml-3 flex-1 text-lg"
              placeholder="Ej: 70"
              keyboardType="numeric"
              value={data.peso}
              onChangeText={(text) => setData({ ...data, peso: text })}
            />
          </View>
        </View>

        <View className="flex-1">
          <Text className="mb-2 font-semibold text-gray-700">Talla (cm)</Text>
          <View className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4">
            <Ionicons name="resize-outline" size={20} color="#6b7280" />
            <TextInput
              className="ml-3 flex-1 text-lg"
              placeholder="Ej: 175"
              keyboardType="numeric"
              value={data.talla}
              onChangeText={(text) => setData({ ...data, talla: text })}
            />
          </View>
        </View>
      </View>

      {/* Fecha Nacimiento con 3 Celdas */}
      <View className="mb-6">
        <Text className="mb-2 font-semibold text-gray-700">Fecha Nacimiento</Text>
        <View className="flex-row items-center gap-2">
          {/* Día */}
          <View className="flex-1 flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4">
            <TextInput
              className="flex-1 text-center text-lg"
              placeholder="DD"
              keyboardType="number-pad"
              maxLength={2}
              value={d}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, "");
                updateDate(cleaned, m, a);
                if (cleaned.length === 2) mesRef.current?.focus();
              }}
            />
          </View>

          <Text className="text-xl text-gray-400">/</Text>

          {/* Mes */}
          <View className="flex-1 flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4">
            <TextInput
              ref={mesRef}
              className="flex-1 text-center text-lg"
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              value={m}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, "");
                updateDate(d, cleaned, a);
                if (cleaned.length === 2) anioRef.current?.focus();
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && m === "") {
                  // Opcional: regresar al anterior
                }
              }}
            />
          </View>

          <Text className="text-xl text-gray-400">/</Text>

          {/* Año */}
          <View className="flex-[1.5] flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4">
            <TextInput
              ref={anioRef}
              className="flex-1 text-center text-lg"
              placeholder="YYYY"
              keyboardType="number-pad"
              maxLength={4}
              value={a}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, "");
                updateDate(d, m, cleaned);
              }}
            />
          </View>
        </View>
      </View>

      {/* 📸 Imagen del onboarding */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/onboarding/onboarding-physical.png")}
          className="h-full w-full"
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

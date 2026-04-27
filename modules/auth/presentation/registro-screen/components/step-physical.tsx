import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Platform } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepPhysical = ({ data, setData }: Props) => {
  const [showPicker, setShowPicker] = useState(false);

  // Función para convertir de Date a string DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Función para convertir de string DD/MM/YYYY a Date (para que el picker abra en la fecha correcta)
  const parseDate = () => {
    if (data.fecha_nacimiento && data.fecha_nacimiento.length === 10) {
      const [d, m, y] = data.fecha_nacimiento.split("/").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date(2000, 0, 1); // Fecha sugerida por defecto
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    
    if (selectedDate) {
      setData({ ...data, fecha_nacimiento: formatDate(selectedDate) });
    }
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

      {/* Fecha Nacimiento - Estilo Onboarding con Picker */}
      <View className="mb-6">
        <Text className="mb-2 font-semibold text-gray-700">Fecha Nacimiento</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
          className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4"
        >
          <Ionicons name="calendar-outline" size={20} color="#6b7280" />
          <Text
            className={`ml-3 flex-1 text-lg ${
              data.fecha_nacimiento ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {data.fecha_nacimiento || "DD/MM/YYYY"}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={parseDate()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={onChangeDate}
          />
        )}
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

import React from "react";
import { View, Text, TextInput, Image } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepPhysical = ({ data, setData }: Props) => (
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

    <View className="mb-6">
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

    <View className="mb-6">
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

import React from "react";
import { View, Text, TextInput, Image } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepMedical = ({ data, setData }: Props) => (
  <Animated.View
    entering={FadeInRight}
    exiting={FadeOutLeft}
    className="flex-1"
  >
    {/* Header: Title */}
    <View className="mb-8">
      <Text className="mb-2 text-3xl font-bold text-gray-900">Salud</Text>
      <Text className="text-gray-500">
        Información importante para tus comidas.
      </Text>
    </View>

    <View className="mb-6">
      <Text className="mb-2 font-semibold text-gray-700">
        Alergias / Alimentos Prohibidos
      </Text>
      <View className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4">
        <Ionicons name="medkit-outline" size={20} color="#6b7280" />
        <TextInput
          className="ml-3 flex-1 text-lg"
          placeholder="Ej: Maní, Lactosa..."
          multiline
          numberOfLines={3}
          value={data.alimentos_prohibidos}
          onChangeText={(text) =>
            setData({ ...data, alimentos_prohibidos: text })
          }
        />
      </View>
    </View>

    <View className="mb-6">
      <Text className="mb-2 font-semibold text-gray-700">
        Preferencias o Dietas
      </Text>
      <View className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-4">
        <Ionicons name="nutrition-outline" size={20} color="#6b7280" />
        <TextInput
          className="ml-3 flex-1 text-lg"
          placeholder="Ej: Vegano, Keto, Sin gluten..."
          value={data.preferencias}
          onChangeText={(text) => setData({ ...data, preferencias: text })}
        />
      </View>
    </View>

    {/* 📸 Imagen del onboarding */}
    <View className="flex-1 items-center justify-center">
      <Image
        source={require("@/assets/images/onboarding/onboarding-medical.png")}
        className="h-full w-full"
        resizeMode="contain"
      />
    </View>
  </Animated.View>
);

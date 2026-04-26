import React from "react";
import { View, Text, TextInput } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

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
    <Text className="mb-2 text-3xl font-bold text-gray-900">Salud</Text>
    <Text className="mb-8 text-gray-500">
      Información importante para tus comidas.
    </Text>

    <View className="mb-6">
      <Text className="mb-2 font-semibold text-gray-700">
        Alergias / Alimentos Prohibidos
      </Text>
      <TextInput
        className="rounded-2xl bg-gray-100 p-4 text-lg"
        placeholder="Ej: Maní, Lactosa..."
        multiline
        numberOfLines={3}
        value={data.alimentos_prohibidos}
        onChangeText={(text) =>
          setData({ ...data, alimentos_prohibidos: text })
        }
      />
    </View>

    <View className="mb-6">
      <Text className="mb-2 font-semibold text-gray-700">
        Preferencias o Dietas
      </Text>
      <TextInput
        className="rounded-2xl bg-gray-100 p-4 text-lg"
        placeholder="Ej: Vegano, Keto, Sin gluten..."
        value={data.preferencias}
        onChangeText={(text) => setData({ ...data, preferencias: text })}
      />
    </View>
  </Animated.View>
);

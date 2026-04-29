import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetAlimentacion = ({ data, setData }: Props) => (
  <View className="gap-4">
    <Text className="text-xl font-bold text-gray-900 mb-2">Alimentación</Text>

    <View>
      <Text className="mb-2 font-semibold text-gray-600">
        Alergias / Prohibidos
      </Text>
      <Text className="mb-2 text-gray-400 text-sm">
        Separados por coma. Ej: Maní, Lactosa
      </Text>
      <View className="flex-row items-center rounded-2xl bg-gray-100 px-4 py-4">
        <Ionicons name="medkit-outline" size={20} color="#6b7280" />
        <TextInput
          className="ml-3 flex-1 text-lg"
          placeholder="Ej: Maní, Lactosa..."
          value={data.alimentos_prohibidos}
          onChangeText={(t) => setData({ ...data, alimentos_prohibidos: t })}
        />
      </View>
    </View>

    <View>
      <Text className="mb-2 font-semibold text-gray-600">
        Preferencias / Dietas
      </Text>
      <Text className="mb-2 text-gray-400 text-sm">
        Separados por coma. Ej: Vegano, Keto
      </Text>
      <View className="flex-row items-center rounded-2xl bg-gray-100 px-4 py-4">
        <Ionicons name="nutrition-outline" size={20} color="#6b7280" />
        <TextInput
          className="ml-3 flex-1 text-lg"
          placeholder="Ej: Vegano, Keto..."
          value={data.preferencias}
          onChangeText={(t) => setData({ ...data, preferencias: t })}
        />
      </View>
    </View>
  </View>
);

import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetFisica = ({ data, setData }: Props) => (
  <View className="gap-4">
    <Text className="text-xl font-bold text-gray-900 mb-2">Datos físicos</Text>

    <View>
      <Text className="mb-2 font-semibold text-gray-600">Peso (kg)</Text>
      <View className="flex-row items-center rounded-2xl bg-gray-100 px-4 py-4">
        <Ionicons name="fitness-outline" size={20} color="#6b7280" />
        <TextInput
          className="ml-3 flex-1 text-lg"
          keyboardType="numeric"
          placeholder="Ej: 70"
          value={data.peso}
          onChangeText={(t) => setData({ ...data, peso: t })}
        />
      </View>
    </View>

    <View>
      <Text className="mb-2 font-semibold text-gray-600">Talla (cm)</Text>
      <View className="flex-row items-center rounded-2xl bg-gray-100 px-4 py-4">
        <Ionicons name="resize-outline" size={20} color="#6b7280" />
        <TextInput
          className="ml-3 flex-1 text-lg"
          keyboardType="numeric"
          placeholder="Ej: 175"
          value={data.talla}
          onChangeText={(t) => setData({ ...data, talla: t })}
        />
      </View>
    </View>
  </View>
);

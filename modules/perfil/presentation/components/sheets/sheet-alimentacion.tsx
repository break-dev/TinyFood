import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetAlimentacion = ({ data, setData }: Props) => (
  <View className="gap-4">
    <Text
      className="text-3xl text-gray-900 tracking-tighter mb-2"
      style={{ fontFamily: "Outfit_900Black" }}
    >
      Alimentación
    </Text>

    <View>
      <Text
        className="mb-3 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400"
        style={{ fontFamily: "Outfit_700Bold" }}
      >
        Alergias / Prohibidos
      </Text>
      <Text
        className="mb-2 text-gray-400 text-sm italic"
        style={{ fontFamily: "Outfit_400Regular" }}
      >
        Separados por coma. Ej: Maní, Lactosa
      </Text>
      <View className="flex-row items-center rounded-2xl bg-gray-50 border border-gray-100 px-4 py-2">
        <Ionicons name="medkit-outline" size={20} color="#9ca3af" />
        <TextInput
          className="ml-3 flex-1"
          style={{
            fontFamily: "Outfit_700Bold",
            fontSize: 17,
            color: "#111827",
            fontWeight: "normal",
            paddingVertical: 15,
          }}
          placeholder="Ej: Maní, Lactosa..."
          placeholderTextColor="#cbd5e1"
          value={data.alimentos_prohibidos}
          onChangeText={(t) => setData({ ...data, alimentos_prohibidos: t })}
        />
      </View>
    </View>

    <View>
      <Text
        className="mb-3 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400"
        style={{ fontFamily: "Outfit_700Bold" }}
      >
        Preferencias / Dietas
      </Text>
      <Text
        className="mb-2 text-gray-400 text-sm italic"
        style={{ fontFamily: "Outfit_400Regular" }}
      >
        Separados por coma. Ej: Vegano, Keto
      </Text>
      <View className="flex-row items-center rounded-2xl bg-gray-50 border border-gray-100 px-4 py-2">
        <Ionicons name="nutrition-outline" size={20} color="#9ca3af" />
        <TextInput
          className="ml-3 flex-1"
          style={{
            fontFamily: "Outfit_700Bold",
            fontSize: 17,
            color: "#111827",
            fontWeight: "normal",
            paddingVertical: 15,
          }}
          placeholder="Ej: Vegano, Keto..."
          placeholderTextColor="#cbd5e1"
          value={data.preferencias}
          onChangeText={(t) => setData({ ...data, preferencias: t })}
        />
      </View>
    </View>
  </View>
);

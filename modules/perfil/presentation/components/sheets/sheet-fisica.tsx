import React from "react";
import { View, Text, TextInput } from "react-native";
import { Dumbbell, Maximize, User } from "lucide-react-native";
import { MotiView } from "moti";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetFisica = ({ data, setData }: Props) => (
  <View className="gap-6">
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
    >
      <Text
        className="text-3xl text-gray-900 tracking-tighter mb-1"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        Tus Datos
      </Text>
      <Text
        className="text-gray-400 text-sm mb-6"
        style={{ fontFamily: "Outfit_400Regular" }}
      >
        Ajusta tu información para mejores cálculos nutricionales
      </Text>
    </MotiView>

    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 50 }}
    >
      <Text
        className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        ¿Cómo te llamas?
      </Text>
      <View className="flex-row items-center rounded-[24px] bg-gray-50 px-5 border border-gray-100">
        <User size={20} color="#9ca3af" strokeWidth={2} />
        <TextInput
          className="ml-4 flex-1 py-5"
          style={{
            fontFamily: "Outfit_700Bold",
            fontSize: 17,
            color: "#111827",
            fontWeight: "normal",
          }}
          placeholder="Tu nombre completo"
          placeholderTextColor="#9ca3af"
          value={data.nombre}
          onChangeText={(t) => setData({ ...data, nombre: t })}
        />
      </View>
    </MotiView>

    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 100 }}
    >
      <Text
        className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        Peso Actual (kg)
      </Text>
      <View className="flex-row items-center rounded-[24px] bg-gray-50 px-5 border border-gray-100">
        <Dumbbell size={20} color="#9ca3af" strokeWidth={2} />
        <TextInput
          className="ml-4 flex-1 py-5"
          style={{
            fontFamily: "Outfit_700Bold",
            fontSize: 17,
            color: "#111827",
            fontWeight: "normal",
          }}
          keyboardType="numeric"
          placeholder="Ej: 70"
          placeholderTextColor="#9ca3af"
          value={data.peso}
          onChangeText={(t) => setData({ ...data, peso: t })}
        />
      </View>
    </MotiView>

    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 200 }}
    >
      <Text
        className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        Talla Actual (cm)
      </Text>
      <View className="flex-row items-center rounded-[24px] bg-gray-50 px-5 border border-gray-100">
        <Maximize size={20} color="#9ca3af" strokeWidth={2} />
        <TextInput
          className="ml-4 flex-1 py-5"
          style={{
            fontFamily: "Outfit_700Bold",
            fontSize: 17,
            color: "#111827",
            fontWeight: "normal",
          }}
          keyboardType="numeric"
          placeholder="Ej: 175"
          placeholderTextColor="#9ca3af"
          value={data.talla}
          onChangeText={(t) => setData({ ...data, talla: t })}
        />
      </View>
    </MotiView>
  </View>
);

import React, { useState } from "react";
import {
  View,
  Text as Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { ModernCalendar } from "@/common/presentation/components/modern-calendar";

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
          Sobre ti
        </Text>
        <Text
          className="text-lg text-gray-500 leading-6"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          Necesitamos estos datos para calcular tus necesidades nutricionales de
          forma precisa.
        </Text>
      </View>

      {/* Input: Nombre */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-3 ml-1">
          <Text
            className="text-sm font-bold uppercase tracking-widest text-gray-400"
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            ¿Cómo te llamas?
          </Text>
        </View>
        <View className="flex-row items-center rounded-3xl border border-gray-100 bg-gray-50 px-5 py-2 shadow-sm">
          <Ionicons name="person-outline" size={20} color="#9ca3af" />
          <TextInput
            className="ml-3 flex-1"
            style={{
              fontFamily: "Outfit_700Bold",
              fontSize: 17,
              color: "#111827",
              fontWeight: "normal",
              paddingVertical: 15,
            }}
            placeholder="Tu nombre completo"
            placeholderTextColor="#cbd5e1"
            value={data.nombre}
            onChangeText={(text) => setData({ ...data, nombre: text })}
          />
        </View>
      </View>

      {/* Fila: Peso y Talla */}
      <View className="mb-8 flex-row gap-5">
        <View className="flex-1">
          <Text
            className="mb-3 ml-1 text-sm font-bold uppercase tracking-widest text-gray-400"
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            Peso (kg)
          </Text>
          <View className="flex-row items-center rounded-3xl border border-gray-100 bg-gray-50 px-5 py-2 shadow-sm">
            <Ionicons name="fitness-outline" size={20} color="#9ca3af" />
            <TextInput
              className="ml-3 flex-1"
              style={{
                fontFamily: "Outfit_700Bold",
                fontSize: 17,
                color: "#111827",
                fontWeight: "normal",
                paddingVertical: 15,
              }}
              placeholder="Ej: 70"
              placeholderTextColor="#cbd5e1"
              keyboardType="numeric"
              value={data.peso}
              onChangeText={(text) => setData({ ...data, peso: text })}
            />
          </View>
        </View>

        <View className="flex-1">
          <Text
            className="mb-3 ml-1 text-sm font-bold uppercase tracking-widest text-gray-400"
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            Talla (cm)
          </Text>
          <View className="flex-row items-center rounded-3xl border border-gray-100 bg-gray-50 px-5 py-2 shadow-sm">
            <Ionicons name="resize-outline" size={20} color="#9ca3af" />
            <TextInput
              className="ml-3 flex-1"
              style={{
                fontFamily: "Outfit_700Bold",
                fontSize: 17,
                color: "#111827",
                fontWeight: "normal",
                paddingVertical: 15,
              }}
              placeholder="Ej: 175"
              placeholderTextColor="#cbd5e1"
              keyboardType="numeric"
              value={data.talla}
              onChangeText={(text) => setData({ ...data, talla: text })}
            />
          </View>
        </View>
      </View>

      {/* Fecha Nacimiento */}
      <View className="mb-10">
        <Text
          className="mb-3 ml-1 text-sm font-bold uppercase tracking-widest text-gray-400"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Fecha de Nacimiento
        </Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
          className="flex-row items-center rounded-3xl border border-gray-100 bg-gray-50 px-6 py-5 shadow-sm"
        >
          <Ionicons name="calendar-outline" size={22} color="#9ca3af" />
          <Text
            className={`ml-4 flex-1 ${
              data.fecha_nacimiento ? "text-gray-900" : "text-gray-300"
            }`}
            style={{
              fontFamily: "Outfit_700Bold",
              fontSize: data.fecha_nacimiento ? 16 : 14,
            }}
          >
            {data.fecha_nacimiento 
              ? formatDate(new Date(data.fecha_nacimiento)) 
              : "DD / MM / YYYY"}
          </Text>
          <View className="rounded-xl bg-white p-2 shadow-sm border border-gray-50">
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        <Modal
          visible={showPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/40 px-6">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowPicker(false)}
              className="absolute inset-0"
            />
            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 20 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              className="w-full"
            >
              <ModernCalendar
                value={data.fecha_nacimiento}
                onChange={(date) => {
                  setData({ ...data, fecha_nacimiento: date });
                  setShowPicker(false);
                }}
              />
            </MotiView>
          </View>
        </Modal>
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

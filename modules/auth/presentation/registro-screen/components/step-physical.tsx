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

import * as Haptics from "expo-haptics";
import { Genero } from "@/common/utils/enums/genero";
import * as ImagePicker from "expo-image-picker";
import { Camera, User } from "lucide-react-native";

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

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          setData({
            ...data,
            localUri: asset.uri,
            foto_b64: asset.base64,
          });
        }
      }
    } catch (error) {
      console.error("[StepPhysical] Error al seleccionar imagen:", error);
    }
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

      {/* Avatar Picker Section */}
      <View className="items-center mb-8">
        <View className="relative">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePickImage}
            className="w-28 h-28 rounded-[40px] overflow-hidden items-center justify-center bg-gray-50"
            style={{
              borderWidth: 4,
              borderColor: "rgba(249, 115, 22, 0.1)", // border-orange-500/10
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            {data.localUri ? (
              <Image
                source={{ uri: data.localUri }}
                className="w-full h-full"
              />
            ) : (
              <View className="flex-1 bg-orange-100 items-center justify-center w-full h-full">
                <User size={56} color="#f97316" strokeWidth={1.5} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePickImage}
            className="absolute bottom-0 right-0 h-9 w-9 bg-orange-500 rounded-full items-center justify-center border-2 border-white"
            style={{
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Camera size={16} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
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
              fontFamily: "Outfit_400Regular",
              fontSize: 17,
              color: "#111827",
              fontWeight: "normal",
              paddingVertical: 15,
            }}
            placeholder="Tu nombre completo"
            placeholderTextColor="#cbd5e1"
            defaultValue={data.nombre}
            onChangeText={(text) => {
              data.nombre = text;
            }}
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
                fontFamily: "Outfit_400Regular",
                fontSize: 17,
                color: "#111827",
                fontWeight: "normal",
                paddingVertical: 15,
              }}
              placeholder="Ej: 70"
              placeholderTextColor="#cbd5e1"
              keyboardType="numeric"
              defaultValue={data.peso}
              onChangeText={(text) => {
                data.peso = text;
              }}
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
                fontFamily: "Outfit_400Regular",
                fontSize: 17,
                color: "#111827",
                fontWeight: "normal",
                paddingVertical: 15,
              }}
              placeholder="Ej: 175"
              placeholderTextColor="#cbd5e1"
              keyboardType="numeric"
              defaultValue={data.talla}
              onChangeText={(text) => {
                data.talla = text;
              }}
            />
          </View>
        </View>
      </View>

      {/* Fecha Nacimiento */}
      <View className="mb-8">
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

      {/* Género */}
      <View className="mb-10">
        <Text
          className="mb-3 ml-1 text-sm font-bold uppercase tracking-widest text-gray-400"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Género
        </Text>
        <View className="flex-row gap-3">
          {[Genero.Masculino, Genero.Femenino, Genero.Otro].map((g) => {
            const isSelected = data.genero === g;
            return (
              <TouchableOpacity
                key={g}
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setData({ ...data, genero: g });
                }}
                className="flex-1 py-4 rounded-3xl items-center justify-center border"
                style={
                  isSelected
                    ? {
                        backgroundColor: "#f97316",
                        borderColor: "#f97316",
                        shadowColor: "#f97316",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.35,
                        shadowRadius: 15,
                        elevation: 6,
                      }
                    : {
                        backgroundColor: "#f9fafb",
                        borderColor: "#f3f4f6",
                      }
                }
              >
                <Text
                  className={`text-base ${
                    isSelected ? "text-white" : "text-gray-500"
                  }`}
                  style={{
                    fontFamily: isSelected
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  }}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
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

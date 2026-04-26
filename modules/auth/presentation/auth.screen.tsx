import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useAutenticar } from "../logic/use-autenticar";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export const AuthScreen = () => {
  const { loading, onLoginPress, animatedLogoStyle } = useAutenticar();

  return (
    <View className="flex-1 bg-white">
      {/* Círculos decorativos animados */}
      <Animated.View
        style={animatedLogoStyle}
        className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-100 opacity-50"
      />
      <Animated.View
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-50 opacity-80"
        entering={FadeInUp.delay(500).duration(1000)}
      />

      {/* 📸 Imagen superior izquierda — descomentar cuando tengas tu imagen */}
      {/* <Image
        source={require("@/assets/images/auth/auth-top-left.png")}
        className="absolute left-0 top-12 h-24 w-24"
        resizeMode="contain"
      /> */}

      <View className="flex-1 items-center justify-center px-8">
        {/* Logo Section with Mascot */}
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          className="mb-6 flex-row items-center justify-center"
        >
          {/* 📸 Mascota asomándose */}
          <View className="absolute -left-28 -top-8 z-10">
            <Image
              source={require("@/assets/images/auth/mascota-peek.png")}
              className="h-40 w-40"
              style={{ transform: [{ rotate: '0deg' }] }}
              resizeMode="contain"
            />
          </View>

          <View className="h-32 w-32 items-center justify-center rounded-3xl bg-orange-500 shadow-xl shadow-orange-500/50">
            <Ionicons name="restaurant" size={64} color="white" />
          </View>
        </Animated.View>

        {/* Text Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          className="mb-4 items-center"
        >
          <Text className="mb-1 text-5xl font-black tracking-tighter text-gray-900">
            TinyFood
          </Text>
          <View className="mt-1 mb-3 h-1 w-16 rounded-full bg-orange-400" />
          <Text className="text-center text-lg font-medium text-gray-500">
            Tu asistente inteligente para una{"\n"}vida saludable y sin
            desperdicio
          </Text>
        </Animated.View>

        {/* Feature Pills */}
        <Animated.View
          entering={FadeInDown.delay(350).duration(800).springify()}
          className="mb-10 flex-row flex-wrap justify-center gap-2"
        >
          <View className="flex-row items-center rounded-full bg-green-50 px-4 py-2">
            <Ionicons name="scan-outline" size={14} color="#16a34a" />
            <Text className="ml-1.5 text-sm font-semibold text-green-600">Foto IA</Text>
          </View>
          <View className="flex-row items-center rounded-full bg-green-50 px-4 py-2">
            <Ionicons name="timer-outline" size={14} color="#16a34a" />
            <Text className="ml-1.5 text-sm font-semibold text-green-600">Cero desperdicio</Text>
          </View>
          <View className="flex-row items-center rounded-full bg-green-50 px-4 py-2">
            <Ionicons name="restaurant-outline" size={14} color="#16a34a" />
            <Text className="ml-1.5 text-sm font-semibold text-green-600">Recetas</Text>
          </View>
        </Animated.View>

        {/* Action Section */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(1000).springify()}
          className="w-full"
        >
          <TouchableOpacity
            onPress={onLoginPress}
            disabled={loading}
            activeOpacity={0.85}
            className={`flex-row items-center justify-center rounded-2xl bg-gray-900 py-5 shadow-lg ${loading ? "opacity-70" : ""
              }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons
                  name="logo-google"
                  size={20}
                  color="white"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-lg font-bold text-white">
                  Continuar con Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text className="mt-6 text-center text-sm leading-5 text-gray-400 px-4">
            Al continuar, aceptas nuestros Términos de Servicio y Política de
            Privacidad.
          </Text>
        </Animated.View>
      </View>

      {/* Footer Decoration */}
      <View className="absolute bottom-10 w-full items-center">
        <View className="h-1 w-12 rounded-full bg-gray-100" />
      </View>
    </View>
  );
};

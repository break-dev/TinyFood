import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogout } from "@/common/logic/use-logout";
import { useAuthState } from "@/common/logic/use-auth-state";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export const DespensaScreen = () => {
  const { isLoading, handleLogout } = useLogout();
  const { usuario } = useAuthState();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-6">
        <View>
          <Text className="text-gray-400 font-medium">Hola de nuevo,</Text>
          <Text className="text-3xl font-black text-gray-900">
            {usuario?.nombre || "Explorador"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm"
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(800)}
        className="flex-1 px-6"
      >
        {/* Card Principal */}
        <View className="overflow-hidden rounded-[32px] bg-orange-500 p-8 shadow-xl shadow-orange-500/40">
          <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <Ionicons name="leaf" size={40} color="white" />
          <Text className="mt-4 text-2xl font-bold text-white">
            Tu cocina inteligente
          </Text>
          <Text className="mt-2 text-white/80 leading-5">
            Estamos preparando todo para que puedas gestionar tus alimentos y
            recibir sugerencias personalizadas.
          </Text>
        </View>

        {/* Stats / Acciones Rápidas */}
        <View className="mt-8 flex-row gap-4">
          <View className="flex-1 rounded-[24px] bg-white p-6 shadow-sm">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Ionicons name="calendar" size={20} color="#3b82f6" />
            </View>
            <Text className="mt-4 text-sm font-medium text-gray-400">
              Próximo vencimiento
            </Text>
            <Text className="text-lg font-bold text-gray-900">Sin datos</Text>
          </View>
          <View className="flex-1 rounded-[24px] bg-white p-6 shadow-sm">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <Ionicons name="fast-food" size={20} color="#22c55e" />
            </View>
            <Text className="mt-4 text-sm font-medium text-gray-400">
              Items en despensa
            </Text>
            <Text className="text-lg font-bold text-gray-900">0</Text>
          </View>
        </View>
      </Animated.View>

      {/* Floating Action Button Placeholder */}
      <View className="absolute bottom-10 right-6">
        <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full bg-gray-900 shadow-2xl">
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

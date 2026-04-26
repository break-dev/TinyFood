import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthState } from "@/common/logic/use-auth-state";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export const PerfilScreen = () => {
  const { usuario, logout } = useAuthState();

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <View className="items-center mt-8 mb-10">
          <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-4 overflow-hidden border-2 border-orange-500">
            {usuario?.url_foto ? (
              <Image
                source={{ uri: usuario.url_foto }}
                className="w-full h-full"
              />
            ) : (
              <Ionicons name="person" size={50} color="#f97316" />
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            {usuario?.nombre || "Usuario"}
          </Text>
          <Text className="text-gray-500">
            {usuario?.nivel_actividad
              ? `Nivel de actividad: ${usuario.nivel_actividad}`
              : "Perfil de usuario"}
          </Text>
        </View>

        <View className="bg-gray-50 rounded-3xl p-4 mb-8">
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <Ionicons name="fitness-outline" size={24} color="#f97316" />
            <Text className="ml-4 text-gray-700 text-lg">
              Peso: {usuario?.peso || "--"} kg
            </Text>
          </View>
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <Ionicons name="resize-outline" size={24} color="#f97316" />
            <Text className="ml-4 text-gray-700 text-lg">
              Talla: {usuario?.talla || "--"} cm
            </Text>
          </View>
        </View>

        <View className="mt-auto">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 flex-row items-center justify-center p-4 rounded-2xl border border-red-100"
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text className="ml-2 text-red-500 font-bold text-lg">
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

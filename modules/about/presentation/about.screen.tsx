import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export const AboutScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-8">
          <View className="bg-orange-100 p-4 rounded-full mb-4">
            <Ionicons name="information-circle" size={48} color="#f97316" />
          </View>
          <Text className="text-3xl font-bold text-gray-800">
            Sobre TinyFood
          </Text>
          <Text className="text-orange-500 font-medium">Versión 1.0.0</Text>
        </View>

        <View className="bg-gray-50 p-5 rounded-2xl mb-6">
          <Text className="text-gray-700 leading-6 text-lg">
            TinyFood es una iniciativa diseñada para reducir el desperdicio de
            alimentos en el hogar, utilizando inteligencia artificial para
            gestionar tu despensa de forma inteligente.
          </Text>
        </View>

        <View className="space-y-4">
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            Equipo de Desarrollo
          </Text>
          <View className="flex-row items-center bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-4">
              <Ionicons name="code-slash" size={24} color="#4b5563" />
            </View>
            <View>
              <Text className="font-bold text-gray-800">Franklin Baca Campos</Text>
              <Text className="text-gray-500">Break</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

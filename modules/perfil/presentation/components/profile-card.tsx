import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export const ProfileCard = ({ icon, title, subtitle, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-3 flex-row items-center rounded-2xl bg-gray-50 p-4 border border-gray-100"
  >
    <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
      <Ionicons name={icon as any} size={20} color="#f97316" />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-400 mb-0.5">{title}</Text>
      <Text className="text-gray-800 font-medium" numberOfLines={1}>
        {subtitle || "Sin datos"}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
  </TouchableOpacity>
);
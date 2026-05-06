import React from "react";
import { View, Text as Text, TouchableOpacity } from "react-native";
import { LucideIcon, ChevronRight } from "lucide-react-native";
import { MotiView } from "moti";

interface Props {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
  delay?: number;
}

export const ProfileCard = ({
  Icon,
  title,
  subtitle,
  onPress,
  delay = 0,
}: Props) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay }}
      className="mb-4 flex-row items-center rounded-[28px] bg-white p-5 shadow-sm border border-gray-100"
    >
      <View className="w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center mr-4">
        <Icon size={22} color="#f97316" strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text
          className="text-xs text-gray-400 uppercase tracking-widest mb-1"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          {title}
        </Text>
        <Text
          className="text-gray-800 text-base"
          style={{ fontFamily: "Outfit_700Bold" }}
          numberOfLines={1}
        >
          {subtitle || "Sin datos"}
        </Text>
      </View>
      <View className="h-8 w-8 items-center justify-center rounded-xl bg-gray-50">
        <ChevronRight size={16} color="#d1d5db" strokeWidth={2.5} />
      </View>
    </MotiView>
  </TouchableOpacity>
);

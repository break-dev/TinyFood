import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { ModernCalendar } from "@/common/presentation/components/modern-calendar";
import { useAppTheme } from "@/common/logic/use-app-theme";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetFecha = ({ data, setData }: Props) => {
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const { isDark } = useAppTheme();

  const parseDate = () => {
    if (data.fecha_nacimiento) {
      // Parsear manualmente para evitar conversión UTC
      const [year, month, day] = data.fecha_nacimiento.split("-").map(Number);
      return new Date(year, month - 1, day); // mes es 0-indexed
    }
    return new Date(2000, 0, 1);
  };

  return (
    <View className="gap-4">
      <Text
        className="text-3xl text-gray-900 dark:text-white tracking-tighter"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        Fecha de nacimiento
      </Text>
      <Text
        className="text-gray-400 dark:text-neutral-400 text-sm -mt-2 mb-4"
        style={{ fontFamily: "Outfit_400Regular" }}
      >
        Selecciona tu fecha de nacimiento para ajustar tus metas.
      </Text>

      {/* Botón para abrir el picker */}
      <TouchableOpacity
        onPress={() => setMostrarPicker(true)}
        className="flex-row items-center rounded-3xl bg-gray-50 dark:bg-neutral-950 px-5 py-5 border border-gray-100 dark:border-neutral-900 shadow-sm"
      >
        <Ionicons name="calendar-outline" size={22} color={isDark ? "#737373" : "#9ca3af"} />
        <Text
          className="ml-4 flex-1 text-lg text-gray-900 dark:text-neutral-100"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          {data.fecha_nacimiento || "Seleccionar fecha"}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={isDark ? "#737373" : "#9ca3af"} />
      </TouchableOpacity>

      {/* Picker — solo se muestra al presionar */}
      <Modal
        visible={mostrarPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMostrarPicker(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setMostrarPicker(false)}
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
                setMostrarPicker(false);
                setData({
                  ...data,
                  fecha_nacimiento: date,
                });
              }}
            />
          </MotiView>
        </View>
      </Modal>

      {data.fecha_nacimiento && (
        <View className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-3 border border-orange-100 dark:border-orange-900/30">
          <Text className="text-center text-orange-600 dark:text-orange-400 font-semibold">
            📅 {data.fecha_nacimiento}
          </Text>
        </View>
      )}
    </View>
  );
};

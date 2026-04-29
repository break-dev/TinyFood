import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { ModernCalendar } from "@/common/presentation/components/modern-calendar";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetFecha = ({ data, setData }: Props) => {
  const [mostrarPicker, setMostrarPicker] = useState(false);

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
      <Text className="text-xl font-bold text-gray-900">
        Fecha de nacimiento
      </Text>
      <Text className="text-gray-400 text-sm -mt-2">
        Selecciona tu fecha de nacimiento.
      </Text>

      {/* Botón para abrir el picker */}
      <TouchableOpacity
        onPress={() => setMostrarPicker(true)}
        className="flex-row items-center rounded-2xl bg-gray-100 px-4 py-4 border border-gray-200"
      >
        <Ionicons name="calendar-outline" size={20} color="#6b7280" />
        <Text className="ml-3 flex-1 text-lg text-gray-700">
          {data.fecha_nacimiento || "Seleccionar fecha"}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
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
        <View className="bg-orange-50 rounded-2xl p-3 border border-orange-100">
          <Text className="text-center text-orange-600 font-semibold">
            📅 {data.fecha_nacimiento}
          </Text>
        </View>
      )}
    </View>
  );
};

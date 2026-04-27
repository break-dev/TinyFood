import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

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
      {mostrarPicker && (
        <DateTimePicker
          value={parseDate()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          onChange={(_, date) => {
            setMostrarPicker(false);
            if (date) {
              // Usar año, mes, día directamente sin conversión UTC
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              setData({
                ...data,
                fecha_nacimiento: `${year}-${month}-${day}`,
              });
            }
          }}
        />
      )}

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

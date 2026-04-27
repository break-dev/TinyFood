import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { CONDICIONES_MEDICAS_SUGERIDAS } from "@/common/utils/enums/condiciones-medicas";

interface Condicion {
  nombre: string;
  descripcion: string;
}

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepMedical = ({ data, setData }: Props) => {
  const [customCondicion, setCustomCondicion] = useState("");

  // Manejar el agregado de una nueva condición
  const addCondicion = (nombre: string) => {
    if (!nombre.trim()) return;
    const existe = data.informacion_medica.find(
      (c: Condicion) => c.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );
    if (!existe) {
      setData({
        ...data,
        informacion_medica: [
          ...data.informacion_medica,
          { nombre: nombre.trim(), descripcion: "" },
        ],
      });
    }
    setCustomCondicion(""); // Limpiar el input
  };

  // Remover condición de la lista
  const removeCondicion = (nombre: string) => {
    setData({
      ...data,
      informacion_medica: data.informacion_medica.filter(
        (c: Condicion) => c.nombre !== nombre
      ),
    });
  };

  // Actualizar la descripción de una condición específica
  const updateDescripcion = (nombre: string, descripcion: string) => {
    setData({
      ...data,
      informacion_medica: data.informacion_medica.map((c: Condicion) =>
        c.nombre === nombre ? { ...c, descripcion } : c
      ),
    });
  };

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      className="flex-1"
    >
      {/* Header: Title */}
      <View className="mb-6">
        <Text className="mb-2 text-3xl font-bold text-gray-900">Salud</Text>
        <Text className="text-gray-500">
          Agrega tus condiciones médicas para mejorar
          tus recomendaciones.
        </Text>
      </View>

      {/* Bloque 1: Sugerencias */}
      <View className="mb-6">
        <Text className="mb-3 font-semibold text-gray-700">
          Sugerencias rápidas:
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {CONDICIONES_MEDICAS_SUGERIDAS.map((sug) => {
            const isSelected = data.informacion_medica.some(
              (c: Condicion) => c.nombre === sug
            );
            return (
              <TouchableOpacity
                key={sug}
                onPress={() =>
                  isSelected ? removeCondicion(sug) : addCondicion(sug)
                }
                className={`rounded-full px-4 py-2 border ${isSelected
                  ? "border-orange-500 bg-orange-100"
                  : "border-gray-200 bg-white"
                  }`}
              >
                <Text
                  className={
                    isSelected ? "font-bold text-orange-700" : "text-gray-600"
                  }
                >
                  {sug} {isSelected && "✓"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bloque 2: Input para otra condición */}
      <View className="mb-6">
        <Text className="mb-2 font-semibold text-gray-700">Otra condición</Text>
        <View className="flex-row items-center rounded-2xl border border-gray-200 bg-white px-4 py-2">
          <TextInput
            className="flex-1 py-2 text-base"
            placeholder="Ej: Intolerancia al gluten"
            value={customCondicion}
            onChangeText={setCustomCondicion}
            onSubmitEditing={() => addCondicion(customCondicion)}
          />
          <TouchableOpacity onPress={() => addCondicion(customCondicion)}>
            <Ionicons name="add-circle" size={32} color="#f97316" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bloque 3: Detalles de las condiciones seleccionadas */}
      {data.informacion_medica.length > 0 && (
        <View className="mb-6">
          <Text className="mb-3 font-semibold text-gray-700">
            Detalles de tus condiciones:
          </Text>
          {data.informacion_medica.map((cond: Condicion) => (
            <View
              key={cond.nombre}
              className="mb-4 rounded-2xl border border-orange-100 bg-orange-50 p-4"
            >
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-orange-900">
                  {cond.nombre}
                </Text>
                <TouchableOpacity onPress={() => removeCondicion(cond.nombre)}>
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
              <TextInput
                className="rounded-xl border border-orange-200 bg-white px-4 py-3 text-gray-800"
                placeholder={`Detalles de tu ${cond.nombre.toLowerCase()}...`}
                multiline
                numberOfLines={2}
                value={cond.descripcion}
                onChangeText={(text) => updateDescripcion(cond.nombre, text)}
              />
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

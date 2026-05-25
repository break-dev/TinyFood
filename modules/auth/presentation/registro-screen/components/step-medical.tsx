import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { CONDICIONES_MEDICAS_SUGERIDAS } from "@/common/utils/variables/condiciones-medicas";
import { useAppTheme } from "@/common/logic/use-app-theme";

interface Condicion {
  nombre: string;
  descripcion: string;
}

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const StepMedical = ({ data, setData }: Props) => {
  const [customNombre, setCustomNombre] = useState("");
  const { isDark } = useAppTheme();

  // Manejar el agregado de una nueva condición
  const addCondicion = () => {
    const nombre = customNombre.trim();
    if (!nombre) return;
    const existe = data.informacion_medica.find(
      (c: Condicion) => c.nombre.toLowerCase() === nombre.toLowerCase(),
    );
    if (!existe) {
      setData({
        ...data,
        informacion_medica: [
          ...data.informacion_medica,
          { nombre: nombre, descripcion: "" },
        ],
      });
    }
    setCustomNombre("");
  };

  const addCondicionFromSug = (nombre: string) => {
    const existe = data.informacion_medica.find(
      (c: Condicion) => c.nombre.toLowerCase() === nombre.toLowerCase(),
    );
    if (!existe) {
      setData({
        ...data,
        informacion_medica: [
          ...data.informacion_medica,
          { nombre: nombre, descripcion: "" },
        ],
      });
    }
  };

  // Remover condición de la lista
  const removeCondicion = (nombre: string) => {
    setData({
      ...data,
      informacion_medica: data.informacion_medica.filter(
        (c: Condicion) => c.nombre !== nombre,
      ),
    });
  };

  // Actualizar la descripción de una condición específica sin causar re-renders
  const handleDescChange = (nombre: string, text: string) => {
    const condicion = data.informacion_medica.find(
      (c: Condicion) => c.nombre === nombre,
    );
    if (condicion) {
      condicion.descripcion = text;
    }
  };

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      className="flex-1"
    >
      {/* Header: Title */}
      <View className="mb-10">
        <Text
          className="mb-3 text-4xl text-gray-900 dark:text-white tracking-tighter"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Salud
        </Text>
        <Text
          className="text-lg text-gray-500 dark:text-neutral-400 leading-6"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          Agrega tus condiciones médicas para que podamos darte recomendaciones
          más seguras y precisas.
        </Text>
      </View>

      {/* Bloque 1: Sugerencias */}
      <View className="mb-10">
        <Text
          className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Sugerencias Rápidas
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {CONDICIONES_MEDICAS_SUGERIDAS.map((sug) => {
            const isSelected = data.informacion_medica.some(
              (c: Condicion) => c.nombre === sug,
            );
            return (
              <TouchableOpacity
                key={sug}
                onPress={() =>
                  isSelected ? removeCondicion(sug) : addCondicionFromSug(sug)
                }
                activeOpacity={0.8}
                className={`rounded-2xl px-5 py-3 border shadow-sm ${
                  isSelected
                    ? "border-orange-500 bg-orange-500 shadow-orange-500/20"
                    : "border-gray-50 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-black/5"
                }`}
              >
                <Text
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-gray-600 dark:text-neutral-300"
                  }`}
                  style={{
                    fontFamily: isSelected
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  }}
                >
                  {sug} {isSelected && " ✓"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bloque 2: Input para otra condición */}
      <View className="mb-10">
        <Text
          className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500"
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Otra Condición
        </Text>
        <View className="flex-row items-center rounded-3xl border border-gray-100 dark:border-neutral-900 bg-gray-50 dark:bg-neutral-950 px-5 py-2 shadow-sm">
          <TextInput
            className="flex-1 py-3"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 16,
              color: isDark ? "#ffffff" : "#0f172a",
              fontWeight: "normal",
            }}
            placeholder="Ej: Intolerancia al gluten"
            placeholderTextColor={isDark ? "#525252" : "#cbd5e1"}
            value={customNombre}
            onChangeText={setCustomNombre}
            onSubmitEditing={addCondicion}
          />
          <TouchableOpacity onPress={addCondicion} className="ml-2">
            <Ionicons name="add-circle" size={36} color="#f97316" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bloque 3: Detalles de las condiciones seleccionadas */}
      {data.informacion_medica.length > 0 && (
        <View className="mb-10">
          <Text
            className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500"
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            Detalles de tus condiciones
          </Text>
          {data.informacion_medica.map((cond: Condicion) => (
            <View
              key={cond.nombre}
              className="mb-5 rounded-[32px] border border-orange-50 dark:border-orange-900/30 bg-orange-50/30 dark:bg-orange-950/20 p-6 shadow-sm"
            >
              <View className="mb-4 flex-row items-center justify-between">
                <Text
                  className="text-xl text-orange-900 dark:text-orange-300"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {cond.nombre}
                </Text>
                <TouchableOpacity onPress={() => removeCondicion(cond.nombre)}>
                  <Ionicons name="close-circle" size={26} color="#ef4444" />
                </TouchableOpacity>
              </View>
              <TextInput
                className="rounded-2xl border border-orange-100 dark:border-orange-900/40 bg-white dark:bg-neutral-900 px-5 py-4"
                style={{
                  fontFamily: "Outfit_400Regular",
                  fontSize: 15,
                  color: isDark ? "#ffffff" : "#1f2937",
                  fontWeight: "normal",
                }}
                placeholder={`Más detalles sobre esto...`}
                placeholderTextColor={isDark ? "#525252" : "#cbd5e1"}
                multiline
                numberOfLines={2}
                defaultValue={cond.descripcion}
                onChangeText={(text) => handleDescChange(cond.nombre, text)}
              />
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

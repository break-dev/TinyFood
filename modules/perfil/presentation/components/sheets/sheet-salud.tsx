import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Condicion {
  nombre: string;
  descripcion: string;
}

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetSalud = ({ data, setData }: Props) => {
  const [nuevaNombre, setNuevaNombre] = useState("");
  const [nuevaDesc, setNuevaDesc] = useState("");

  const condiciones: Condicion[] = data.informacion_medica ?? [];

  const agregarCondicion = () => {
    const n = nuevaNombre.trim();
    const d = nuevaDesc.trim();
    if (!n) return;
    const existe = condiciones.some(
      (c) => c.nombre.toLowerCase() === n.toLowerCase(),
    );
    if (!existe) {
      setData({
        ...data,
        informacion_medica: [...condiciones, { nombre: n, descripcion: d }],
      });
    }
    setNuevaNombre("");
    setNuevaDesc("");
  };

  const eliminarCondicion = (nombre: string) => {
    setData({
      ...data,
      informacion_medica: condiciones.filter((c) => c.nombre !== nombre),
    });
  };

  const handleDescEdit = (nombre: string, text: string) => {
    const condicion = condiciones.find((c) => c.nombre === nombre);
    if (condicion) {
      condicion.descripcion = text;
    }
  };

  return (
    <View className="gap-4">
      <Text
        className="text-3xl text-gray-900 tracking-tighter"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        Salud
      </Text>
      <Text
        className="text-gray-400 text-sm -mt-2 mb-4"
        style={{ fontFamily: "Outfit_400Regular" }}
      >
        Agrega o edita tus condiciones médicas para un plan más seguro.
      </Text>

      {/* Condiciones existentes */}
      {condiciones.map((cond) => (
        <View
          key={cond.nombre}
          className="rounded-2xl border border-orange-100 bg-orange-50 p-4 gap-2"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-orange-900">
              {cond.nombre}
            </Text>
            <TouchableOpacity onPress={() => eliminarCondicion(cond.nombre)}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
          <TextInput
            className="rounded-xl border border-orange-200 bg-white px-4 py-3"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 14,
              color: "#1f2937",
              fontWeight: "normal",
            }}
            placeholder={`Detalles de tu ${cond.nombre.toLowerCase()}...`}
            multiline
            numberOfLines={2}
            defaultValue={cond.descripcion}
            onChangeText={(text) => handleDescEdit(cond.nombre, text)}
          />
        </View>
      ))}

      {/* Agregar nueva condición */}
      <View className="rounded-2xl border border-gray-200 bg-gray-50 p-4 gap-3">
        <Text className="font-semibold text-gray-700">Agregar condición</Text>
        <View className="flex-row items-center rounded-xl bg-white border border-gray-200 px-4 py-3">
          <Ionicons name="medkit-outline" size={18} color="#6b7280" />
          <TextInput
            className="ml-3 flex-1"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 16,
              color: "#1f2937",
              fontWeight: "normal",
            }}
            placeholder="Nombre (Ej: Diabetes)"
            value={nuevaNombre}
            onChangeText={setNuevaNombre}
          />
        </View>
        <View className="flex-row items-center rounded-xl bg-white border border-gray-200 px-4 py-3">
          <Ionicons name="document-text-outline" size={18} color="#6b7280" />
          <TextInput
            className="ml-3 flex-1"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 16,
              color: "#1f2937",
              fontWeight: "normal",
            }}
            placeholder="Descripción (Ej: Tipo 2)"
            value={nuevaDesc}
            onChangeText={setNuevaDesc}
          />
        </View>
        <TouchableOpacity
          onPress={agregarCondicion}
          className="flex-row items-center justify-center rounded-xl bg-orange-500 py-3"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="ml-1 font-bold text-white">Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

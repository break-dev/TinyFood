import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { Dumbbell, Maximize, User } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Genero } from "@/common/utils/enums/genero";
import { ModernCalendar } from "@/common/presentation/components/modern-calendar";
import { useAppTheme } from "@/common/logic/use-app-theme";

interface Props {
  data: any;
  setData: (data: any) => void;
}

export const SheetFisica = ({ data, setData }: Props) => {
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const { isDark } = useAppTheme();

  return (
    <View className="gap-6">
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
      >
        <Text
          className="text-3xl text-gray-900 dark:text-white tracking-tighter mb-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Tus Datos
        </Text>
        <Text
          className="text-gray-400 dark:text-neutral-400 text-sm mb-6"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          Ajusta tu información para mejores cálculos nutricionales
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 50 }}
      >
        <Text
          className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          ¿Cómo te llamas?
        </Text>
        <View className="flex-row items-center rounded-[24px] bg-gray-50 dark:bg-neutral-950 px-5 border border-gray-100 dark:border-neutral-900">
          <User size={20} color={isDark ? "#737373" : "#9ca3af"} strokeWidth={2} />
          <TextInput
            className="ml-4 flex-1 py-5"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 17,
              color: isDark ? "#ffffff" : "#111827",
              fontWeight: "normal",
            }}
            placeholder="Tu nombre completo"
            placeholderTextColor={isDark ? "#525252" : "#9ca3af"}
            defaultValue={data.nombre}
            onChangeText={(t) => {
              data.nombre = t;
            }}
          />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100 }}
      >
        <Text
          className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Peso Actual (kg)
        </Text>
        <View className="flex-row items-center rounded-[24px] bg-gray-50 dark:bg-neutral-950 px-5 border border-gray-100 dark:border-neutral-900">
          <Dumbbell size={20} color={isDark ? "#737373" : "#9ca3af"} strokeWidth={2} />
          <TextInput
            className="ml-4 flex-1 py-5"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 17,
              color: isDark ? "#ffffff" : "#111827",
              fontWeight: "normal",
            }}
            keyboardType="numeric"
            placeholder="Ej: 70"
            placeholderTextColor={isDark ? "#525252" : "#9ca3af"}
            defaultValue={data.peso}
            onChangeText={(t) => {
              data.peso = t;
            }}
          />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
      >
        <Text
          className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Talla Actual (cm)
        </Text>
        <View className="flex-row items-center rounded-[24px] bg-gray-50 dark:bg-neutral-950 px-5 border border-gray-100 dark:border-neutral-900">
          <Maximize size={20} color={isDark ? "#737373" : "#9ca3af"} strokeWidth={2} />
          <TextInput
            className="ml-4 flex-1 py-5"
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 17,
              color: isDark ? "#ffffff" : "#111827",
              fontWeight: "normal",
            }}
            keyboardType="numeric"
            placeholder="Ej: 175"
            placeholderTextColor={isDark ? "#525252" : "#9ca3af"}
            defaultValue={data.talla}
            onChangeText={(t) => {
              data.talla = t;
            }}
          />
        </View>
      </MotiView>

      {/* Fecha de nacimiento */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 220 }}
      >
        <Text
          className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Fecha de Nacimiento
        </Text>
        <TouchableOpacity
          onPress={() => setMostrarPicker(true)}
          className="flex-row items-center rounded-[24px] bg-gray-50 dark:bg-neutral-950 px-5 py-5 border border-gray-100 dark:border-neutral-900"
        >
          <Ionicons name="calendar-outline" size={20} color={isDark ? "#737373" : "#9ca3af"} />
          <Text
            className="ml-4 flex-1 text-[17px] text-gray-900 dark:text-neutral-100"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            {data.fecha_nacimiento || "Seleccionar fecha"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={isDark ? "#737373" : "#9ca3af"} />
        </TouchableOpacity>
      </MotiView>

      {/* Género */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 250 }}
      >
        <Text
          className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Género
        </Text>
        <View className="flex-row gap-3">
          {[Genero.Masculino, Genero.Femenino, Genero.Otro].map((g) => {
            const isSelected = data.genero === g;
            return (
              <TouchableOpacity
                key={g}
                activeOpacity={0.8}
                onPress={() => setData({ ...data, genero: g })}
                className={`flex-1 py-4 rounded-[20px] items-center justify-center border ${
                  isSelected
                    ? "bg-orange-500 border-orange-500"
                    : "bg-gray-50 dark:bg-neutral-950 border-gray-100 dark:border-neutral-900"
                }`}
              >
                <Text
                  className={`capitalize text-sm ${
                    isSelected ? "text-white" : "text-gray-500 dark:text-neutral-400"
                  }`}
                  style={{
                    fontFamily: isSelected
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  }}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </MotiView>

      {/* Modal para el picker de fecha */}
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
    </View>
  );
};

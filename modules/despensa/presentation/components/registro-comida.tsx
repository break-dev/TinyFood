import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { REQ_RegistrarComida } from "../../service/despensa.requests";
import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";

interface Props {
  onRegister: (data: REQ_RegistrarComida) => Promise<boolean>;
}

export const RegistroComida = React.forwardRef<BottomSheetModal, Props>(
  ({ onRegister }, ref) => {
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const snapPoints = useMemo(() => ["85%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      [],
    );

    const handleSave = async () => {
      if (!nombre || !cantidad) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      setIsSubmitting(true);
      try {
        const success = await onRegister({
          nombre,
          cantidad,
          descripcion: descripcion || undefined,
          fecha_vencimiento: fechaVencimiento?.toISOString(),
          estado: EstadoComida.PorConsumir,
        });

        if (success) {
          setNombre("");
          setCantidad("");
          setDescripcion("");
          setFechaVencimiento(null);
          (ref as any).current?.dismiss();
        }
      } catch (error) {
        console.error("[RegistroComida] Error al guardar:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: "#D1D5DB",
          width: 48,
          height: 5,
        }}
        backgroundStyle={{ borderRadius: 40 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <BottomSheetView className="flex-1 px-8 pt-4 pb-10">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <Text className="text-3xl font-black text-gray-900 tracking-tighter">
                  Nuevo Alimento
                </Text>
                <Text className="text-gray-400 font-medium text-sm">
                  Agrégalo a tu inventario inteligente
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => (ref as any).current?.dismiss()}
                className="bg-gray-100 h-10 w-10 items-center justify-center rounded-full"
              >
                <Ionicons name="close" size={22} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="space-y-6">
                {/* Input Nombre */}
                <View>
                  <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    ¿Qué alimento es?
                  </Text>
                  <View className="bg-gray-50 flex-row items-center px-4 rounded-3xl border border-gray-100">
                    <Ionicons
                      name="fast-food-outline"
                      size={20}
                      color="#9ca3af"
                    />
                    <TextInput
                      placeholder="Ej. Arándanos frescos"
                      placeholderTextColor="#9ca3af"
                      value={nombre}
                      onChangeText={setNombre}
                      className="flex-1 p-4 text-gray-900 font-bold text-base"
                    />
                  </View>
                </View>

                {/* Input Cantidad */}
                <View>
                  <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Cantidad o Unidad
                  </Text>
                  <View className="bg-gray-50 flex-row items-center px-4 rounded-3xl border border-gray-100">
                    <Ionicons name="scale-outline" size={20} color="#9ca3af" />
                    <TextInput
                      placeholder="Ej. 500g o 1 pack"
                      placeholderTextColor="#9ca3af"
                      value={cantidad}
                      onChangeText={setCantidad}
                      className="flex-1 p-4 text-gray-900 font-bold text-base"
                    />
                  </View>
                </View>

                {/* Input Fecha Vencimiento */}
                <View>
                  <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Vencimiento Estimado
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                    className="bg-gray-50 flex-row items-center px-4 py-4 rounded-3xl border border-gray-100"
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#9ca3af"
                    />
                    <Text
                      className={`flex-1 ml-4 font-bold text-base ${fechaVencimiento ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {fechaVencimiento
                        ? fechaVencimiento.toLocaleDateString("es-ES", {
                            dateStyle: "long",
                          })
                        : "Seleccionar fecha"}
                    </Text>
                    <View className="bg-white p-1 rounded-lg border border-gray-100">
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#9ca3af"
                      />
                    </View>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={fechaVencimiento || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      accentColor="#f97316"
                      minimumDate={new Date()}
                      onChange={(event, date) => {
                        if (Platform.OS !== "ios") setShowDatePicker(false);
                        if (date) setFechaVencimiento(date);
                      }}
                    />
                  )}
                </View>

                {/* Input Descripción */}
                <View>
                  <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Notas Adicionales
                  </Text>
                  <View className="bg-gray-50 px-4 rounded-3xl border border-gray-100">
                    <TextInput
                      placeholder="Alguna nota o instrucción especial..."
                      placeholderTextColor="#9ca3af"
                      value={descripcion}
                      onChangeText={setDescripcion}
                      multiline
                      numberOfLines={3}
                      className="p-4 text-gray-900 font-bold text-base h-28"
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Botón Guardar */}
            <Animated.View entering={FadeIn.delay(300)} className="mt-8">
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSubmitting}
                activeOpacity={0.9}
                className={`h-20 items-center justify-center rounded-[28px] shadow-2xl ${
                  isSubmitting
                    ? "bg-gray-200"
                    : "bg-orange-500 shadow-orange-500/40"
                }`}
              >
                <View className="flex-row items-center">
                  <Text className="text-white text-xl font-black mr-2">
                    {isSubmitting ? "Procesando..." : "Guardar en Despensa"}
                  </Text>
                  {!isSubmitting && (
                    <Ionicons name="arrow-forward" size={24} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  },
);

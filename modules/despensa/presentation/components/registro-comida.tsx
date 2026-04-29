import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  X,
  Plus,
  Calendar as CalendarIcon,
  Hash,
  FileText,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  REQ_ActualizarComida,
  REQ_RegistrarComida,
} from "../../service/despensa.requests";
import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";
import * as Haptics from "expo-haptics";
import { MotiView, AnimatePresence } from "moti";
import Toast from "react-native-toast-message";
import { RES_Comida } from "../../service/despensa.responses";

interface Props {
  onRegister: (data: REQ_RegistrarComida) => Promise<boolean>;
  onUpdate: (data: REQ_ActualizarComida) => Promise<boolean>;
  comidaParaEditar?: RES_Comida | null;
}

export const RegistroComida = React.forwardRef<BottomSheetModal, Props>(
  ({ onRegister, onUpdate, comidaParaEditar }, ref) => {
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
      if (comidaParaEditar) {
        setNombre(comidaParaEditar.nombre);
        setCantidad(comidaParaEditar.cantidad);
        setDescripcion(comidaParaEditar.descripcion || "");
        setFechaVencimiento(
          comidaParaEditar.fecha_vencimiento
            ? new Date(comidaParaEditar.fecha_vencimiento)
            : null,
        );
      } else {
        setNombre("");
        setCantidad("");
        setDescripcion("");
        setFechaVencimiento(null);
      }
    }, [comidaParaEditar]);

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
        Toast.show({
          type: "error",
          text1: "Campos incompletos",
          text2: "Por favor indica el nombre y la cantidad 🍎",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        let success = false;

        if (comidaParaEditar) {
          success = await onUpdate({
            id: comidaParaEditar.id,
            nombre,
            cantidad,
            descripcion: descripcion || undefined,
            fecha_vencimiento: fechaVencimiento?.toISOString(),
          });
          if (success) {
            Toast.show({
              type: "success",
              text1: "¡Actualizado!",
              text2: `${nombre} ha sido actualizado con éxito ✨`,
            });
          }
        } else {
          success = await onRegister({
            nombre,
            cantidad,
            descripcion: descripcion || undefined,
            fecha_vencimiento: fechaVencimiento?.toISOString(),
            estado: EstadoComida.PorConsumir,
          });
          if (success) {
            Toast.show({
              type: "success",
              text1: "¡Al inventario!",
              text2: `${nombre} se agregó correctamente 🚀`,
            });
          }
        }

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
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <BottomSheetView className="flex-1 px-8 pt-4 pb-10">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <RNText
                  className="text-3xl text-gray-900 tracking-tighter"
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  {comidaParaEditar ? "Editar Item" : "Nuevo Item"}
                </RNText>
                <RNText
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Outfit_400Regular" }}
                >
                  {comidaParaEditar
                    ? "Ajusta los detalles de tu alimento"
                    : "Agrégalo a tu inventario inteligente"}
                </RNText>
              </View>
              <TouchableOpacity
                onPress={() => (ref as any).current?.dismiss()}
                className="bg-gray-100 h-10 w-10 items-center justify-center rounded-full"
              >
                <X size={20} color="#1F2937" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1"
              keyboardShouldPersistTaps="handled"
            >
              <View className="space-y-6">
                {/* Input Nombre */}
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 100 }}
                >
                  <RNText
                    className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 ml-1"
                    style={{ fontFamily: "Outfit_700Bold" }}
                  >
                    ¿Qué alimento es?
                  </RNText>
                  <View className="bg-gray-50 flex-row items-center px-5 rounded-[24px] border border-gray-100">
                    <UtensilsCrossed
                      size={20}
                      color="#9ca3af"
                      strokeWidth={2}
                    />
                    <TextInput
                      placeholder="Ej. Arándanos frescos"
                      placeholderTextColor="#9ca3af"
                      value={nombre}
                      onChangeText={setNombre}
                      className="flex-1 p-5 text-gray-900 text-base"
                      style={{ fontFamily: "Outfit_700Bold" }}
                    />
                  </View>
                </MotiView>

                {/* Input Cantidad */}
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 200 }}
                >
                  <RNText
                    className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 ml-1"
                    style={{ fontFamily: "Outfit_700Bold" }}
                  >
                    Cantidad o Unidad
                  </RNText>
                  <View className="bg-gray-50 flex-row items-center px-5 rounded-[24px] border border-gray-100">
                    <Hash size={20} color="#9ca3af" strokeWidth={2} />
                    <TextInput
                      placeholder="Ej. 500g o 1 pack"
                      placeholderTextColor="#9ca3af"
                      value={cantidad}
                      onChangeText={setCantidad}
                      className="flex-1 p-5 text-gray-900 text-base"
                      style={{ fontFamily: "Outfit_700Bold" }}
                    />
                  </View>
                </MotiView>

                {/* Input Fecha Vencimiento */}
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 300 }}
                >
                  <RNText
                    className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 ml-1"
                    style={{ fontFamily: "Outfit_700Bold" }}
                  >
                    Vencimiento Estimado
                  </RNText>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                    className="bg-gray-50 flex-row items-center px-5 py-5 rounded-[24px] border border-gray-100"
                  >
                    <CalendarIcon size={20} color="#9ca3af" strokeWidth={2} />
                    <RNText
                      className={`flex-1 ml-4 text-base ${fechaVencimiento ? "text-gray-900" : "text-gray-400"}`}
                      style={{ fontFamily: "Outfit_700Bold" }}
                    >
                      {fechaVencimiento
                        ? fechaVencimiento.toLocaleDateString("es-ES", {
                            dateStyle: "long",
                          })
                        : "Seleccionar fecha"}
                    </RNText>
                    <View className="bg-white p-1 rounded-lg border border-gray-100">
                      <ChevronRight
                        size={16}
                        color="#9ca3af"
                        strokeWidth={2.5}
                      />
                    </View>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <MotiView
                      from={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 overflow-hidden rounded-[24px] bg-white border border-gray-100"
                    >
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
                    </MotiView>
                  )}
                </MotiView>

                {/* Input Descripción */}
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 400 }}
                >
                  <RNText
                    className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 ml-1"
                    style={{ fontFamily: "Outfit_700Bold" }}
                  >
                    Notas Adicionales
                  </RNText>
                  <View className="bg-gray-50 flex-row px-5 rounded-[24px] border border-gray-100">
                    <View className="mt-5 mr-3">
                      <FileText size={20} color="#9ca3af" strokeWidth={2} />
                    </View>
                    <TextInput
                      placeholder="Alguna nota o instrucción especial..."
                      placeholderTextColor="#9ca3af"
                      value={descripcion}
                      onChangeText={setDescripcion}
                      multiline
                      numberOfLines={3}
                      className="flex-1 p-5 text-gray-900 text-base h-32"
                      style={{ fontFamily: "Outfit_700Bold" }}
                      textAlignVertical="top"
                    />
                  </View>
                </MotiView>
              </View>
              <View className="h-10" />
            </BottomSheetScrollView>

            {/* Botón Guardar */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 500 }}
              className="mt-4"
            >
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSubmitting}
                activeOpacity={0.9}
                className={`h-20 items-center justify-center rounded-[32px] shadow-2xl ${
                  isSubmitting
                    ? "bg-gray-200"
                    : "bg-orange-500 shadow-orange-500/40"
                }`}
              >
                <View className="flex-row items-center">
                  <RNText
                    className="text-white text-xl mr-2"
                    style={{ fontFamily: "Outfit_900Black" }}
                  >
                    {isSubmitting
                      ? "Procesando..."
                      : comidaParaEditar
                        ? "Guardar Cambios"
                        : "Guardar en Despensa"}
                  </RNText>
                  {!isSubmitting && (
                    <Plus size={24} color="white" strokeWidth={3} />
                  )}
                </View>
              </TouchableOpacity>
            </MotiView>
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  },
);

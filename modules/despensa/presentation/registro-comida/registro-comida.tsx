import React, { useCallback, useMemo } from "react";
import {
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Image,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
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
import { ModernCalendar } from "@/common/presentation/components/modern-calendar";
import {
  REQ_ActualizarComida,
  REQ_RegistrarComida,
} from "../../service/despensa.requests";
import { MotiView } from "moti";
import { RES_Comida } from "../../service/despensa.responses";
import { useRegistroComida } from "../../logic/use-registro-comida";

interface Props {
  onRegister: (data: REQ_RegistrarComida) => Promise<boolean>;
  onUpdate: (data: REQ_ActualizarComida) => Promise<boolean>;
  comidaParaEditar?: RES_Comida | null;
}

export const RegistroComida = React.forwardRef<BottomSheetModal, Props>(
  ({ onRegister, onUpdate, comidaParaEditar }, ref) => {
    const {
      nombre,
      setNombre,
      cantidad,
      setCantidad,
      descripcion,
      setDescripcion,
      fechaVencimiento,
      setFechaVencimiento,
      showDatePicker,
      setShowDatePicker,
      isSubmitting,
      handleDismiss,
      handleSave,
    } = useRegistroComida({
      ref: ref as React.RefObject<BottomSheetModal>,
      onRegister,
      onUpdate,
      comidaParaEditar,
    });

    const snapPoints = useMemo(() => ["94%"], []);

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

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
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
          <BottomSheetView
            style={{
              flex: 1,
              paddingHorizontal: 32,
              paddingTop: 16,
              paddingBottom: 10,
            }}
          >
            {/* Imagen decorativa de fondo */}
            <Image
              source={require("@/assets/images/onboarding/tiny-cocinando.png")}
              style={{
                position: "absolute",
                bottom: 80,
                right: 16,
                width: 160,
                height: 160,
                opacity: 0.12,
              }}
              resizeMode="contain"
            />

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
                onPress={handleDismiss}
                className="bg-gray-100 h-10 w-10 items-center justify-center rounded-full"
              >
                <X size={20} color="#1F2937" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
            >
              {/* Input Nombre */}
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 100 }}
              >
                <RNText
                  className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  ¿Qué alimento es?
                </RNText>
                <View className="bg-gray-50 flex-row items-center px-5 rounded-[24px] border border-gray-100">
                  <UtensilsCrossed size={20} color="#9ca3af" strokeWidth={2} />
                  <TextInput
                    autoFocus={true}
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
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200 }}
              >
                <RNText
                  className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
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
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 300 }}
              >
                <RNText
                  className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
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
                    <ChevronRight size={16} color="#9ca3af" strokeWidth={2.5} />
                  </View>
                </TouchableOpacity>

                <Modal
                  visible={showDatePicker}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <View className="flex-1 items-center justify-center bg-black/40 px-6">
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setShowDatePicker(false)}
                      className="absolute inset-0"
                    />
                    <MotiView
                      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                      animate={{ opacity: 1, scale: 1, translateY: 0 }}
                      className="w-full"
                    >
                      <ModernCalendar
                        value={
                          fechaVencimiento
                            ? fechaVencimiento.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(dateString) => {
                          setFechaVencimiento(new Date(dateString));
                          setShowDatePicker(false);
                        }}
                      />
                    </MotiView>
                  </View>
                </Modal>
              </MotiView>

              {/* Input Descripción */}
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 400 }}
              >
                <RNText
                  className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  Notas Adicionales
                </RNText>
                <View className="bg-gray-50 flex-row px-5 pt-4 pb-2 rounded-[24px] border border-gray-100 items-start">
                  <View className="mt-1 mr-3">
                    <FileText size={20} color="#9ca3af" strokeWidth={2} />
                  </View>
                  <TextInput
                    placeholder="Alguna nota o instrucción especial..."
                    placeholderTextColor="#9ca3af"
                    value={descripcion}
                    onChangeText={setDescripcion}
                    multiline
                    numberOfLines={3}
                    className="flex-1 py-1 text-gray-900 text-base h-24"
                    style={{
                      fontFamily: "Outfit_700Bold",
                      textAlignVertical: "top",
                    }}
                  />
                </View>
              </MotiView>
            </BottomSheetScrollView>

            {/* Botón Guardar (sticky al fondo) */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 500 }}
              style={{ paddingTop: 12, paddingBottom: 10 }}
            >
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSubmitting}
                activeOpacity={0.9}
                className={`py-5 items-center justify-center rounded-[32px] shadow-2xl ${
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

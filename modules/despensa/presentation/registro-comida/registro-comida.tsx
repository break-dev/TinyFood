import React, { useCallback, useMemo, memo } from "react";
import {
  View,
  Text as Text,
  TouchableOpacity,
  Platform,
  Modal,
  Image,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
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

// Componentes internos memoizados para evitar re-renders innecesarios al escribir
const Header = memo(
  ({
    comidaParaEditar,
    onDismiss,
  }: {
    comidaParaEditar?: RES_Comida | null;
    onDismiss: () => void;
  }) => (
    <View className="flex-row items-center justify-between mb-8">
      <View>
        <Text
          className="text-3xl text-gray-900 tracking-tighter"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          {comidaParaEditar ? "Editar Item" : "Nuevo Item"}
        </Text>
        <Text
          className="text-gray-400 text-sm"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          {comidaParaEditar
            ? "Ajusta los detalles de tu alimento"
            : "Agrégalo a tu inventario inteligente"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onDismiss}
        className="bg-gray-100 h-10 w-10 items-center justify-center rounded-full"
      >
        <X size={20} color="#1F2937" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  ),
);

const Footer = memo(
  ({
    isSubmitting,
    comidaParaEditar,
    onSave,
  }: {
    isSubmitting: boolean;
    comidaParaEditar?: RES_Comida | null;
    onSave: () => void;
  }) => (
    <>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={{ paddingTop: 12, paddingBottom: 10 }}
      >
        <TouchableOpacity
          onPress={onSave}
          disabled={isSubmitting}
          activeOpacity={0.9}
          className={`py-5 items-center justify-center rounded-[32px] shadow-2xl ${
            isSubmitting ? "bg-gray-200" : "bg-orange-500 shadow-orange-500/40"
          }`}
        >
          <View className="flex-row items-center">
            <Text
              className="text-white text-xl mr-2"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {isSubmitting
                ? "Procesando..."
                : comidaParaEditar
                  ? "Guardar Cambios"
                  : "Guardar en Despensa"}
            </Text>
            {!isSubmitting && <Plus size={24} color="white" strokeWidth={3} />}
          </View>
        </TouchableOpacity>
      </MotiView>

      <Image
        source={require("@/assets/images/onboarding/tiny-cocinando.png")}
        style={{
          position: "absolute",
          bottom: -250,
          right: 60,
          width: 300,
          height: 300,
          opacity: 0.6,
        }}
        resizeMode="contain"
      />
    </>
  ),
);

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
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 32,
            paddingTop: 16,
            paddingBottom: 10,
          }}
        >
          <Header
            comidaParaEditar={comidaParaEditar}
            onDismiss={handleDismiss}
          />

          {/* Inputs */}
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
          >
            {/* Input Nombre */}
            <View>
              <Text
                className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                ¿Qué alimento es?
              </Text>
              <View className="bg-gray-50 flex-row items-center px-5 rounded-[24px] border border-gray-100">
                <UtensilsCrossed size={20} color="#9ca3af" strokeWidth={2} />
                <BottomSheetTextInput
                  autoFocus={true}
                  placeholder="Ej. Arándanos frescos"
                  placeholderTextColor="#9ca3af"
                  value={nombre}
                  onChangeText={setNombre}
                  autoCorrect={false}
                  spellCheck={false}
                  disableFullscreenUI={true}
                  underlineColorAndroid="transparent"
                  cursorColor="#f97316"
                  className="flex-1"
                  style={{
                    fontFamily: "Outfit_700Bold",
                    fontSize: 16,
                    color: "#111827",
                    fontWeight: "700",
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                  }}
                />
              </View>
            </View>

            {/* Input Cantidad */}
            <View>
              <Text
                className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Cantidad
              </Text>
              <View className="bg-gray-50 flex-row items-center px-5 rounded-[24px] border border-gray-100">
                <Hash size={20} color="#9ca3af" strokeWidth={2} />
                <BottomSheetTextInput
                  placeholder="Ej. 500g o 1 pack"
                  placeholderTextColor="#9ca3af"
                  value={cantidad}
                  onChangeText={setCantidad}
                  autoCorrect={false}
                  spellCheck={false}
                  disableFullscreenUI={true}
                  underlineColorAndroid="transparent"
                  cursorColor="#f97316"
                  className="flex-1"
                  style={{
                    fontFamily: "Outfit_700Bold",
                    fontSize: 16,
                    color: "#111827",
                    fontWeight: "700",
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                  }}
                />
              </View>
            </View>

            {/* Input Fecha Vencimiento */}
            <View>
              <Text
                className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Vencimiento Estimado
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
                className="bg-gray-50 flex-row items-center px-5 py-5 rounded-[24px] border border-gray-100"
              >
                <CalendarIcon size={20} color="#9ca3af" strokeWidth={2} />
                <Text
                  className={`flex-1 ml-4 text-base ${fechaVencimiento ? "text-gray-900" : "text-gray-400"}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {fechaVencimiento
                    ? fechaVencimiento.toLocaleDateString("es-ES", {
                        dateStyle: "long",
                      })
                    : "Seleccionar fecha"}
                </Text>
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
            </View>

            {/* Input Descripción */}
            <View>
              <Text
                className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Notas Adicionales
              </Text>
              <View className="bg-gray-50 flex-row px-5 pt-4 pb-2 rounded-[24px] border border-gray-100 items-start">
                <View className="mt-2 mr-3">
                  <FileText size={20} color="#9ca3af" strokeWidth={2} />
                </View>
                <BottomSheetTextInput
                  placeholder="Alguna nota o instrucción especial..."
                  placeholderTextColor="#9ca3af"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline
                  numberOfLines={3}
                  autoCorrect={false}
                  spellCheck={false}
                  disableFullscreenUI={true}
                  underlineColorAndroid="transparent"
                  cursorColor="#f97316"
                  className="flex-1"
                  style={{
                    fontFamily: "Outfit_700Bold",
                    fontSize: 16,
                    color: "#111827",
                    fontWeight: "700",
                    textAlignVertical: "top",
                    minHeight: 80,
                  }}
                />
              </View>
            </View>
          </BottomSheetScrollView>

          <Footer
            isSubmitting={isSubmitting}
            comidaParaEditar={comidaParaEditar}
            onSave={handleSave}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

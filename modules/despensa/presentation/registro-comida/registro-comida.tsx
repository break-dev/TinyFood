import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { ModalSheet } from "@/common/presentation/components/modal-sheet";
import { useAppTheme } from "@/common/logic/use-app-theme";
import {
  X,
  Plus,
  Calendar as CalendarIcon,
  Hash,
  FileText,
  ChevronRight,
  UtensilsCrossed,
  Camera,
  ImageIcon,
  Sparkles,
} from "lucide-react-native";
import { ModernCalendar } from "@/common/presentation/components/modern-calendar";
import {
  REQ_ActualizarComida,
  REQ_RegistrarComida,
} from "../../service/despensa.requests";
import { MotiView } from "moti";
import { RES_Comida } from "../../service/despensa.responses";
import { useRegistroComida } from "../../logic/use-registro-comida";
import * as Haptics from "expo-haptics";

interface Props {
  onRegister: (data: REQ_RegistrarComida) => Promise<boolean>;
  onUpdate: (data: REQ_ActualizarComida) => Promise<boolean>;
  comidaParaEditar?: RES_Comida | null;
  onDismiss?: () => void;
}

// ── Header ────────────────────────────────────────────────────────────────────
 
const Header = memo(
  ({
    comidaParaEditar,
    onDismiss,
  }: {
    comidaParaEditar?: RES_Comida | null;
    onDismiss: () => void;
  }) => {
    const { isDark, iconColor } = useAppTheme();
    return (
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text
            className="text-3xl text-gray-900 dark:text-white tracking-tighter"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            {comidaParaEditar ? "Editar Item" : "Nuevo Item"}
          </Text>
          <Text
            className="text-gray-400 dark:text-neutral-400 text-sm"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            {comidaParaEditar
              ? "Ajusta los detalles de tu alimento"
              : "Agrégalo a tu inventario inteligente"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onDismiss}
          className="bg-gray-100 dark:bg-neutral-800 h-10 w-10 items-center justify-center rounded-full"
        >
          <X size={20} color={iconColor} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    );
  }
);
 
// ── Botón IA ──────────────────────────────────────────────────────────────────
 
const BotonIA = memo(
  ({
    analizando,
    mostrarOpciones,
    imagenAnalizada,
    onToggle,
    onCamara,
    onGaleria,
    soloLectura,
  }: {
    analizando: boolean;
    mostrarOpciones: boolean;
    imagenAnalizada: {
      categoria: string;
      confianza: "alta" | "media" | "baja";
      dias_duracion_estimados: number;
    } | null;
    onToggle: () => void;
    onCamara: () => void;
    onGaleria: () => void;
    soloLectura: boolean;
  }) => {
    const { isDark, iconColor, subIconColor } = useAppTheme();
    return (
      <MotiView
        from={{ opacity: 0, translateY: -6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350 }}
        className="mb-5"
      >
        {/* Botón principal */}
        <TouchableOpacity
          onPress={onToggle}
          disabled={soloLectura}
          activeOpacity={0.75}
          className="bg-gray-50 dark:bg-neutral-950 flex-row items-center px-5 py-4 rounded-[24px] border border-gray-100 dark:border-neutral-900"
        >
          {analizando ? (
            <>
              <ActivityIndicator size="small" color="#f97316" />
              <Text
                className="flex-1 ml-4 text-base text-orange-500"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Analizando imagen...
              </Text>
            </>
          ) : (
            <>
              <View className="h-9 w-9 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/20">
                <Sparkles size={18} color="#f97316" strokeWidth={2} />
              </View>
              <View className="flex-1 ml-4">
                <Text
                  className="text-base text-gray-800 dark:text-neutral-100"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {imagenAnalizada ? "Cambiar foto" : "Identificar con foto"}
                </Text>
                {imagenAnalizada ? (
                  <Text
                    className="text-xs text-orange-400 dark:text-orange-300"
                    style={{ fontFamily: "Outfit_400Regular" }}
                  >
                    {imagenAnalizada.categoria} · confianza{" "}
                    {imagenAnalizada.confianza} · vence en{" "}
                    {imagenAnalizada.dias_duracion_estimados}d
                  </Text>
                ) : (
                  <Text
                    className="text-xs text-gray-400 dark:text-neutral-500"
                    style={{ fontFamily: "Outfit_400Regular" }}
                  >
                    La IA rellena los campos automáticamente
                  </Text>
                )}
              </View>
              <View className="bg-white dark:bg-neutral-900 p-1 rounded-lg border border-gray-100 dark:border-neutral-800">
                <ChevronRight size={16} color={subIconColor} strokeWidth={2.5} />
              </View>
            </>
          )}
        </TouchableOpacity>
 
        {/* Opciones desplegables: Cámara / Galería */}
        {mostrarOpciones && !soloLectura && (
          <MotiView
            from={{ opacity: 0, translateY: -8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="flex-row gap-3 mt-2"
          >
            <TouchableOpacity
              onPress={onCamara}
              activeOpacity={0.8}
              className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-[20px] bg-gray-100 dark:bg-neutral-850"
            >
              <Camera size={18} color={iconColor} strokeWidth={2} />
              <Text
                className="text-gray-700 dark:text-neutral-200 text-sm"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Cámara
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onGaleria}
              activeOpacity={0.8}
              className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-[20px] bg-gray-100 dark:bg-neutral-850"
            >
              <ImageIcon size={18} color={iconColor} strokeWidth={2} />
              <Text
                className="text-gray-700 dark:text-neutral-200 text-sm"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Galería
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </MotiView>
    );
  }
);
 
// ── Footer ────────────────────────────────────────────────────────────────────
 
const Footer = memo(
  ({
    isSubmitting,
    comidaParaEditar,
    onSave,
  }: {
    isSubmitting: boolean;
    comidaParaEditar?: RES_Comida | null;
    onSave: () => void;
  }) => {
    const { isDark } = useAppTheme();
    return (
      <>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: -250,
            right: 60,
            width: 300,
            height: 300,
          }}
        >
          <Image
            source={require("@/assets/images/onboarding/tiny-cocinando.png")}
            style={{ width: "100%", height: "100%", opacity: isDark ? 0.3 : 0.6 }}
            resizeMode="contain"
          />
        </View>
 
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
              isSubmitting ? "bg-gray-800" : "bg-orange-500 shadow-orange-500/40"
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
      </>
    );
  }
);

// ── Componente principal ──────────────────────────────────────────────────────
 
export const RegistroComida = React.forwardRef<BottomSheetModal, Props>(
  ({ onRegister, onUpdate, comidaParaEditar, onDismiss }, ref) => {
    const { isDark, iconColor, subIconColor } = useAppTheme();
    const {
      fechaVencimiento,
      setFechaVencimiento,
      showDatePicker,
      setShowDatePicker,
      isSubmitting,
      handleDismiss,
      handleSave,
      nombreInputRef,
      cantidadInputRef,
      descripcionInputRef,
      handleNombreChange,
      handleCantidadChange,
      handleDescripcionChange,
      // IA
      analizando,
      mostrarOpcionesFoto,
      setMostrarOpcionesFoto,
      imagenAnalizada,
      handleAnalizarCamara,
      handleAnalizarGaleria,
    } = useRegistroComida({
      ref: ref as React.RefObject<BottomSheetModal>,
      onRegister,
      onUpdate,
      comidaParaEditar,
    });
 
    const soloLectura = isSubmitting || analizando;
 
    return (
      <ModalSheet ref={ref} scrollable={false} onDismiss={onDismiss}>
        <View style={{ flex: 1, paddingHorizontal: 8, paddingTop: 0, paddingBottom: 0 }}>
          <Header comidaParaEditar={comidaParaEditar} onDismiss={handleDismiss} />
 
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
          >
            {/* ── Botón IA (solo en modo creación) ─────────────────────── */}
            {!comidaParaEditar && (
              <BotonIA
                analizando={analizando}
                mostrarOpciones={mostrarOpcionesFoto}
                imagenAnalizada={imagenAnalizada}
                soloLectura={soloLectura}
                onToggle={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMostrarOpcionesFoto((v) => !v);
                }}
                onCamara={handleAnalizarCamara}
                onGaleria={handleAnalizarGaleria}
              />
            )}
 
            {/* ── Nombre ───────────────────────────────────────────────── */}
            <View>
              <Text
                className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                ¿Qué alimento es?
              </Text>
              <View className="bg-gray-50 dark:bg-neutral-950 flex-row items-center px-5 rounded-[24px] border border-gray-100 dark:border-neutral-900">
                <UtensilsCrossed size={20} color={subIconColor} strokeWidth={2} />
                <TextInput
                  ref={nombreInputRef}
                  autoFocus={!comidaParaEditar}
                  placeholder="Ej. Arándanos frescos"
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  defaultValue={comidaParaEditar?.nombre || ""}
                  onChangeText={handleNombreChange}
                  autoCorrect={false}
                  spellCheck={false}
                  disableFullscreenUI={true}
                  underlineColorAndroid="transparent"
                  cursorColor="#f97316"
                  editable={!soloLectura}
                  className="flex-1"
                  style={{
                    fontFamily: "Outfit_400Regular",
                    fontSize: 16,
                    color: isDark ? "#ffffff" : "#111827",
                    fontWeight: "normal",
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                  }}
                />
              </View>
            </View>
 
            {/* ── Cantidad ─────────────────────────────────────────────── */}
            <View>
              <Text
                className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Cantidad
              </Text>
              <View className="bg-gray-50 dark:bg-neutral-950 flex-row items-center px-5 rounded-[24px] border border-gray-100 dark:border-neutral-900">
                <Hash size={20} color={subIconColor} strokeWidth={2} />
                <TextInput
                  ref={cantidadInputRef}
                  placeholder="Ej. 500g o 1 pack"
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  defaultValue={comidaParaEditar?.cantidad || ""}
                  onChangeText={handleCantidadChange}
                  autoCorrect={false}
                  spellCheck={false}
                  disableFullscreenUI={true}
                  underlineColorAndroid="transparent"
                  cursorColor="#f97316"
                  editable={!soloLectura}
                  className="flex-1"
                  style={{
                    fontFamily: "Outfit_400Regular",
                    fontSize: 16,
                    color: isDark ? "#ffffff" : "#111827",
                    fontWeight: "normal",
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                  }}
                />
              </View>
            </View>
 
            {/* ── Fecha de vencimiento ──────────────────────────────────── */}
            <View>
              <Text
                className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Vencimiento Estimado
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
                disabled={soloLectura}
                className="bg-gray-50 dark:bg-neutral-950 flex-row items-center px-5 py-5 rounded-[24px] border border-gray-100 dark:border-neutral-900"
              >
                <CalendarIcon size={20} color={subIconColor} strokeWidth={2} />
                <Text
                  className={`flex-1 ml-4 text-base ${fechaVencimiento ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-neutral-500" : "text-gray-400")}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {fechaVencimiento
                    ? fechaVencimiento.toLocaleDateString("es-ES", {
                        dateStyle: "long",
                      })
                    : "Seleccionar fecha"}
                </Text>
                <View className="bg-white dark:bg-neutral-900 p-1 rounded-lg border border-gray-100 dark:border-neutral-800">
                  <ChevronRight size={16} color={subIconColor} strokeWidth={2.5} />
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
 
            {/* ── Descripción ───────────────────────────────────────────── */}
            <View>
              <Text
                className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Notas Adicionales
              </Text>
              <View className="bg-gray-50 dark:bg-neutral-950 flex-row px-5 pt-4 pb-2 rounded-[24px] border border-gray-100 dark:border-neutral-900 items-start">
                <View className="mt-2 mr-3">
                  <FileText size={20} color={subIconColor} strokeWidth={2} />
                </View>
                <TextInput
                  ref={descripcionInputRef}
                  placeholder="Alguna nota o instrucción especial..."
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  defaultValue={comidaParaEditar?.descripcion || ""}
                  onChangeText={handleDescripcionChange}
                  multiline
                  numberOfLines={3}
                  autoCorrect={false}
                  spellCheck={false}
                  disableFullscreenUI={true}
                  underlineColorAndroid="transparent"
                  cursorColor="#f97316"
                  editable={!soloLectura}
                  className="flex-1"
                  style={{
                    fontFamily: "Outfit_400Regular",
                    fontSize: 16,
                    color: isDark ? "#ffffff" : "#111827",
                    fontWeight: "normal",
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
        </View>
      </ModalSheet>
    );
  },
);
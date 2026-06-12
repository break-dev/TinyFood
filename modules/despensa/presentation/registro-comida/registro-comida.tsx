import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
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
import { HeaderRegistroComida } from "./components/header";
import { FooterRegistroComida } from "./components/footer";

interface Props {
  onRegister: (data: REQ_RegistrarComida[]) => Promise<boolean>;
  onUpdate: (data: REQ_ActualizarComida) => Promise<boolean>;
  comidaParaEditar?: RES_Comida | null;
  onDismiss?: () => void;
}

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
      handleAnalizarCamara,
      handleAnalizarGaleria,
      // Multi-Items
      alimentos,
      activeIndex,
      switchAlimento,
      agregarAlimento,
      eliminarAlimento,
    } = useRegistroComida({
      ref: ref as React.RefObject<BottomSheetModal>,
      onRegister,
      onUpdate,
      comidaParaEditar,
    });

    const soloLectura = isSubmitting || analizando;

    return (
      <ModalSheet ref={ref} scrollable={false} onDismiss={onDismiss}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 8,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <HeaderRegistroComida
            comidaParaEditar={comidaParaEditar}
            onDismiss={handleDismiss}
          />

          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
          >
            {/* Indicador Social Stories*/}
            <MotiView
              animate={{
                opacity: alimentos.length > 1 ? 1 : 0,
                height: alimentos.length > 1 ? 12 : 0,
                marginBottom: alimentos.length > 1 ? 4 : 0,
              }}
              transition={{ type: "timing", duration: 250 }}
              style={{ overflow: "hidden" }}
            >
              <View className="flex-row gap-1.5 px-1">
                {alimentos.map((_, i) => (
                  <View
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i === activeIndex
                        ? "bg-orange-500"
                        : "bg-gray-200 dark:bg-neutral-800"
                    }`}
                  />
                ))}
              </View>
            </MotiView>

            {/* Badges Horizontales de Selección*/}
            {!comidaParaEditar && (
              <View className="mb-1">
                <GestureScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
                >
                  {alimentos.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => switchAlimento(i)}
                      activeOpacity={0.8}
                      className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full border ${
                        i === activeIndex
                          ? "bg-orange-500 border-orange-500"
                          : "bg-gray-50 dark:bg-neutral-900 border-gray-150 dark:border-neutral-800"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          i === activeIndex
                            ? "text-white"
                            : "text-gray-700 dark:text-neutral-300"
                        }`}
                        style={{ fontFamily: "Outfit_700Bold" }}
                      >
                        {item.nombre.trim() || `Alimento #${i + 1}`}
                      </Text>
                      {alimentos.length > 1 && (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            eliminarAlimento(i);
                          }}
                          className={`p-0.5 rounded-full ${
                            i === activeIndex
                              ? "bg-orange-600"
                              : "bg-gray-250 dark:bg-neutral-800"
                          }`}
                        >
                          <X
                            size={10}
                            color={i === activeIndex ? "white" : iconColor}
                          />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={agregarAlimento}
                    activeOpacity={0.8}
                    className="flex-row items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-dashed bg-transparent border-orange-500/40"
                  >
                    <Plus size={12} color="#f97316" strokeWidth={2.5} />
                    <Text
                      className="text-orange-500 dark:text-orange-400 text-xs"
                      style={{ fontFamily: "Outfit_700Bold" }}
                    >
                      Añadir otro
                    </Text>
                  </TouchableOpacity>
                </GestureScrollView>
              </View>
            )}

            {/* Nombre*/}
            <View>
              <Text
                className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                ¿Qué alimento es?
              </Text>
              <View className="bg-gray-50 dark:bg-neutral-950 flex-row items-center px-5 rounded-[24px] border border-gray-150 dark:border-neutral-800">
                <UtensilsCrossed
                  size={20}
                  color={subIconColor}
                  strokeWidth={2}
                />
                <TextInput
                  ref={nombreInputRef}
                  placeholder="Ej. Arándanos frescos"
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  defaultValue={alimentos[activeIndex]?.nombre || ""}
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

            {/* Cantidad*/}
            <View>
              <Text
                className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Cantidad
              </Text>
              <View className="bg-gray-50 dark:bg-neutral-950 flex-row items-center px-5 rounded-[24px] border border-gray-150 dark:border-neutral-800">
                <Hash size={20} color={subIconColor} strokeWidth={2} />
                <TextInput
                  ref={cantidadInputRef}
                  placeholder="Ej. 500g o 1 pack"
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  defaultValue={alimentos[activeIndex]?.cantidad || ""}
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

            {/* Fecha de vencimiento*/}
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
                className="bg-gray-50 dark:bg-neutral-950 flex-row items-center px-5 py-5 rounded-[24px] border border-gray-150 dark:border-neutral-800"
              >
                <CalendarIcon size={20} color={subIconColor} strokeWidth={2} />
                <Text
                  className={`flex-1 ml-4 text-base ${fechaVencimiento ? (isDark ? "text-white" : "text-gray-900") : isDark ? "text-neutral-500" : "text-gray-400"}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {fechaVencimiento
                    ? fechaVencimiento.toLocaleDateString("es-ES", {
                        dateStyle: "long",
                      })
                    : "Seleccionar fecha"}
                </Text>
                <View className="bg-white dark:bg-neutral-900 p-1 rounded-lg border border-gray-150 dark:border-neutral-800">
                  <ChevronRight
                    size={16}
                    color={subIconColor}
                    strokeWidth={2.5}
                  />
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
                        const [year, month, day] = dateString.split("-").map(Number);
                        setFechaVencimiento(new Date(year, month - 1, day));
                        setShowDatePicker(false);
                      }}
                    />
                  </MotiView>
                </View>
              </Modal>
            </View>

            {/* Descripción*/}
            <View>
              <Text
                className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 ml-1"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Notas Adicionales
              </Text>
              <View className="bg-gray-50 dark:bg-neutral-950 flex-row px-5 pt-4 pb-2 rounded-[24px] border border-gray-150 dark:border-neutral-800 items-start">
                <View className="mt-2 mr-3">
                  <FileText size={20} color={subIconColor} strokeWidth={2} />
                </View>
                <TextInput
                  ref={descripcionInputRef}
                  placeholder="Alguna nota o instrucción especial..."
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  defaultValue={alimentos[activeIndex]?.descripcion || ""}
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

          {mostrarOpcionesFoto && (
            <Pressable
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 40,
              }}
              onPress={() => setMostrarOpcionesFoto(false)}
            />
          )}

          <FooterRegistroComida
            isSubmitting={isSubmitting}
            comidaParaEditar={comidaParaEditar}
            onSave={handleSave}
            onToggleUpload={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setMostrarOpcionesFoto((v) => !v);
            }}
            mostrarOpcionesFoto={mostrarOpcionesFoto}
            onCamara={handleAnalizarCamara}
            onGaleria={handleAnalizarGaleria}
            analizando={analizando}
            iconColor={iconColor}
          />

          {/* Ilustración decorativa */}
          {/* <View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: -80,
              left: 24,
              right: 24,
              aspectRatio: 1,
              zIndex: -1,
            }}
          >
            <Image
              source={require("@/assets/images/onboarding/tiny-cocinando.png")}
              style={{
                width: "100%",
                height: "100%",
                opacity: isDark ? 0.2 : 0.4,
              }}
              resizeMode="contain"
            />
          </View> */}
        </View>
      </ModalSheet>
    );
  },
);

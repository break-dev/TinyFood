import React, { forwardRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Check, X, Utensils, Edit3 } from "lucide-react-native";
import { RES_Comida } from "../../service/despensa.responses";
import { useAppTheme } from "@/common/logic/use-app-theme";
import { ModalSheet } from "@/common/presentation/components/modal-sheet";

interface Props {
  comida: RES_Comida | null;
  onConfirm: (id: number, cantidadRestante: string) => Promise<boolean>;
  onDismiss: () => void;
}

export const ModalConsumir = forwardRef<BottomSheetModal, Props>(
  ({ comida, onConfirm, onDismiss }, ref) => {
    const { isDark, themeText } = useAppTheme();
    const [cantidad, setCantidad] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);

    useEffect(() => {
      if (comida) {
        setCantidad(comida.cantidad || "");
        setModoEdicion(false);
      }
    }, [comida]);

    const handleConsumirTodo = async () => {
      if (!comida) return;
      setIsLoading(true);
      const success = await onConfirm(comida.id, "0");
      setIsLoading(false);
      if (success) {
        (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
      }
    };

    const handleConfirmParcial = async () => {
      if (!comida) return;
      setIsLoading(true);
      const success = await onConfirm(comida.id, cantidad.trim());
      setIsLoading(false);
      if (success) {
        (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
      }
    };

    return (
      <ModalSheet ref={ref} onDismiss={onDismiss} snapPoints={["55%"]} scrollable={false}>
        <View className="flex-1 justify-between pb-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 mr-2">
              <Text
                className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-0.5"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Registrar Consumo
              </Text>
              <Text
                className={`text-2xl ${themeText}`}
                style={{ fontFamily: "Outfit_900Black" }}
                numberOfLines={1}
              >
                {comida?.nombre || "Alimento"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => (ref as any).current?.dismiss()}
              className="p-2 rounded-full bg-gray-100 dark:bg-neutral-900"
            >
              <X size={20} color={isDark ? "#a1a1aa" : "#6b7280"} />
            </TouchableOpacity>
          </View>

          {/* Opciones principales */}
          {!modoEdicion ? (
            <View className="gap-3.5 my-auto">
              {/* Botón Consumir Todo */}
              <TouchableOpacity
                onPress={handleConsumirTodo}
                disabled={isLoading}
                activeOpacity={0.8}
                className="p-4 bg-orange-500 rounded-3xl flex-row items-center justify-between shadow-md shadow-orange-500/20"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-12 w-12 rounded-2xl bg-white/20 items-center justify-center">
                    <Utensils size={24} color="white" strokeWidth={2.5} />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-white text-base font-bold"
                      style={{ fontFamily: "Outfit_700Bold" }}
                    >
                      ¡Me lo acabé todo!
                    </Text>
                    <Text
                      className="text-white/80 text-xs mt-0.5"
                      style={{ fontFamily: "Outfit_400Regular" }}
                    >
                      Marcar como consumido por completo
                    </Text>
                  </View>
                </View>
                {isLoading && <ActivityIndicator color="white" />}
              </TouchableOpacity>

              {/* Botón Consumí solo una parte */}
              <TouchableOpacity
                onPress={() => setModoEdicion(true)}
                disabled={isLoading}
                activeOpacity={0.8}
                className={`p-4 rounded-3xl border flex-row items-center justify-between ${
                  isDark ? "bg-neutral-900 border-neutral-800" : "bg-gray-50 border-gray-200"
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className={`h-12 w-12 rounded-2xl items-center justify-center ${
                    isDark ? "bg-neutral-800" : "bg-gray-200/70"
                  }`}>
                    <Edit3 size={22} color={isDark ? "#f97316" : "#ea580c"} strokeWidth={2.5} />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-base font-bold ${themeText}`}
                      style={{ fontFamily: "Outfit_700Bold" }}
                    >
                      Consumí solo una parte
                    </Text>
                    <Text
                      className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
                      style={{ fontFamily: "Outfit_400Regular" }}
                    >
                      Actualizar cantidad (Actual: {comida?.cantidad})
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            /* Modo Edición Parcial */
            <View className="my-auto">
              <Text
                className="text-gray-500 dark:text-neutral-400 mb-2 font-bold text-sm"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Indica la nueva cantidad restante:
              </Text>
              <TextInput
                value={cantidad}
                onChangeText={setCantidad}
                placeholder="Ej. 2 unidades, 150g, 1/2 taza"
                placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                autoFocus
                className={`p-4 rounded-2xl border text-base mb-4 ${
                  isDark
                    ? "bg-neutral-900 border-neutral-800 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
                style={{ fontFamily: "Outfit_400Regular" }}
              />

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setModoEdicion(false)}
                  className={`flex-1 py-3.5 rounded-2xl items-center justify-center border ${
                    isDark ? "border-neutral-800" : "border-gray-200"
                  }`}
                >
                  <Text className={`text-base font-bold ${themeText}`} style={{ fontFamily: "Outfit_700Bold" }}>
                    Volver
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirmParcial}
                  disabled={isLoading || !cantidad.trim()}
                  className={`flex-1 py-3.5 rounded-2xl flex-row justify-center items-center gap-2 ${
                    isLoading || !cantidad.trim()
                      ? "bg-gray-300 dark:bg-neutral-800"
                      : "bg-orange-500"
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Check size={18} color="white" strokeWidth={2.5} />
                      <Text className="text-white text-base font-bold" style={{ fontFamily: "Outfit_700Bold" }}>
                        Guardar
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ModalSheet>
    );
  }
);


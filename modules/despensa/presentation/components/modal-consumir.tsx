import React, { forwardRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Check, X } from "lucide-react-native";
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

    useEffect(() => {
      if (comida) {
        setCantidad(comida.cantidad || "");
      }
    }, [comida]);

    const handleConfirm = async () => {
      if (!comida) return;
      setIsLoading(true);
      const success = await onConfirm(comida.id, cantidad);
      setIsLoading(false);
      if (success) {
        (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
      }
    };

    return (
      <ModalSheet ref={ref} onDismiss={onDismiss} snapPoints={["45%"]}>
        <BottomSheetView
          className={`flex-1 px-6 pt-4 ${isDark ? "bg-neutral-950" : "bg-white"}`}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text
              className={`text-2xl ${themeText}`}
              style={{ fontFamily: "Outfit_900Black" }}
            >
              Consumir Alimento
            </Text>
            <TouchableOpacity
              onPress={() => (ref as any).current?.dismiss()}
              className="p-2 rounded-full bg-gray-100 dark:bg-neutral-900"
            >
              <X size={20} color={isDark ? "#a1a1aa" : "#6b7280"} />
            </TouchableOpacity>
          </View>

          {comida && (
            <View className="mb-6">
              <Text
                className="text-gray-500 dark:text-neutral-400 mb-2"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Cantidad restante de <Text className={themeText}>{comida.nombre}</Text>:
              </Text>
              <TextInput
                defaultValue={cantidad}
                onChangeText={setCantidad}
                placeholder="Ej. 0, 1 unidad, 200g"
                placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                className={`p-4 rounded-2xl border text-lg ${
                  isDark
                    ? "bg-neutral-900 border-neutral-800 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
                style={{ fontFamily: "Outfit_400Regular" }}
              />
              <Text
                className="text-xs text-gray-400 dark:text-neutral-500 mt-2"
                style={{ fontFamily: "Outfit_400Regular" }}
              >
                Si pones "0", se marcará como consumido.
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isLoading || !cantidad.trim()}
            className={`py-4 rounded-2xl flex-row justify-center items-center gap-2 ${
              isLoading || !cantidad.trim()
                ? "bg-gray-300 dark:bg-neutral-800"
                : "bg-orange-500"
            }`}
          >
            <Check size={20} color="white" strokeWidth={2.5} />
            <Text
              className="text-white text-lg"
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Confirmar Consumo
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </ModalSheet>
    );
  }
);

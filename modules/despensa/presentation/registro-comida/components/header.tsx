import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppTheme } from "@/common/logic/use-app-theme";
import { X } from "lucide-react-native";
import { RES_Comida } from "@/modules/despensa/service/despensa.responses";

export const HeaderRegistroComida = memo(
  ({
    comidaParaEditar,
    onDismiss,
  }: {
    comidaParaEditar?: RES_Comida | null;
    onDismiss: () => void;
  }) => {
    const { iconColor } = useAppTheme();
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
  },
);

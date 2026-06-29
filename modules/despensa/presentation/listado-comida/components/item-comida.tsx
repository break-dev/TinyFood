import React from "react";
import { View, Text as Text, TouchableOpacity } from "react-native";
import { Trash2, Calendar, Utensils } from "lucide-react-native";
import { MotiView } from "moti";
import { RES_Comida } from "../../../service/despensa.responses";
import { getEstadoVencimiento } from "./get-estado-vencimiento";
import { useConfigStore } from "@/modules/configuracion/store/config.store";

interface Props {
  item: RES_Comida;
  index: number;
  onDelete: (id: number) => void;
  onEdit: (comida: RES_Comida) => void;
  onConsumir: (comida: RES_Comida) => void;
}

export const ItemComida = ({ item, index, onDelete, onEdit, onConsumir }: Props) => {
  const avisoDias = useConfigStore((state) => state.avisoDiasCaducidad);
  const estado_vencimiento = getEstadoVencimiento(item.fecha_vencimiento, avisoDias);
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onEdit(item)}>
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 400, delay: index * 50 }}
        className="mb-4 bg-white dark:bg-neutral-900 p-5 rounded-[32px] shadow-sm border border-gray-100 dark:border-neutral-800 flex-row items-center"
      >
        <View
          className={`h-16 w-16 rounded-[24px] items-center justify-center ${estado_vencimiento.color}10`}
        >
          <estado_vencimiento.Icon
            size={28}
            color={
              estado_vencimiento.color === "bg-emerald-500"
                ? "#10b981"
                : estado_vencimiento.color === "bg-orange-500"
                  ? "#f97316"
                  : estado_vencimiento.color === "bg-red-500"
                    ? "#ef4444"
                    : "#3b82f6"
            }
            strokeWidth={2}
          />
        </View>

        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-gray-900 dark:text-white text-lg flex-1"
              style={{ fontFamily: "Outfit_700Bold" }}
              numberOfLines={1}
            >
              {item.nombre}
            </Text>
            <View
              className={`${estado_vencimiento.color} px-3 py-1 rounded-full`}
            >
              <Text
                className="text-white text-[10px] uppercase tracking-widest"
                style={{ fontFamily: "Outfit_900Black" }}
              >
                {estado_vencimiento.label}
              </Text>
            </View>
          </View>

          <Text
            className="text-gray-400 dark:text-neutral-500 text-sm mt-0.5"
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            {item.cantidad}
          </Text>

          {item.fecha_vencimiento && (
            <View className="flex-row items-center mt-3 bg-gray-50 dark:bg-neutral-950 self-start px-3 py-1.5 rounded-xl border border-gray-100 dark:border-neutral-900">
              <Calendar size={12} color="#9ca3af" strokeWidth={2.5} />
              <Text
                className="text-[10px] text-gray-500 dark:text-neutral-400 ml-1.5"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                {(() => {
                  const dateStr = typeof item.fecha_vencimiento === "string" ? item.fecha_vencimiento : item.fecha_vencimiento.toISOString();
                  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
                  if (!match) return "";
                  const year = parseInt(match[1], 10);
                  const month = parseInt(match[2], 10) - 1;
                  const day = parseInt(match[3], 10);
                  const localDate = new Date(year, month, day);
                  return localDate.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  });
                })()}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onConsumir(item)}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100/10 dark:border-orange-900/30 ml-2"
        >
          <Utensils size={20} color="#f97316" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100/10 dark:border-red-900/30 ml-2"
        >
          <Trash2 size={20} color="#ef4444" strokeWidth={2} />
        </TouchableOpacity>
      </MotiView>
    </TouchableOpacity>
  );
};

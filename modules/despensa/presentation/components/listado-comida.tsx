import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { RES_Comida } from "../../service/despensa.responses";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, Layout } from "react-native-reanimated";

interface Props {
  comidas: RES_Comida[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onEdit: (comida: RES_Comida) => void;
}

export const ListadoComida = ({
  comidas,
  isRefreshing,
  onRefresh,
  onDelete,
  onEdit,
}: Props) => {
  if (comidas.length === 0 && !isRefreshing) {
    return (
      <Animated.View
        entering={FadeInRight}
        className="flex-1 items-center justify-center py-20"
      >
        <View className="h-32 w-32 bg-orange-50 rounded-full items-center justify-center mb-6 shadow-sm">
          <Ionicons name="basket-outline" size={48} color="#f97316" />
        </View>
        <Text className="text-gray-900 font-black text-xl text-center px-10">
          Tu despensa está lista para ser llenada
        </Text>
        <Text className="text-gray-400 font-medium text-center mt-2 px-12">
          Agrega tus alimentos para que TinyFood pueda ayudarte a evitar el
          desperdicio.
        </Text>
      </Animated.View>
    );
  }

  const getStatusInfo = (fechaVencimiento?: string) => {
    if (!fechaVencimiento)
      return { color: "bg-blue-500", label: "Sin fecha", icon: "help-circle" };
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { color: "bg-red-500", label: "Vencido", icon: "alert-circle" };
    if (diffDays <= 3)
      return {
        color: "bg-orange-500",
        label: `Vence en ${diffDays}d`,
        icon: "warning",
      };
    return {
      color: "bg-emerald-500",
      label: "Fresco",
      icon: "checkmark-circle",
    };
  };

  const renderItem = ({ item, index }: { item: RES_Comida; index: number }) => {
    const status = getStatusInfo(item.fecha_vencimiento);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onEdit(item)}
      >
        <Animated.View
          entering={FadeInRight.delay(index * 50).duration(400)}
          layout={Layout.springify()}
          className="mb-4 bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 flex-row items-center"
        >
          <View
            className={`h-14 w-14 rounded-2xl items-center justify-center ${status.color}10`}
          >
            <Ionicons
              name={status.icon as any}
              size={28}
              color={
                status.color
                  .replace("bg-", "")
                  .replace("emerald", "green")
                  .split("-")[0] === "emerald"
                  ? "#10b981"
                  : status.color.replace("bg-", "").split("-")[0]
              }
            />
          </View>

          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <Text
                className="text-gray-900 font-extrabold text-lg flex-1"
                numberOfLines={1}
              >
                {item.nombre}
              </Text>
              <View className={`${status.color} px-3 py-1 rounded-full`}>
                <Text className="text-white text-[10px] font-black uppercase tracking-widest">
                  {status.label}
                </Text>
              </View>
            </View>

            <Text className="text-gray-400 font-bold text-sm mt-0.5">
              {item.cantidad}
            </Text>

            {item.fecha_vencimiento && (
              <View className="flex-row items-center mt-2 bg-gray-50 self-start px-2 py-1 rounded-lg">
                <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
                <Text className="text-[10px] font-bold text-gray-500 ml-1">
                  {new Date(item.fecha_vencimiento).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 ml-2"
          >
            <Ionicons name="trash-outline" size={18} color="#6b7280" />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={comidas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#f97316"
          colors={["#f97316"]}
        />
      }
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
    />
  );
};

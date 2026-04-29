import React from "react";
import {
  View,
  Text as RNText,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RES_Comida } from "../../service/despensa.responses";
import {
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  PackageSearch,
} from "lucide-react-native";
import { MotiView } from "moti";

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
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 items-center justify-center py-20 mb-48"
      >
        <View className="h-32 w-32 bg-orange-50 rounded-full items-center justify-center mb-6 shadow-sm">
          <PackageSearch size={48} color="#f97316" strokeWidth={1.5} />
        </View>
        <RNText
          className="text-gray-900 text-2xl text-center px-10"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Tu despensa está lista para ser llenada
        </RNText>
        <RNText
          className="text-gray-400 text-center mt-2 px-12 text-base"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          Agrega tus alimentos para que TinyFood pueda ayudarte a evitar el
          desperdicio.
        </RNText>
      </MotiView>
    );
  }

  const getStatusInfo = (fechaVencimiento?: string) => {
    if (!fechaVencimiento)
      return { color: "bg-blue-500", label: "Sin fecha", Icon: HelpCircle };
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { color: "bg-red-500", label: "Vencido", Icon: AlertTriangle };
    if (diffDays <= 3)
      return {
        color: "bg-orange-500",
        label: `Vence en ${diffDays}d`,
        Icon: AlertTriangle,
      };
    return {
      color: "bg-emerald-500",
      label: "Fresco",
      Icon: CheckCircle2,
    };
  };

  const renderItem = ({ item, index }: { item: RES_Comida; index: number }) => {
    const status = getStatusInfo(item.fecha_vencimiento);

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => onEdit(item)}>
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 400, delay: index * 50 }}
          className="mb-4 bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex-row items-center"
        >
          <View
            className={`h-16 w-16 rounded-[24px] items-center justify-center ${status.color}10`}
          >
            <status.Icon
              size={28}
              color={
                status.color === "bg-emerald-500"
                  ? "#10b981"
                  : status.color === "bg-orange-500"
                    ? "#f97316"
                    : status.color === "bg-red-500"
                      ? "#ef4444"
                      : "#3b82f6"
              }
              strokeWidth={2}
            />
          </View>

          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <RNText
                className="text-gray-900 text-lg flex-1"
                style={{ fontFamily: "Outfit_700Bold" }}
                numberOfLines={1}
              >
                {item.nombre}
              </RNText>
              <View className={`${status.color} px-3 py-1 rounded-full`}>
                <RNText
                  className="text-white text-[10px] uppercase tracking-widest"
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  {status.label}
                </RNText>
              </View>
            </View>

            <RNText
              className="text-gray-400 text-sm mt-0.5"
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              {item.cantidad}
            </RNText>

            {item.fecha_vencimiento && (
              <View className="flex-row items-center mt-3 bg-gray-50 self-start px-3 py-1.5 rounded-xl border border-gray-100">
                <Calendar size={12} color="#9ca3af" strokeWidth={2.5} />
                <RNText
                  className="text-[10px] text-gray-500 ml-1.5"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {new Date(item.fecha_vencimiento).toLocaleDateString(
                    "es-ES",
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )}
                </RNText>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50 ml-2"
          >
            <Trash2 size={20} color="#ef4444" strokeWidth={2} />
          </TouchableOpacity>
        </MotiView>
      </TouchableOpacity>
    );
  };

  return (
    <FlashList<RES_Comida>
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

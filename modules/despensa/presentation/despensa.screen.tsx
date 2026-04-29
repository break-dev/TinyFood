import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogout } from "@/common/logic/use-logout";
import { useAuthState } from "@/common/logic/use-auth-state";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDespensa } from "../logic/use-despensa";
import { ListadoComida } from "./components/listado-comida";
import { RegistroComida } from "./components/registro-comida";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RES_Comida } from "../service/despensa.responses";

export const DespensaScreen = () => {
  const { isLoading: isLoggingOut, handleLogout } = useLogout();
  const { usuario } = useAuthState();
  const {
    comidas,
    isLoading,
    isRefreshing,
    onRefresh,
    registrarComida,
    actualizarComida,
    eliminarComida,
  } = useDespensa();

  const [comidaParaEditar, setComidaParaEditar] =
    React.useState<RES_Comida | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openModal = () => {
    setComidaParaEditar(null);
    bottomSheetModalRef.current?.present();
  };

  const handleEdit = (comida: RES_Comida) => {
    setComidaParaEditar(comida);
    bottomSheetModalRef.current?.present();
  };

  const proximosVencimientos = comidas.filter((c) => {
    if (!c.fecha_vencimiento) return false;
    const diff = new Date(c.fecha_vencimiento).getTime() - new Date().getTime();
    return diff > 0 && diff <= 1000 * 60 * 60 * 24 * 3; // 3 días
  }).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-6">
        <View>
          <Text className="text-gray-400 font-medium">Hola de nuevo,</Text>
          <Text className="text-3xl font-black text-gray-900">
            {usuario?.nombre?.split(" ")[0] || "Explorador"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100"
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6">
        {/* Stats Summary */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          className="flex-row gap-4 mb-8"
        >
          <View className="flex-1 rounded-[24px] bg-white p-5 shadow-sm border border-gray-50">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
              <Ionicons name="cube-outline" size={20} color="#3b82f6" />
            </View>
            <Text className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-tighter">
              Total items
            </Text>
            <Text className="text-2xl font-black text-gray-900">
              {comidas.length}
            </Text>
          </View>

          <View className="flex-1 rounded-[24px] bg-white p-5 shadow-sm border border-gray-100">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-orange-50">
              <Ionicons name="alert-circle-outline" size={20} color="#f97316" />
            </View>
            <Text className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-tighter">
              Por vencer
            </Text>
            <Text className="text-2xl font-black text-gray-900">
              {proximosVencimientos}
            </Text>
          </View>
        </Animated.View>

        {/* List Label */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-black text-gray-900">
            Tu Inventario
          </Text>
          <TouchableOpacity onPress={() => onRefresh()}>
            <Ionicons name="refresh" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading && !isRefreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : (
          <ListadoComida
            comidas={comidas}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
            onDelete={eliminarComida}
            onEdit={handleEdit}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <View className="absolute bottom-10 right-6">
        <TouchableOpacity
          onPress={openModal}
          activeOpacity={0.8}
          className="h-16 w-16 items-center justify-center rounded-full bg-gray-900 shadow-2xl shadow-black"
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Registry Modal */}
      <RegistroComida
        ref={bottomSheetModalRef}
        onRegister={registrarComida}
        onUpdate={actualizarComida}
        comidaParaEditar={comidaParaEditar}
      />

      {/* Logout Overlay */}
      {isLoggingOut && (
        <View className="absolute inset-0 bg-white/80 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}
    </SafeAreaView>
  );
};

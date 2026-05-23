import React, { useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLogout } from "@/common/logic/use-logout";
import { useAuthState } from "@/common/logic/use-auth-state";
import {
  Package,
  LogOut,
  RefreshCcw,
  Plus,
  AlertCircle,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useDespensa } from "../logic/_use-despensa";
import { ListadoComida } from "./listado-comida/listado-comida";
import { RegistroComida } from "./registro-comida/registro-comida";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RES_Comida } from "../service/despensa.responses";
import { ModalEstandar } from "@/common/presentation/components/modal-estandar";

export const DespensaScreen = () => {
  const insets = useSafeAreaInsets();
  const { isLoading: isLoggingOut, handleLogout: logoutFn } = useLogout();
  const { usuario } = useAuthState();
  const {
    comidas,
    totalItems,
    proximosVencimientos,
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
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const openModal = () => {
    setComidaParaEditar(null);
    bottomSheetModalRef.current?.present();
  };

  const handleEdit = (comida: RES_Comida) => {
    setComidaParaEditar(comida);
    bottomSheetModalRef.current?.present();
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f9fafb", paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-6">
        <View>
          <Text
            className="text-gray-400 font-medium"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            Hola de nuevo,
          </Text>
          <Text
            className="text-3xl text-gray-900"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            {usuario?.nombre?.split(" ")[0] || "Explorador"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100"
        >
          <LogOut size={22} color="#ef4444" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6">
        {/* Stats Summary */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 200 }}
          className="flex-row gap-4 mb-8"
        >
          <View className="flex-1 rounded-[32px] bg-white p-6 shadow-sm border border-gray-50">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
              <Package size={22} color="#3b82f6" strokeWidth={2.5} />
            </View>
            <Text
              className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Total items
            </Text>
            <Text
              className="text-3xl text-gray-900"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {totalItems}
            </Text>
          </View>

          <View className="flex-1 rounded-[32px] bg-white p-6 shadow-sm border border-gray-100">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
              <AlertCircle size={22} color="#f97316" strokeWidth={2.5} />
            </View>
            <Text
              className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Por vencer
            </Text>
            <Text
              className="text-3xl text-gray-900"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {proximosVencimientos}
            </Text>
          </View>
        </MotiView>

        {/* List Label */}
        <View className="flex-row items-center justify-between mb-4 px-1">
          <Text
            className="text-2xl text-gray-900"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            Tu Inventario
          </Text>
          <TouchableOpacity onPress={() => onRefresh()} className="p-2">
            <RefreshCcw size={18} color="#9ca3af" strokeWidth={2.5} />
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

      {/* Botón flotante para añadir comida */}
      <View className="absolute bottom-12 right-6">
        <TouchableOpacity
          onPress={openModal}
          activeOpacity={0.8}
          className="h-16 w-16 items-center justify-center rounded-full bg-gray-900 shadow-2xl shadow-black/40"
        >
          <Plus size={32} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Registry Modal */}
      <RegistroComida
        ref={bottomSheetModalRef}
        onRegister={registrarComida}
        onUpdate={actualizarComida}
        comidaParaEditar={comidaParaEditar}
        onDismiss={() => setComidaParaEditar(null)}
      />

      {/* Logout Confirmation Modal */}
      <ModalEstandar
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logoutFn}
        title="Cerrar Sesión"
        description="¿Seguro que deseas salir de TinyFood? Tu inventario te extrañará 🍎"
        confirmText="Sí, salir"
        cancelText="Cancelar"
        type="danger"
        icon={LogOut}
      />
    </View>
  );
};

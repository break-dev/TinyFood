import React, { useRef, useCallback, useState, useMemo } from "react";
import { View, Text as RNText, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LogOut,
  User,
  Dumbbell,
  Maximize,
  Calendar,
  Activity,
  Heart,
  Utensils,
  Check,
  RefreshCw,
} from "lucide-react-native";
import { MotiView, MotiScrollView } from "moti";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useAuthState } from "@/common/logic/use-auth-state";
import { useLogout } from "@/common/logic/use-logout";
import { useUpdatePerfil } from "../logic/use-update-perfil";
import { ProfileCard } from "./components/profile-card";
import { SheetFisica } from "./components/sheets/sheet-fisica";
import { SheetActividad } from "./components/sheets/sheet-actividad";
import { SheetAlimentacion } from "./components/sheets/sheet-alimentacion";
import { SheetSalud } from "./components/sheets/sheet-salud";
import { SheetFecha } from "./components/sheets/sheet-fecha";
import { ElegantModal } from "@/common/presentation/components/elegant-modal";

type SheetType = "fisica" | "actividad" | "alimentacion" | "salud" | "fecha";

const activityLabels: Record<number, string> = {
  1: "Sedentario",
  2: "Ligero",
  3: "Moderado",
  4: "Activo",
  5: "Muy Activo",
};

export const PerfilScreen = () => {
  const insets = useSafeAreaInsets();
  const { usuario } = useAuthState();
  const { handleLogout: logoutFn } = useLogout();
  const { formData, setFormData, handleSave, isLoading, resetForm } =
    useUpdatePerfil();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const openSheet = (type: SheetType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    resetForm();

    setActiveSheet(type);
    bottomSheetRef.current?.present();
  };

  const handleGuardar = async () => {
    const success = await handleSave();
    if (success) {
      bottomSheetRef.current?.dismiss();
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const snapPoints =
    activeSheet === "actividad"
      ? ["70%"]
      : activeSheet === "fecha"
        ? ["75%"]
        : ["60%", "90%"];

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}>
      {/* ── Custom Header Bar ── */}
      <View className="flex-row items-center justify-between px-6 py-6 border-b border-gray-50">
        <RNText
          className="text-2xl text-gray-900"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Mi Perfil
        </RNText>
        <TouchableOpacity
          onPress={handleLogout}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50 border border-red-100"
        >
          <LogOut size={22} color="#ef4444" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <MotiScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        {/* ── Header Info ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="items-center mt-4 mb-10"
        >
          <View className="w-32 h-32 rounded-[48px] overflow-hidden border-4 border-orange-500/10 shadow-2xl mb-5">
            {usuario?.url_foto ? (
              <Image
                source={{ uri: usuario.url_foto }}
                className="w-full h-full"
              />
            ) : (
              <View className="flex-1 bg-orange-100 items-center justify-center">
                <User size={64} color="#f97316" strokeWidth={1.5} />
              </View>
            )}
          </View>
          <RNText
            className="text-3xl text-gray-900"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            {usuario?.nombre}
          </RNText>
          <RNText
            className="text-gray-400 text-sm mt-1"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            Toca una sección para editar tu perfil
          </RNText>
        </MotiView>

        {/* ── Grid peso / talla ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          className="flex-row gap-4 mb-6"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openSheet("fisica")}
            className="flex-1 bg-blue-50 rounded-[32px] p-6 border border-blue-100 shadow-sm"
          >
            <Dumbbell size={24} color="#3b82f6" strokeWidth={2.5} />
            <RNText
              className="text-3xl text-gray-900 mt-4"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {usuario?.peso ?? "--"}
            </RNText>
            <RNText
              className="text-blue-500 text-[10px] uppercase tracking-widest font-black"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              kg · Peso
            </RNText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openSheet("fisica")}
            className="flex-1 bg-emerald-50 rounded-[32px] p-6 border border-emerald-100 shadow-sm"
          >
            <Maximize size={24} color="#10b981" strokeWidth={2.5} />
            <RNText
              className="text-3xl text-gray-900 mt-4"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {usuario?.talla ?? "--"}
            </RNText>
            <RNText
              className="text-emerald-500 text-[10px] uppercase tracking-widest font-black"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              cm · Talla
            </RNText>
          </TouchableOpacity>
        </MotiView>

        {/* ── Cards ── */}
        <View className="space-y-4">
          <ProfileCard
            Icon={Calendar}
            title="Fecha de nacimiento"
            subtitle={
              usuario?.fecha_nacimiento
                ? usuario.fecha_nacimiento.toString().split("T")[0]
                : "Sin datos"
            }
            onPress={() => openSheet("fecha")}
            delay={400}
          />
          <ProfileCard
            Icon={Activity}
            title="Actividad física"
            subtitle={
              activityLabels[usuario?.nivel_actividad ?? 0] ?? "Sin datos"
            }
            onPress={() => openSheet("actividad")}
            delay={500}
          />
          <ProfileCard
            Icon={Utensils}
            title="Alergias y preferencias"
            subtitle={
              [
                ...(usuario?.alimentos_prohibidos ?? []),
                ...(usuario?.preferencias ?? []),
              ].join(" · ") || "Sin restricciones"
            }
            onPress={() => openSheet("alimentacion")}
            delay={600}
          />
          <ProfileCard
            Icon={Heart}
            title="Salud"
            subtitle={
              Array.isArray(usuario?.informacion_medica) &&
              usuario.informacion_medica.length > 0
                ? usuario.informacion_medica
                    .map((item: any) =>
                      typeof item === "object" ? item.nombre : item,
                    )
                    .join(", ")
                : "Sin datos"
            }
            onPress={() => openSheet("salud")}
            delay={700}
          />
        </View>
        <View className="h-20" />
      </MotiScrollView>

      {/* ── Bottom Sheet ── */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={!isLoading} // Protege contra cierre mientras guarda
        onChange={(index) => {
          if (index === -1) {
            setActiveSheet(null);
          }
        }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <BottomSheetScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled" // <-- Importante para los TextInputs
          >
            {/* Contenido según sheet activo */}
            {activeSheet === "fecha" && (
              <SheetFecha data={formData} setData={setFormData} />
            )}
            {activeSheet === "fisica" && (
              <SheetFisica data={formData} setData={setFormData} />
            )}
            {activeSheet === "actividad" && (
              <SheetActividad data={formData} setData={setFormData} />
            )}
            {activeSheet === "alimentacion" && (
              <SheetAlimentacion data={formData} setData={setFormData} />
            )}
            {activeSheet === "salud" && (
              <SheetSalud data={formData} setData={setFormData} />
            )}

            {/* Botón guardar */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8"
            >
              <TouchableOpacity
                onPress={handleGuardar}
                disabled={isLoading}
                activeOpacity={0.9}
                className={`h-20 flex-row items-center justify-center rounded-[32px] shadow-2xl ${
                  isLoading
                    ? "bg-gray-200"
                    : "bg-orange-500 shadow-orange-500/40"
                }`}
              >
                {isLoading ? (
                  <RefreshCw
                    size={24}
                    color="#9ca3af"
                    className="animate-spin"
                  />
                ) : (
                  <Check size={24} color="white" strokeWidth={3} />
                )}
                <RNText
                  className="ml-3 text-xl text-white"
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </RNText>
              </TouchableOpacity>
            </MotiView>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
      {/* Logout Confirmation Modal */}
      <ElegantModal
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

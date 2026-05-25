import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text as Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
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
  Camera,
  Target,
} from "lucide-react-native";
import { MotiView, MotiScrollView } from "moti";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ModalSheet } from "@/common/presentation/components/modal-sheet";
import { Easing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useAuthState } from "@/common/logic/use-auth-state";
import { useLogout } from "@/common/logic/use-logout";
import { useUpdatePerfil } from "../logic/use-update-perfil";
import { PerfilService } from "../service/perfil.service";
import { ProfileCard } from "./components/profile-card";
import { SheetFisica } from "./components/sheets/sheet-fisica";
import { SheetActividad } from "./components/sheets/sheet-actividad";
import { SheetAlimentacion } from "./components/sheets/sheet-alimentacion";
import { SheetSalud } from "./components/sheets/sheet-salud";
import { ModalEstandar } from "@/common/presentation/components/modal-estandar";

import { useAppTheme } from "@/common/logic/use-app-theme";

type SheetType = "fisica" | "actividad" | "alimentacion" | "salud";

const activityLabels: Record<number, string> = {
  1: "Sedentario",
  2: "Ligero",
  3: "Moderado",
  4: "Activo",
  5: "Muy Activo",
};

export const PerfilScreen = () => {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { usuario, token, setUser } = useAuthState();
  const { handleLogout: logoutFn } = useLogout();
  const { formData, setFormData, handleSave, isLoading, resetForm } =
    useUpdatePerfil();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (!asset.base64) {
          throw new Error("No se devolvieron datos en base64 de la imagen");
        }

        setIsUploadingPhoto(true);
        const res = await PerfilService.actualizarPerfil({
          foto_b64: asset.base64,
        });

        if (res.success && res.data) {
          await setUser(res.data as any, token);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch (error) {
      console.error("[PerfilScreen] Error al seleccionar/subir imagen:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0a0a0a" : "white", paddingTop: insets.top }}>
      {/* ── Custom Header Bar ── */}
      <View className="flex-row items-center justify-between px-6 py-6 border-b border-gray-50 dark:border-neutral-900">
        <Text
          className="text-2xl text-gray-900 dark:text-white"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Mi Perfil
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
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
          {/* Avatar Editable */}
          <View className="relative mb-5">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handlePickImage}
              disabled={isUploadingPhoto}
              className="w-32 h-32 rounded-[48px] overflow-hidden border-4 border-orange-500/10 shadow-2xl items-center justify-center bg-gray-50 dark:bg-neutral-850"
            >
              {isUploadingPhoto ? (
                <ActivityIndicator size="large" color="#f97316" />
              ) : usuario?.url_foto ? (
                <Image
                  source={{ uri: usuario.url_foto }}
                  className="w-full h-full"
                />
              ) : (
                <View className="flex-1 bg-orange-100 items-center justify-center w-full h-full">
                  <User size={64} color="#f97316" strokeWidth={1.5} />
                </View>
              )}
            </TouchableOpacity>
            {!isUploadingPhoto && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePickImage}
                className="absolute bottom-0 right-0 h-10 w-10 bg-orange-500 rounded-full items-center justify-center border-2 border-white shadow-lg"
              >
                <Camera size={18} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center">
            <Text
              className="text-3xl text-gray-900 dark:text-white"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {usuario?.nombre}
            </Text>
            <TouchableOpacity
              onPress={() => openSheet("fisica")}
              className="ml-3 bg-orange-100 dark:bg-orange-950/30 p-2 rounded-xl"
            >
              <User size={16} color="#f97316" strokeWidth={3} />
            </TouchableOpacity>
          </View>
          <Text
            className="text-gray-400 dark:text-neutral-400 text-sm mt-1 capitalize"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            {usuario?.genero || "Género no especificado"}
          </Text>
          <Text
            className="text-gray-400 dark:text-neutral-500 text-[11px] mt-2"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            Toca una sección para editar tu perfil
          </Text>
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
            className="flex-1 bg-blue-50 dark:bg-blue-950/15 rounded-[32px] p-6 border border-blue-100 dark:border-blue-900/30 shadow-sm"
          >
            <Dumbbell size={24} color="#3b82f6" strokeWidth={2.5} />
            <Text
              className="text-3xl text-gray-900 dark:text-white mt-4"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {usuario?.peso ?? "--"}
            </Text>
            <Text
              className="text-blue-500 dark:text-blue-400 text-xs uppercase tracking-widest font-black"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              kg · Peso
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openSheet("fisica")}
            className="flex-1 bg-emerald-50 dark:bg-emerald-950/15 rounded-[32px] p-6 border border-emerald-100 dark:border-emerald-900/30 shadow-sm"
          >
            <Maximize size={24} color="#10b981" strokeWidth={2.5} />
            <Text
              className="text-3xl text-gray-900 dark:text-white mt-4"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              {usuario?.talla ?? "--"}
            </Text>
            <Text
              className="text-emerald-500 dark:text-emerald-400 text-xs uppercase tracking-widest font-black"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              cm · Talla
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* ── Cards ── */}
        <View className="space-y-4">
          <ProfileCard
            Icon={Target}
            title="Objetivo físico"
            subtitle={
              usuario?.objetivo_fisico
                ? usuario.objetivo_fisico.charAt(0).toUpperCase() +
                  usuario.objetivo_fisico.slice(1)
                : "Sin datos"
            }
            onPress={() => openSheet("actividad")}
            delay={450}
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
      <ModalSheet
        ref={bottomSheetRef}
        snapPoints={["94%"]}
        enablePanDownToClose={!isLoading}
        onDismiss={() => setActiveSheet(null)}
      >
        {/* Contenido según sheet activo */}
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
                ? isDark
                  ? "bg-neutral-800"
                  : "bg-gray-200"
                : "bg-orange-500 shadow-orange-500/40"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#f97316" />
            ) : (
              <>
                <Check size={24} color="white" strokeWidth={3} />
                <Text
                  className="ml-3 text-xl text-white"
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  Guardar Cambios
                </Text>
              </>
            )}
          </TouchableOpacity>
        </MotiView>
      </ModalSheet>
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

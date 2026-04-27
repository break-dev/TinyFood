import React, { useRef, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useAuthState } from "@/common/logic/use-auth-state";
import { useUpdatePerfil } from "../logic/use-update-perfil";
import { ProfileCard } from "./components/profile-card";
import { SheetFisica } from "./components/sheets/sheet-fisica";
import { SheetActividad } from "./components/sheets/sheet-actividad";
import { SheetAlimentacion } from "./components/sheets/sheet-alimentacion";
import { SheetSalud } from "./components/sheets/sheet-salud";
import { SheetFecha } from "./components/sheets/sheet-fecha";

type SheetType = "fisica" | "actividad" | "alimentacion" | "salud" | "fecha";

const activityLabels: Record<number, string> = {
  1: "Sedentario",
  2: "Ligero",
  3: "Moderado",
  4: "Activo",
  5: "Muy Activo",
};

export const PerfilScreen = () => {
  const { usuario, logout } = useAuthState();
  const { formData, setFormData, handleSave, isLoading, resetForm } =
    useUpdatePerfil();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);

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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      >
        {/* ── Header ── */}
        <View className="items-center mt-4 mb-8">
          <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500 mb-4">
            {usuario?.url_foto ? (
              <Image
                source={{ uri: usuario.url_foto }}
                className="w-full h-full"
              />
            ) : (
              <View className="flex-1 bg-orange-100 items-center justify-center">
                <Ionicons name="person" size={50} color="#f97316" />
              </View>
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {usuario?.nombre}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            Toca una sección para editar
          </Text>
        </View>
        {/* ── Grid peso / talla ── */}
        <View className="flex-row gap-3 mb-3">
          <TouchableOpacity
            onPress={() => openSheet("fisica")}
            className="flex-1 bg-orange-50 rounded-2xl p-4 border border-orange-100"
          >
            <Ionicons name="fitness-outline" size={22} color="#f97316" />
            <Text className="text-2xl font-bold text-gray-900 mt-2">
              {usuario?.peso ?? "--"}
            </Text>
            <Text className="text-gray-400 text-xs">kg · Peso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openSheet("fisica")}
            className="flex-1 bg-orange-50 rounded-2xl p-4 border border-orange-100"
          >
            <Ionicons name="resize-outline" size={22} color="#f97316" />
            <Text className="text-2xl font-bold text-gray-900 mt-2">
              {usuario?.talla ?? "--"}
            </Text>
            <Text className="text-gray-400 text-xs">cm · Talla</Text>
          </TouchableOpacity>
        </View>
        {/* ── Cards ── */}
        <ProfileCard
          icon="calendar-outline"
          title="Fecha de nacimiento"
          subtitle={
            usuario?.fecha_nacimiento
              ? usuario.fecha_nacimiento.toString().split("T")[0]
              : "Sin datos"
          }
          onPress={() => openSheet("fecha")}
        />
        <ProfileCard
          icon="walk-outline"
          title="Actividad física"
          subtitle={
            activityLabels[usuario?.nivel_actividad ?? 0] ?? "Sin datos"
          }
          onPress={() => openSheet("actividad")}
        />
        <ProfileCard
          icon="nutrition-outline"
          title="Alergias y preferencias"
          subtitle={[
            ...(usuario?.alimentos_prohibidos ?? []),
            ...(usuario?.preferencias ?? []),
          ].join(" · ")}
          onPress={() => openSheet("alimentacion")}
        />
        <ProfileCard
          icon="medkit-outline"
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
        />
        {/* ── Cerrar sesión ── */}
        <TouchableOpacity
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            logout();
          }}
          className="mt-6 bg-red-50 flex-row items-center justify-center p-4 rounded-2xl border border-red-100"
        >
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text className="ml-2 text-red-500 font-bold text-lg">
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
            <TouchableOpacity
              onPress={handleGuardar}
              disabled={isLoading}
              className={`mt-6 flex-row items-center justify-center rounded-2xl py-5 ${
                isLoading ? "bg-orange-300" : "bg-orange-500"
              }`}
            >
              <Ionicons
                name={isLoading ? "sync" : "checkmark"}
                size={20}
                color="white"
              />
              <Text className="ml-2 text-lg font-bold text-white">
                {isLoading ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

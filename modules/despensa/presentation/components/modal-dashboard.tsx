import React, { forwardRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { X, TrendingUp, Droplets, CheckCircle2, Package, Plus, ChefHat, Smartphone } from "lucide-react-native";
import { RES_Comida } from "../../service/despensa.responses";
import { useAppTheme } from "@/common/logic/use-app-theme";
import { ModalSheet } from "@/common/presentation/components/modal-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConfigStore } from "@/modules/configuracion/store/config.store";
import { router } from "expo-router";
import { updateAllWidgets } from "@/background-tasks";
import * as Haptics from "expo-haptics";

interface Props {
  comidas: RES_Comida[];
  onDismiss: () => void;
}

export const ModalDashboard = forwardRef<BottomSheetModal, Props>(
  ({ comidas, onDismiss }, ref) => {
    const { isDark, themeText } = useAppTheme();
    const dailyGoal = useConfigStore((state) => state.metaAguaDiaria);
    const [waterToday, setWaterToday] = useState(0);
    const [isAddingWater, setIsAddingWater] = useState(false);

    useEffect(() => {
      const loadWater = async () => {
        try {
          const todayStr = new Date().toISOString().split("T")[0];
          const waterStr = await AsyncStorage.getItem("tinyfood_water_today");
          if (waterStr) {
            const parsed = JSON.parse(waterStr);
            if (parsed.date === todayStr) {
              setWaterToday(parsed.amount || 0);
            } else {
              setWaterToday(0);
            }
          } else {
            setWaterToday(0);
          }
        } catch (e) {}
      };
      loadWater();
      const interval = setInterval(loadWater, 1500);
      return () => clearInterval(interval);
    }, [comidas, dailyGoal]);

    const handleAddWater = async () => {
      try {
        setIsAddingWater(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const todayStr = new Date().toISOString().split("T")[0];
        const newAmount = waterToday + 250;
        await AsyncStorage.setItem(
          "tinyfood_water_today",
          JSON.stringify({ date: todayStr, amount: newAmount })
        );
        setWaterToday(newAmount);
        await updateAllWidgets();
      } catch (e) {
        console.error("Error agregando agua desde dashboard:", e);
      } finally {
        setIsAddingWater(false);
      }
    };

    const handleOpenRecetas = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      (ref as any).current?.dismiss();
      router.push("/recetas");
    };

    const consumidos = comidas.filter((c) => c.estado === "Consumido").length;
    const activos = comidas.filter((c) => c.estado !== "Consumido").length;
    const aguaPorcentaje = Math.min(Math.round((waterToday / (dailyGoal || 2000)) * 100), 100);

    return (
      <ModalSheet ref={ref} onDismiss={onDismiss} snapPoints={["70%"]} scrollable={false}>
        <View className="flex-1 justify-between pb-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row items-center gap-2.5">
              <View className="h-10 w-10 rounded-2xl bg-orange-500/10 items-center justify-center">
                <TrendingUp size={22} color="#f97316" strokeWidth={2.5} />
              </View>
              <View>
                <Text
                  className="text-xs text-orange-500 font-bold uppercase tracking-widest"
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  Estadísticas & Hábitos
                </Text>
                <Text
                  className={`text-2xl ${themeText}`}
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  Tu Dashboard
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => (ref as any).current?.dismiss()}
              className="p-2 rounded-full bg-gray-100 dark:bg-neutral-900"
            >
              <X size={20} color={isDark ? "#a1a1aa" : "#6b7280"} />
            </TouchableOpacity>
          </View>

          {/* Tarjetas de Métricas */}
          <View className="gap-3.5 my-auto">
            {/* Cero Desperdicio */}
            <View className={`p-4 rounded-3xl border ${
              isDark ? "bg-emerald-950/20 border-emerald-900/40" : "bg-emerald-50 border-emerald-100"
            }`}>
              <View className="flex-row items-center justify-between mb-1.5">
                <View className="flex-row items-center gap-2">
                  <CheckCircle2 size={18} color="#10b981" strokeWidth={2.5} />
                  <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider" style={{ fontFamily: "Outfit_700Bold" }}>
                    Impacto Cero Desperdicio
                  </Text>
                </View>
                <View className="px-2.5 py-0.5 rounded-full bg-emerald-500">
                  <Text className="text-white text-[10px] font-black" style={{ fontFamily: "Outfit_900Black" }}>
                    {consumidos} salvados
                  </Text>
                </View>
              </View>
              <Text className={`text-xl font-black ${themeText}`} style={{ fontFamily: "Outfit_900Black" }}>
                ¡Has consumido {consumidos} alimentos!
              </Text>
              <Text className="text-gray-400 dark:text-neutral-400 text-xs mt-0.5" style={{ fontFamily: "Outfit_400Regular" }}>
                Cada alimento consumido a tiempo evita el desperdicio de comida.
              </Text>
            </View>

            {/* Hidratación Hoy Interactivas */}
            <View className={`p-4 rounded-3xl border ${
              isDark ? "bg-sky-950/20 border-sky-900/40" : "bg-sky-50 border-sky-100"
            }`}>
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-2">
                  <Droplets size={18} color="#0284c7" strokeWidth={2.5} />
                  <Text className="text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider" style={{ fontFamily: "Outfit_700Bold" }}>
                    Hidratación de Hoy
                  </Text>
                </View>
                {/* Botón rápido beber +250ml */}
                <TouchableOpacity
                  onPress={handleAddWater}
                  disabled={isAddingWater}
                  className="flex-row items-center gap-1 bg-sky-500 px-3 py-1.5 rounded-full shadow-sm"
                >
                  {isAddingWater ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Plus size={12} color="white" strokeWidth={3} />
                      <Text className="text-white text-xs font-bold" style={{ fontFamily: "Outfit_700Bold" }}>
                        +250ml
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View className="flex-row items-baseline justify-between mt-1">
                <Text className={`text-xl font-black ${themeText}`} style={{ fontFamily: "Outfit_900Black" }}>
                  {waterToday} <Text className="text-xs font-normal text-gray-400">/ {dailyGoal} ml</Text>
                </Text>
                <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold" style={{ fontFamily: "Outfit_700Bold" }}>
                  {aguaPorcentaje}% completado
                </Text>
              </View>

              {/* Barra de progreso */}
              <View className="h-2.5 rounded-full bg-sky-200/60 dark:bg-sky-950 overflow-hidden my-2">
                <View
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${aguaPorcentaje}%` }}
                />
              </View>

              <View className="flex-row items-center gap-1.5 mt-0.5">
                <Smartphone size={12} color={isDark ? "#7dd3fc" : "#0369a1"} />
                <Text className="text-sky-700/70 dark:text-sky-300/60 text-[11px] flex-1" style={{ fontFamily: "Outfit_400Regular" }}>
                  Agrega nuestro widget a tu pantalla de inicio para registrar vasos con un toque.
                </Text>
              </View>
            </View>

            {/* Resumen de Inventario Activo (Rosado Suave & Clic a Recetas) */}
            <TouchableOpacity
              onPress={handleOpenRecetas}
              activeOpacity={0.85}
              className={`p-4 rounded-3xl border flex-row items-center justify-between ${
                isDark ? "bg-pink-950/20 border-pink-900/40" : "bg-pink-50 border-pink-100"
              }`}
            >
              <View className="flex-1 mr-3">
                <View className="flex-row items-center gap-2 mb-1">
                  <Package size={18} color="#ec4899" strokeWidth={2.5} />
                  <Text className="text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider" style={{ fontFamily: "Outfit_700Bold" }}>
                    Inventario Activo
                  </Text>
                </View>
                <Text className={`text-lg font-black ${themeText}`} style={{ fontFamily: "Outfit_900Black" }}>
                  {activos} alimentos listos
                </Text>
                <Text className="text-gray-400 dark:text-neutral-400 text-xs mt-0.5" style={{ fontFamily: "Outfit_400Regular" }}>
                  Toca aquí para cocinar con IA usando lo disponible.
                </Text>
              </View>

              <View className="h-10 w-10 rounded-2xl bg-pink-500/10 items-center justify-center">
                <ChefHat size={20} color="#ec4899" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ModalSheet>
    );
  }
);


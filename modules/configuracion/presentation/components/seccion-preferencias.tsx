import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Flame, ChefHat, Plus, X, Sparkles, Check } from "lucide-react-native";
import { ESTILOS_SUGERIDOS } from "@/common/utils/variables/estilos";
import { EQUIPAMIENTO_SUGERIDO } from "@/common/utils/variables/equipamiento";
import { useAppTheme } from "@/common/logic/use-app-theme";

interface Props {
  dificultad: "rapido" | "chef";
  estilosComida: string[];
  equipamiento: string[];
  toggleEstilo: (estilo: string) => void;
  toggleEquipamiento: (item: string) => void;
  changeDificultad: (diff: "rapido" | "chef") => void;
  handleSaveIA: () => void;
  isLoading: boolean;
}

export const SeccionPreferencias = ({
  dificultad,
  estilosComida,
  equipamiento,
  toggleEstilo,
  toggleEquipamiento,
  changeDificultad,
  handleSaveIA,
  isLoading,
}: Props) => {
  const { isDark, themeText, themeCardBg, themeBorder, dividerColor } = useAppTheme();
  
  const [customEstilo, setCustomEstilo] = useState("");
  const [customEquipamiento, setCustomEquipamiento] = useState("");

  const handleAddCustomEstilo = () => {
    const val = customEstilo.trim();
    if (val && !estilosComida.includes(val)) {
      toggleEstilo(val);
    }
    setCustomEstilo("");
  };

  const handleAddCustomEquipamiento = () => {
    const val = customEquipamiento.trim();
    if (val && !equipamiento.includes(val)) {
      toggleEquipamiento(val);
    }
    setCustomEquipamiento("");
  };

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <View className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-xl mr-3">
          <Sparkles size={18} color="#f97316" strokeWidth={2.5} />
        </View>
        <Text
          className={`text-lg ${themeText}`}
          style={{ fontFamily: "Outfit_700Bold" }}
        >
          Preferencias de Cocina (IA)
        </Text>
      </View>

      <View className={`${themeCardBg} p-5 rounded-[32px] border ${themeBorder} gap-6`}>
        {/* Dificultad */}
        <View>
          <Text
            className="text-gray-400 dark:text-neutral-500 text-xs uppercase tracking-widest mb-3 ml-1"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            Dificultad de Preparación
          </Text>
          <View
            className="flex-row p-1.5 rounded-[20px] relative"
            style={{ backgroundColor: dividerColor }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => changeDificultad("rapido")}
              className={`flex-1 py-4 rounded-[16px] items-center justify-center flex-row gap-2 ${
                dificultad === "rapido" ? "bg-white dark:bg-neutral-800" : ""
              }`}
              style={
                dificultad === "rapido"
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }
                  : undefined
              }
            >
              <View>
                <Flame
                  size={16}
                  color={dificultad === "rapido" ? "#f97316" : (isDark ? "#a3a3a3" : "#6b7280")}
                  strokeWidth={dificultad === "rapido" ? 2.5 : 2}
                />
              </View>
              <Text
                style={{
                  fontFamily:
                    dificultad === "rapido"
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  color: dificultad === "rapido" ? (isDark ? "#f3f4f6" : "#111827") : (isDark ? "#a3a3a3" : "#6b7280"),
                }}
              >
                Rápido (Express)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => changeDificultad("chef")}
              className={`flex-1 py-4 rounded-[16px] items-center justify-center flex-row gap-2 ${
                dificultad === "chef" ? "bg-white dark:bg-neutral-800" : ""
              }`}
              style={
                dificultad === "chef"
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }
                  : undefined
              }
            >
              <View>
                <ChefHat
                  size={16}
                  color={dificultad === "chef" ? "#f97316" : (isDark ? "#a3a3a3" : "#6b7280")}
                  strokeWidth={dificultad === "chef" ? 2.5 : 2}
                />
              </View>
              <Text
                style={{
                  fontFamily:
                    dificultad === "chef"
                      ? "Outfit_700Bold"
                      : "Outfit_400Regular",
                  color: dificultad === "chef" ? (isDark ? "#f3f4f6" : "#111827") : (isDark ? "#a3a3a3" : "#6b7280"),
                }}
              >
                Modo Chef
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estilos de Comida */}
        <View>
          <Text
            className="text-gray-400 dark:text-neutral-500 text-xs uppercase tracking-widest mb-3 ml-1"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            Estilos Favoritos
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {ESTILOS_SUGERIDOS.map((estilo) => {
              const active = estilosComida.includes(estilo);
              return (
                <TouchableOpacity
                  key={estilo}
                  activeOpacity={0.8}
                  onPress={() => toggleEstilo(estilo)}
                  className={`px-4 py-2.5 rounded-[18px] border ${
                    active
                      ? "bg-orange-500 border-orange-500"
                      : `bg-white dark:bg-neutral-800 ${themeBorder}`
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      active ? "text-white" : "text-gray-600 dark:text-gray-300"
                    }`}
                    style={{
                      fontFamily: active
                        ? "Outfit_700Bold"
                        : "Outfit_400Regular",
                    }}
                  >
                    {estilo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Input libre para Estilos personalizados */}
          <View className={`flex-row items-center rounded-2xl bg-white dark:bg-neutral-800 border ${themeBorder} px-4 py-1.5 mb-3 shadow-sm`}>
            <TextInput
              className={`flex-1 py-1.5 text-sm ${themeText}`}
              style={{
                fontFamily: "Outfit_400Regular",
              }}
              placeholder="Agregar otro estilo (ej: Árabe, Keto)"
              placeholderTextColor={isDark ? "#525252" : "#9ca3af"}
              value={customEstilo}
              onChangeText={setCustomEstilo}
              onSubmitEditing={handleAddCustomEstilo}
            />
            <TouchableOpacity onPress={handleAddCustomEstilo} className="p-1">
              <Plus size={20} color="#f97316" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* Lista de Estilos manuales agregados */}
          {estilosComida.filter((e) => !ESTILOS_SUGERIDOS.includes(e)).length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {estilosComida
                .filter((e) => !ESTILOS_SUGERIDOS.includes(e))
                .map((item) => (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    onPress={() => toggleEstilo(item)}
                    className="rounded-xl px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex-row items-center"
                  >
                    <Text
                      className="text-orange-600 dark:text-orange-400 text-xs mr-2"
                      style={{ fontFamily: "Outfit_700Bold" }}
                    >
                      {item}
                    </Text>
                    <X size={14} color="#f97316" strokeWidth={2.5} />
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        {/* Equipamiento disponible */}
        <View>
          <Text
            className="text-gray-400 dark:text-neutral-500 text-xs uppercase tracking-widest mb-3 ml-1"
            style={{ fontFamily: "Outfit_900Black" }}
          >
            Equipamiento Disponible
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {EQUIPAMIENTO_SUGERIDO.map((item) => {
              const active = equipamiento.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.8}
                  onPress={() => toggleEquipamiento(item)}
                  className={`px-4 py-2.5 rounded-[18px] border ${
                    active
                      ? "bg-orange-500 border-orange-500"
                      : `bg-white dark:bg-neutral-800 ${themeBorder}`
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      active ? "text-white" : "text-gray-600 dark:text-gray-300"
                    }`}
                    style={{
                      fontFamily: active
                        ? "Outfit_700Bold"
                        : "Outfit_400Regular",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Input libre para Equipamientos personalizados */}
          <View className={`flex-row items-center rounded-2xl bg-white dark:bg-neutral-800 border ${themeBorder} px-4 py-1.5 mb-3 shadow-sm`}>
            <TextInput
              className={`flex-1 py-1.5 text-sm ${themeText}`}
              style={{
                fontFamily: "Outfit_400Regular",
              }}
              placeholder="Agregar otro equipamiento (ej: Batidora, Grill)"
              placeholderTextColor={isDark ? "#525252" : "#9ca3af"}
              value={customEquipamiento}
              onChangeText={setCustomEquipamiento}
              onSubmitEditing={handleAddCustomEquipamiento}
            />
            <TouchableOpacity onPress={handleAddCustomEquipamiento} className="p-1">
              <Plus size={20} color="#f97316" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* Lista de Equipamientos manuales agregados */}
          {equipamiento.filter((eq) => !EQUIPAMIENTO_SUGERIDO.includes(eq)).length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {equipamiento
                .filter((eq) => !EQUIPAMIENTO_SUGERIDO.includes(eq))
                .map((item) => (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    onPress={() => toggleEquipamiento(item)}
                    className="rounded-xl px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex-row items-center"
                  >
                    <Text
                      className="text-orange-600 dark:text-orange-400 text-xs mr-2"
                      style={{ fontFamily: "Outfit_700Bold" }}
                    >
                      {item}
                    </Text>
                    <X size={14} color="#f97316" strokeWidth={2.5} />
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        {/* Botón Guardar IA */}
        <TouchableOpacity
          onPress={handleSaveIA}
          disabled={isLoading}
          activeOpacity={0.9}
          className="h-16 bg-orange-500 rounded-[22px] flex-row items-center justify-center mt-2"
          style={{
            shadowColor: "#f97316",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.2,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <View className="mr-2">
                <Check size={20} color="white" strokeWidth={3} />
              </View>
              <Text
                className="text-white text-base ml-2"
                style={{ fontFamily: "Outfit_900Black" }}
              >
                Guardar Cambios de IA
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

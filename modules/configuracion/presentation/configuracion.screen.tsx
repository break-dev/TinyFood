import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Settings,
  Plus,
  Minus,
  Check,
  Sparkles,
  Smartphone,
  Sun,
  Moon,
  Cpu,
  ChefHat,
  Flame,
  X,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useConfiguracion } from "../logic/use-configuracion";
import { AparienciaTipo } from "../store/config.store";
import * as Haptics from "expo-haptics";
import { useAppTheme } from "@/common/logic/use-app-theme";

const ESTILOS_COMIDA = [
  "Peruana",
  "China",
  "Italiana",
  "Mexicana",
  "Japonesa",
  "Vegana",
  "Marina",
];

const EQUIPAMIENTO = [
  "Horno",
  "Licuadora",
  "Air Fryer",
  "Microondas",
  "Cocina",
];

// Custom Animated Switch Component
const CustomSwitch = ({
  value,
  onPress,
}: {
  value: boolean;
  onPress: () => void;
}) => {
  const { isDark } = useAppTheme();
  
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View
        className={`w-[56px] h-8 rounded-full p-1 flex-row items-center ${
          value ? "bg-orange-500" : (isDark ? "bg-neutral-800 border border-neutral-700" : "bg-gray-200")
        }`}
      >
        <MotiView
          animate={{
            translateX: value ? 24 : 0,
          }}
          transition={{
            type: "spring",
            damping: 18,
            stiffness: 150,
          }}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 1,
            elevation: 1,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export const ConfiguracionScreen = () => {
  const insets = useSafeAreaInsets();
  const { isDark, themeBg, themeText, themeCardBg, themeBorder, iconColor, dividerColor } = useAppTheme();

  const [customEstilo, setCustomEstilo] = React.useState("");
  const [customEquipamiento, setCustomEquipamiento] = React.useState("");

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

  const {
    localConfig,
    dificultad,
    estilosComida,
    equipamiento,
    toggleEstilo,
    toggleEquipamiento,
    changeDificultad,
    handleSaveIA,
    isLoading,
  } = useConfiguracion();

  const handleToggleSwitch = (key: "vibracionHaptics" | "recordatorios") => {
    const isHaptic = localConfig.vibracionHaptics;
    if (isHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (key === "vibracionHaptics") {
      localConfig.setVibracionHaptics(!localConfig.vibracionHaptics);
    } else {
      localConfig.setRecordatorios(!localConfig.recordatorios);
    }
  };

  const handleIncrementDias = () => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    localConfig.setAvisoDiasCaducidad(
      Math.min(15, localConfig.avisoDiasCaducidad + 1)
    );
  };

  const handleDecrementDias = () => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    localConfig.setAvisoDiasCaducidad(
      Math.max(1, localConfig.avisoDiasCaducidad - 1)
    );
  };

  const handleSelectTema = (tema: AparienciaTipo) => {
    if (localConfig.vibracionHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    localConfig.setApariencia(tema);
  };

  return (
    <View className={`flex-1 ${themeBg}`} style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className={`flex-row items-center px-6 py-6 border-b ${themeBorder}`}>
        <View className="mr-3">
          <Settings size={26} color={iconColor} strokeWidth={2.5} />
        </View>
        <Text
          className={`text-2xl ml-2 ${themeText}`}
          style={{ fontFamily: "Outfit_900Black" }}
        >
          Ajustes
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`flex-1 px-6 py-4 ${themeBg}`}
      >
        {/* SECCIÓN 1: Inteligencia Artificial (Remoto) */}
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
                {ESTILOS_COMIDA.map((estilo) => {
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
              {estilosComida.filter((e) => !ESTILOS_COMIDA.includes(e)).length > 0 && (
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {estilosComida
                    .filter((e) => !ESTILOS_COMIDA.includes(e))
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
                {EQUIPAMIENTO.map((item) => {
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
              {equipamiento.filter((eq) => !EQUIPAMIENTO.includes(eq)).length > 0 && (
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {equipamiento
                    .filter((eq) => !EQUIPAMIENTO.includes(eq))
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

        {/* SECCIÓN 2: Sistema (Local) */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl mr-3">
              <Cpu size={18} color="#3b82f6" strokeWidth={2.5} />
            </View>
            <Text
              className={`text-lg ${themeText}`}
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Sistema y Notificaciones
            </Text>
          </View>

          <View className={`${themeCardBg} p-5 rounded-[32px] border ${themeBorder} gap-6`}>
            {/* Días Caducidad */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text
                  className={`text-base ${themeText}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  Aviso de Caducidad
                </Text>
                <Text
                  className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
                  style={{ fontFamily: "Outfit_400Regular" }}
                >
                  Días de anticipación para avisar sobre productos a vencer.
                </Text>
              </View>

              <View
                className={`flex-row items-center bg-white dark:bg-neutral-800 p-1 rounded-2xl border ${themeBorder}`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <TouchableOpacity
                  onPress={handleDecrementDias}
                  className="w-10 h-10 bg-gray-50 dark:bg-neutral-900 rounded-xl items-center justify-center"
                >
                  <View>
                    <Minus size={14} color={isDark ? "#f3f4f6" : "#4b5563"} strokeWidth={3} />
                  </View>
                </TouchableOpacity>
                <Text
                  className={`mx-4 text-base ${themeText}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {localConfig.avisoDiasCaducidad} d
                </Text>
                <TouchableOpacity
                  onPress={handleIncrementDias}
                  className="w-10 h-10 bg-gray-50 dark:bg-neutral-900 rounded-xl items-center justify-center"
                >
                  <View>
                    <Plus size={14} color={isDark ? "#f3f4f6" : "#4b5563"} strokeWidth={3} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View className="h-[1px]" style={{ backgroundColor: dividerColor }} />

            {/* Vibración Háptica */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text
                  className={`text-base ${themeText}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  Vibración Háptica
                </Text>
                <Text
                  className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
                  style={{ fontFamily: "Outfit_400Regular" }}
                >
                  Respuesta física al tocar botones e interactuar.
                </Text>
              </View>
              <CustomSwitch
                value={localConfig.vibracionHaptics}
                onPress={() => handleToggleSwitch("vibracionHaptics")}
              />
            </View>

            <View className="h-[1px]" style={{ backgroundColor: dividerColor }} />

            {/* Recordatorios */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text
                  className={`text-base ${themeText}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  Recordatorios Diarios
                </Text>
                <Text
                  className="text-gray-400 dark:text-neutral-500 text-xs mt-0.5"
                  style={{ fontFamily: "Outfit_400Regular" }}
                >
                  Alertas periódicas sobre tus ingredientes y compras.
                </Text>
              </View>
              <CustomSwitch
                value={localConfig.recordatorios}
                onPress={() => handleToggleSwitch("recordatorios")}
              />
            </View>
          </View>
        </View>

        {/* SECCIÓN 3: Apariencia */}
        <View className="mb-12">
          <View className="flex-row items-center mb-4">
            <View className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl mr-3">
              <Sun size={18} color="#10b981" strokeWidth={2.5} />
            </View>
            <Text
              className={`text-lg ${themeText}`}
              style={{ fontFamily: "Outfit_700Bold" }}
            >
              Apariencia
            </Text>
          </View>

          <View className={`${themeCardBg} p-5 rounded-[32px] border ${themeBorder}`}>
            <Text
              className="text-gray-400 dark:text-neutral-500 text-xs uppercase tracking-widest mb-3 ml-1"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              Tema de la aplicación
            </Text>
            <View className="flex-row gap-3">
              {([
                { id: "claro", label: "Claro" },
                { id: "oscuro", label: "Oscuro" },
                { id: "sistema", label: "Sistema" },
              ] as const).map((opt) => {
                const active = localConfig.apariencia === opt.id;
                const iconColor = active ? "white" : (isDark ? "#a3a3a3" : "#6b7280");
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.8}
                    onPress={() => handleSelectTema(opt.id)}
                    className={`flex-1 py-4 rounded-[20px] items-center justify-center border flex-row gap-2 ${
                      active
                        ? "bg-orange-500 border-orange-500"
                        : `bg-white dark:bg-neutral-800 ${themeBorder}`
                    }`}
                    style={
                      active
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
                    {opt.id === "claro" && (
                      <View>
                        <Sun size={15} color={iconColor} strokeWidth={2.5} />
                      </View>
                    )}
                    {opt.id === "oscuro" && (
                      <View>
                        <Moon size={15} color={iconColor} strokeWidth={2.5} />
                      </View>
                    )}
                    {opt.id === "sistema" && (
                      <View>
                        <Smartphone size={15} color={iconColor} strokeWidth={2.5} />
                      </View>
                    )}
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
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        
        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

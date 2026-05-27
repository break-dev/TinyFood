import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useAppTheme } from "@/common/logic/use-app-theme";
import { Plus, Camera, ImageIcon } from "lucide-react-native";
import { MotiView } from "moti";
import { RES_Comida } from "@/modules/despensa/service/despensa.responses";

export const FooterRegistroComida = memo(
  ({
    isSubmitting,
    comidaParaEditar,
    onSave,
    onToggleUpload,
    mostrarOpcionesFoto,
    onCamara,
    onGaleria,
    analizando,
    iconColor,
  }: {
    isSubmitting: boolean;
    comidaParaEditar?: RES_Comida | null;
    onSave: () => void;
    onToggleUpload: () => void;
    mostrarOpcionesFoto: boolean;
    onCamara: () => void;
    onGaleria: () => void;
    analizando: boolean;
    iconColor: string;
  }) => {
    const { isDark } = useAppTheme();
    const soloLectura = isSubmitting || analizando;

    return (
      <View style={{ position: "relative", zIndex: mostrarOpcionesFoto ? 50 : 10 }}>
        {/* Popover flotante del menú de fotos */}
        {mostrarOpcionesFoto && !soloLectura && (
          <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: 15 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="absolute bottom-[86px] left-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-[24px] p-2 shadow-2xl z-50 w-[180px]"
          >
            <TouchableOpacity
              onPress={onCamara}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 p-3.5 rounded-[18px] active:bg-gray-100 dark:active:bg-neutral-850"
            >
              <Camera size={18} color={iconColor} strokeWidth={2} />
              <Text
                className="text-gray-700 dark:text-neutral-200 text-sm"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Cámara
              </Text>
            </TouchableOpacity>

            <View className="h-[1px] bg-gray-100 dark:bg-neutral-800/80 my-1 mx-2" />

            <TouchableOpacity
              onPress={onGaleria}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 p-3.5 rounded-[18px] active:bg-gray-100 dark:active:bg-neutral-850"
            >
              <ImageIcon size={18} color={iconColor} strokeWidth={2} />
              <Text
                className="text-gray-700 dark:text-neutral-200 text-sm"
                style={{ fontFamily: "Outfit_700Bold" }}
              >
                Galería
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={{ paddingTop: 12, paddingBottom: 10 }}
        >
          <View className="flex-row gap-3 items-center">
            {/* Botón Upload */}
            {!comidaParaEditar && (
              <TouchableOpacity
                onPress={onToggleUpload}
                disabled={soloLectura}
                activeOpacity={0.8}
                className="h-[64px] w-[64px] items-center justify-center rounded-[24px] bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
              >
                {analizando ? (
                  <ActivityIndicator size="small" color="#f97316" />
                ) : (
                  <Camera size={24} color={iconColor} strokeWidth={2} />
                )}
              </TouchableOpacity>
            )}

            {/* Botón Guardar principal */}
            <TouchableOpacity
              onPress={onSave}
              disabled={soloLectura}
              activeOpacity={0.9}
              className={`flex-1 h-[64px] items-center justify-center rounded-[32px] shadow-2xl ${
                soloLectura
                  ? "bg-gray-300 dark:bg-neutral-800"
                  : "bg-orange-500 shadow-orange-500/40"
              }`}
            >
              <View className="flex-row items-center">
                <Text
                  className="text-white text-lg mr-2"
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  {isSubmitting
                    ? "Registrando..."
                    : analizando
                      ? "Procesando..."
                      : comidaParaEditar
                        ? "Guardar Cambios"
                        : "Guardar en Despensa"}
                </Text>
                {!soloLectura && (
                  <Plus size={20} color="white" strokeWidth={3} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    );
  },
);

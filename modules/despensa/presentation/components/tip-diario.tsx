import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { ModalSheet } from "@/common/presentation/components/modal-sheet";
import { MotiView } from "moti";
import { Lightbulb, X, Sparkles } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTipDiario } from "../../logic/use-tip-diario";
 
// ── Colores por urgencia ──────────────────────────────────────────────────────
 
const URGENCIA = {
  alta: {
    pill: { bg: "#fff1f2", border: "#fecdd3", text: "#e11d48", dot: "#f43f5e" },
    modal: { bg: "#fff1f2", titulo: "#9f1239", consejo: "#be123c" },
  },
  media: {
    pill: { bg: "#fff7ed", border: "#fed7aa", text: "#ea580c", dot: "#f97316" },
    modal: { bg: "#fff7ed", titulo: "#9a3412", consejo: "#c2410c" },
  },
  baja: {
    pill: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", dot: "#22c55e" },
    modal: { bg: "#f0fdf4", titulo: "#14532d", consejo: "#15803d" },
  },
};
 
// ── Componente ────────────────────────────────────────────────────────────────
 
export const TipDiario = ({ trigger }: { trigger?: number })=> {
  const { tip, cargando } = useTipDiario();
  const sheetRef = useRef<BottomSheetModal>(null);
 
  const abrirTip = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sheetRef.current?.present();
  }, []);
 
  const cerrarTip = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sheetRef.current?.dismiss();
  }, []);
 
  // No renderizar nada si no hay tip o está cargando
  if (cargando || !tip) return null;
 
  const colores = URGENCIA[tip.urgencia] ?? URGENCIA.baja;
 
  return (
    <>
      {/* ── Botón pill ─────────────────────────────────────────────────────── */}
      <MotiView
        from={{ opacity: 0, scale: 0.9, translateY: -4 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 16, stiffness: 200, delay: 300 }}
      >
        <TouchableOpacity
          onPress={abrirTip}
          activeOpacity={0.8}
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: colores.pill.bg,
            borderWidth: 1.5,
            borderColor: colores.pill.border,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 100,
          }}
        >
          {/* Dot pulsante */}
          <MotiView
            from={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.4, opacity: 0.3 }}
            transition={{ loop: true, type: "timing", duration: 900 }}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colores.pill.dot,
            }}
          />
          <Lightbulb size={15} color={colores.pill.text} strokeWidth={2.5} />
          <Text
            style={{
              fontFamily: "Outfit_700Bold",
              fontSize: 13,
              color: colores.pill.text,
            }}
          >
            Tip del Día
          </Text>
          {/* Preview del título */}
          <Text
            style={{
              fontFamily: "Outfit_400Regular",
              fontSize: 12,
              color: colores.pill.text,
              opacity: 0.7,
              maxWidth: 140,
            }}
            numberOfLines={1}
          >
            · {tip.titulo}
          </Text>
        </TouchableOpacity>
      </MotiView>
 
      {/* ── Modal tip ──────────────────────────────────────────────────────── */}
      <ModalSheet ref={sheetRef} scrollable={false}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}>
 
          {/* Cerrar */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
            <TouchableOpacity
              onPress={cerrarTip}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#f3f4f6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} color="#6b7280" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
 
          {/* Contenido del tip */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18, delay: 50 }}
            style={{ alignItems: "center" }}
          >
            {/* Emoji grande */}
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: colores.modal.bg,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 44 }}>{tip.emoji}</Text>
            </View>
 
            {/* Badge */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: colores.modal.bg,
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 100,
                marginBottom: 16,
              }}
            >
              <Sparkles size={12} color={colores.modal.titulo} strokeWidth={2} />
              <Text
                style={{
                  fontFamily: "Outfit_700Bold",
                  fontSize: 10,
                  color: colores.modal.titulo,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              >
                Tu tip personalizado
              </Text>
            </View>
 
            {/* Título */}
            <Text
              style={{
                fontFamily: "Outfit_900Black",
                fontSize: 26,
                color: colores.modal.titulo,
                textAlign: "center",
                lineHeight: 32,
                marginBottom: 16,
                paddingHorizontal: 8,
              }}
            >
              {tip.titulo}
            </Text>
 
            {/* Consejo */}
            <Text
              style={{
                fontFamily: "Outfit_400Regular",
                fontSize: 16,
                color: colores.modal.consejo,
                textAlign: "center",
                lineHeight: 26,
                paddingHorizontal: 8,
                marginBottom: 32,
              }}
            >
              {tip.consejo}
            </Text>
 
            {/* Botón entendido */}
            <TouchableOpacity
              onPress={cerrarTip}
              activeOpacity={0.85}
              style={{
                width: "100%",
                backgroundColor: "#111827",
                paddingVertical: 18,
                borderRadius: 28,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Outfit_900Black",
                  fontSize: 16,
                  color: "white",
                  letterSpacing: 0.5,
                }}
              >
                ¡Entendido!
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </ModalSheet>
    </>
  );
};
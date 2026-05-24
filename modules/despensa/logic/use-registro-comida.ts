import { useCallback, useEffect, useState, useRef } from "react";
import { RefObject } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { EstadoComida } from "@/common/utils/enums/estado-comida.enum";
import {
  REQ_ActualizarComida,
  REQ_RegistrarComida,
} from "../service/despensa.requests";
import { RES_Comida } from "../service/despensa.responses";
import { useAnalizarImagen } from "./use-analizar-imagen";

interface Params {
  ref: RefObject<BottomSheetModal>;
  onRegister: (data: REQ_RegistrarComida) => Promise<boolean>;
  onUpdate: (data: REQ_ActualizarComida) => Promise<boolean>;
  comidaParaEditar?: RES_Comida | null;
}

export function useRegistroComida({
  ref,
  onRegister,
  onUpdate,
  comidaParaEditar,
}: Params) {
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Estado de la sección de foto ──────────────────────────────────────────
  const [mostrarOpcionesFoto, setMostrarOpcionesFoto] = useState(false);
  const [imagenAnalizada, setImagenAnalizada] = useState<{
    categoria: string;
    confianza: "alta" | "media" | "baja";
    dias_duracion_estimados: number;
  } | null>(null);

  // ── Hook de IA ────────────────────────────────────────────────────────────
  const { analizando, abrirCamara, abrirGaleria } = useAnalizarImagen();

  // ── Refs nativos para inputs no controlados (previene bug Android) ─────────
  const nombreInputRef = useRef<TextInput>(null);
  const cantidadInputRef = useRef<TextInput>(null);
  const descripcionInputRef = useRef<TextInput>(null);

  // Valores mutables — sin re-render en cada pulsación
  const nombreRef = useRef("");
  const cantidadRef = useRef("");
  const descripcionRef = useRef("");

  // ── Sincronizar al abrir en modo edición o limpiar al cerrar ──────────────
  useEffect(() => {
    if (comidaParaEditar) {
      nombreRef.current = comidaParaEditar.nombre;
      cantidadRef.current = comidaParaEditar.cantidad;
      descripcionRef.current = comidaParaEditar.descripcion || "";
      setFechaVencimiento(
        comidaParaEditar.fecha_vencimiento
          ? new Date(comidaParaEditar.fecha_vencimiento)
          : null,
      );
      nombreInputRef.current?.setNativeProps({ text: comidaParaEditar.nombre });
      cantidadInputRef.current?.setNativeProps({ text: comidaParaEditar.cantidad });
      descripcionInputRef.current?.setNativeProps({
        text: comidaParaEditar.descripcion || "",
      });
    } else {
      limpiarFormulario();
    }
  }, [comidaParaEditar]);

  // ── Limpiar todo (incluyendo estado de IA) ────────────────────────────────
  const limpiarFormulario = useCallback(() => {
    nombreRef.current = "";
    cantidadRef.current = "";
    descripcionRef.current = "";
    setFechaVencimiento(null);
    setImagenAnalizada(null);
    setMostrarOpcionesFoto(false);
    nombreInputRef.current?.clear();
    nombreInputRef.current?.setNativeProps({ text: "" });
    cantidadInputRef.current?.clear();
    cantidadInputRef.current?.setNativeProps({ text: "" });
    descripcionInputRef.current?.clear();
    descripcionInputRef.current?.setNativeProps({ text: "" });
  }, []);

  // ── Auto-relleno desde la IA ──────────────────────────────────────────────
  const handleAnalizarCamara = useCallback(async () => {
    setMostrarOpcionesFoto(false);
    const resultado = await abrirCamara();
    if (!resultado) return;

    // Rellenar valores mutables
    nombreRef.current = resultado.nombre;
    cantidadRef.current = resultado.cantidad;
    descripcionRef.current = resultado.descripcion || "";

    // Rellenar inputs nativos directamente (sin re-render)
    nombreInputRef.current?.setNativeProps({ text: resultado.nombre });
    cantidadInputRef.current?.setNativeProps({ text: resultado.cantidad });
    descripcionInputRef.current?.setNativeProps({
      text: resultado.descripcion || "",
    });

    // Fecha de vencimiento si viene de la IA
    if (resultado.fecha_vencimiento) {
      setFechaVencimiento(new Date(resultado.fecha_vencimiento));
    }

    // Guardar metadata de IA para mostrar el badge
    setImagenAnalizada({
      categoria: resultado.categoria,
      confianza: resultado.confianza,
      dias_duracion_estimados: resultado.dias_duracion_estimados,
    });
  }, [abrirCamara]);

  const handleAnalizarGaleria = useCallback(async () => {
    setMostrarOpcionesFoto(false);
    const resultado = await abrirGaleria();
    if (!resultado) return;

    nombreRef.current = resultado.nombre;
    cantidadRef.current = resultado.cantidad;
    descripcionRef.current = resultado.descripcion || "";

    nombreInputRef.current?.setNativeProps({ text: resultado.nombre });
    cantidadInputRef.current?.setNativeProps({ text: resultado.cantidad });
    descripcionInputRef.current?.setNativeProps({
      text: resultado.descripcion || "",
    });

    if (resultado.fecha_vencimiento) {
      setFechaVencimiento(new Date(resultado.fecha_vencimiento));
    }

    setImagenAnalizada({
      categoria: resultado.categoria,
      confianza: resultado.confianza,
      dias_duracion_estimados: resultado.dias_duracion_estimados,
    });
  }, [abrirGaleria]);

  // ── Guardar ───────────────────────────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  const handleSave = useCallback(async () => {
    const nombreVal = nombreRef.current.trim();
    const cantidadVal = cantidadRef.current.trim();
    const descripcionVal = descripcionRef.current.trim();

    if (!nombreVal || !cantidadVal) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Por favor indica el nombre y la cantidad 🍎",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let success = false;

      if (comidaParaEditar) {
        success = await onUpdate({
          id: comidaParaEditar.id,
          nombre: nombreVal,
          cantidad: cantidadVal,
          descripcion: descripcionVal || undefined,
          fecha_vencimiento: fechaVencimiento?.toISOString(),
        });
        if (success) {
          Toast.show({
            type: "success",
            text1: "¡Actualizado!",
            text2: `${nombreVal} ha sido actualizado con éxito ✨`,
          });
        }
      } else {
        success = await onRegister({
          nombre: nombreVal,
          cantidad: cantidadVal,
          descripcion: descripcionVal || undefined,
          fecha_vencimiento: fechaVencimiento?.toISOString(),
          estado: EstadoComida.PorConsumir,
        });
        if (success) {
          Toast.show({
            type: "success",
            text1: "¡Al inventario!",
            text2: `${nombreVal} se agregó correctamente 🚀`,
          });
        }
      }

      if (success) {
        limpiarFormulario();
        handleDismiss();
      }
    } catch (error) {
      console.error("[RegistroComida] Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onRegister, onUpdate, handleDismiss, comidaParaEditar, fechaVencimiento, limpiarFormulario]);

  // ── Handlers de texto ─────────────────────────────────────────────────────
  const handleNombreChange = useCallback((text: string) => {
    nombreRef.current = text;
  }, []);

  const handleCantidadChange = useCallback((text: string) => {
    cantidadRef.current = text;
  }, []);

  const handleDescripcionChange = useCallback((text: string) => {
    descripcionRef.current = text;
  }, []);

  return {
    // Fecha
    fechaVencimiento,
    setFechaVencimiento,
    showDatePicker,
    setShowDatePicker,
    // Submit
    isSubmitting,
    handleDismiss,
    handleSave,
    // Refs de inputs
    nombreInputRef,
    cantidadInputRef,
    descripcionInputRef,
    // Handlers de texto
    handleNombreChange,
    handleCantidadChange,
    handleDescripcionChange,
    // IA
    analizando,
    mostrarOpcionesFoto,
    setMostrarOpcionesFoto,
    imagenAnalizada,
    handleAnalizarCamara,
    handleAnalizarGaleria,
  };
}
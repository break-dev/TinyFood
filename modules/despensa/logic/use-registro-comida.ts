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

  const [mostrarOpcionesFoto, setMostrarOpcionesFoto] = useState(false);
  const [imagenAnalizada, setImagenAnalizada] = useState<{
    categoria: string;
    confianza: "alta" | "media" | "baja";
    dias_duracion_estimados: number;
  } | null>(null);

  const { analizando, abrirCamara, abrirGaleria } = useAnalizarImagen();

  const nombreInputRef = useRef<TextInput>(null);
  const cantidadInputRef = useRef<TextInput>(null);
  const descripcionInputRef = useRef<TextInput>(null);

  const nombreRef = useRef("");
  const cantidadRef = useRef("");
  const descripcionRef = useRef("");
  const tagsRef = useRef(""); //ref para guardar tags de la IA

  useEffect(() => {
    if (comidaParaEditar) {
      nombreRef.current = comidaParaEditar.nombre;
      cantidadRef.current = comidaParaEditar.cantidad;
      descripcionRef.current = comidaParaEditar.descripcion || "";
      tagsRef.current = comidaParaEditar.tags || ""; // ← sincronizar tags en edición
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

  const limpiarFormulario = useCallback(() => {
    nombreRef.current = "";
    cantidadRef.current = "";
    descripcionRef.current = "";
    tagsRef.current = ""; // ← limpiar tags
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

  //rellenar desde resultado de IA
  const rellenarDesdeIA = useCallback((resultado: any) => {
    nombreRef.current = resultado.nombre;
    cantidadRef.current = resultado.cantidad;
    descripcionRef.current = resultado.descripcion || "";
    tagsRef.current = resultado.tags || ""; // ← guardar tags

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
  }, []);

  const handleAnalizarCamara = useCallback(async () => {
    setMostrarOpcionesFoto(false);
    const resultado = await abrirCamara();
    if (resultado) rellenarDesdeIA(resultado);
  }, [abrirCamara, rellenarDesdeIA]);

  const handleAnalizarGaleria = useCallback(async () => {
    setMostrarOpcionesFoto(false);
    const resultado = await abrirGaleria();
    if (resultado) rellenarDesdeIA(resultado);
  }, [abrirGaleria, rellenarDesdeIA]);

  const handleDismiss = useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  const handleSave = useCallback(async () => {
    const nombreVal = nombreRef.current.trim();
    const cantidadVal = cantidadRef.current.trim();
    const descripcionVal = descripcionRef.current.trim();
    const tagsVal = tagsRef.current.trim(); // ← leer tags

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
          tags: tagsVal || undefined, // ← incluir tags en actualización
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
          tags: tagsVal || undefined, // ← incluir tags en registro
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
    fechaVencimiento,
    setFechaVencimiento,
    showDatePicker,
    setShowDatePicker,
    isSubmitting,
    handleDismiss,
    handleSave,
    nombreInputRef,
    cantidadInputRef,
    descripcionInputRef,
    handleNombreChange,
    handleCantidadChange,
    handleDescripcionChange,
    analizando,
    mostrarOpcionesFoto,
    setMostrarOpcionesFoto,
    imagenAnalizada,
    handleAnalizarCamara,
    handleAnalizarGaleria,
  };
}
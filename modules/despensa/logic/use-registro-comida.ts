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

  // Refs nativos para evitar el bug de duplicación de caracteres en Android (uncontrolled inputs)
  const nombreInputRef = useRef<TextInput>(null);
  const cantidadInputRef = useRef<TextInput>(null);
  const descripcionInputRef = useRef<TextInput>(null);

  // Valores de texto mutables para evitar re-renders en cada pulsación de tecla
  const nombreRef = useRef("");
  const cantidadRef = useRef("");
  const descripcionRef = useRef("");

  // Sincroniza el formulario al abrir en modo edición o limpiar al cerrar
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

      // Sincronizar texto en los inputs nativos de forma directa
      nombreInputRef.current?.setNativeProps({ text: comidaParaEditar.nombre });
      cantidadInputRef.current?.setNativeProps({
        text: comidaParaEditar.cantidad,
      });
      descripcionInputRef.current?.setNativeProps({
        text: comidaParaEditar.descripcion || "",
      });
    } else {
      // Modo creación o cierre: limpiar
      nombreRef.current = "";
      cantidadRef.current = "";
      descripcionRef.current = "";
      setFechaVencimiento(null);

      // Limpiar inputs nativos
      nombreInputRef.current?.clear();
      nombreInputRef.current?.setNativeProps({ text: "" });
      cantidadInputRef.current?.clear();
      cantidadInputRef.current?.setNativeProps({ text: "" });
      descripcionInputRef.current?.clear();
      descripcionInputRef.current?.setNativeProps({ text: "" });
    }
  }, [comidaParaEditar]);

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
        nombreRef.current = "";
        cantidadRef.current = "";
        descripcionRef.current = "";
        setFechaVencimiento(null);

        // Limpiar inputs nativos también al guardar con éxito
        nombreInputRef.current?.clear();
        nombreInputRef.current?.setNativeProps({ text: "" });
        cantidadInputRef.current?.clear();
        cantidadInputRef.current?.setNativeProps({ text: "" });
        descripcionInputRef.current?.clear();
        descripcionInputRef.current?.setNativeProps({ text: "" });

        handleDismiss();
      }
    } catch (error) {
      console.error("[RegistroComida] Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onRegister, onUpdate, handleDismiss, comidaParaEditar, fechaVencimiento]);

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
    // Refs expuestos para los inputs nativos
    nombreInputRef,
    cantidadInputRef,
    descripcionInputRef,
    // Controladores de cambio de texto
    handleNombreChange,
    handleCantidadChange,
    handleDescripcionChange,
  };
}

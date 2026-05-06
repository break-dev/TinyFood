import { useCallback, useEffect, useState } from "react";
import { RefObject } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
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
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincroniza el formulario al abrir en modo edición o limpiar al cerrar
  useEffect(() => {
    // Si hay un objeto para editar, sincronizamos
    if (comidaParaEditar) {
      setNombre(comidaParaEditar.nombre);
      setCantidad(comidaParaEditar.cantidad);
      setDescripcion(comidaParaEditar.descripcion || "");
      setFechaVencimiento(
        comidaParaEditar.fecha_vencimiento
          ? new Date(comidaParaEditar.fecha_vencimiento)
          : null,
      );
    }
    // Si NO hay objeto para editar (modo creación), solo limpiamos si el formulario NO tiene datos
    // Esto evita que al re-renderizar el padre se borre lo que el usuario está escribiendo
    else if (!nombre && !cantidad && !descripcion && !fechaVencimiento) {
      setNombre("");
      setCantidad("");
      setDescripcion("");
      setFechaVencimiento(null);
    }
  }, [comidaParaEditar]);

  const handleDismiss = useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  const handleSave = useCallback(async () => {
    if (!nombre || !cantidad) {
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
          nombre,
          cantidad,
          descripcion: descripcion || undefined,
          fecha_vencimiento: fechaVencimiento?.toISOString(),
        });
        if (success) {
          Toast.show({
            type: "success",
            text1: "¡Actualizado!",
            text2: `${nombre} ha sido actualizado con éxito ✨`,
          });
        }
      } else {
        success = await onRegister({
          nombre,
          cantidad,
          descripcion: descripcion || undefined,
          fecha_vencimiento: fechaVencimiento?.toISOString(),
          estado: EstadoComida.PorConsumir,
        });
        if (success) {
          Toast.show({
            type: "success",
            text1: "¡Al inventario!",
            text2: `${nombre} se agregó correctamente 🚀`,
          });
        }
      }

      if (success) {
        setNombre("");
        setCantidad("");
        setDescripcion("");
        setFechaVencimiento(null);
        handleDismiss();
      }
    } catch (error) {
      console.error("[RegistroComida] Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    nombre,
    cantidad,
    descripcion,
    fechaVencimiento,
    comidaParaEditar,
    onRegister,
    onUpdate,
    handleDismiss,
  ]);

  return {
    // Estado del formulario
    nombre,
    setNombre,
    cantidad,
    setCantidad,
    descripcion,
    setDescripcion,
    fechaVencimiento,
    setFechaVencimiento,
    showDatePicker,
    setShowDatePicker,
    isSubmitting,
    // Acciones
    handleDismiss,
    handleSave,
  };
}

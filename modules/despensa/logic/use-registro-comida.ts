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
import {
  RES_Comida,
  RES_AnalizarImagenItem,
} from "../service/despensa.responses";
import { useAnalizarImagen } from "./use-analizar-imagen";

interface Params {
  ref: RefObject<BottomSheetModal>;
  onRegister: (data: REQ_RegistrarComida[]) => Promise<boolean>;
  onUpdate: (data: REQ_ActualizarComida) => Promise<boolean>;
  comidaParaEditar?: RES_Comida | null;
}

function toLocalISOString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
}

function parseLocalDate(dateInput: Date | string): Date {
  const dateStr = typeof dateInput === 'string' ? dateInput : dateInput.toISOString();
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

export interface AlimentoForm {
  nombre: string;
  cantidad: string;
  descripcion: string;
  tags: string[];
  fecha_vencimiento?: string;
  categoria?: string;
  dias_duracion_estimados?: number;
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
    categoria?: string;
    dias_duracion_estimados?: number;
  } | null>(null);

  // Lista de alimentos en creación
  const alimentosRef = useRef<AlimentoForm[]>([
    { nombre: "", cantidad: "", descripcion: "", tags: [] },
  ]);
  const [alimentos, setAlimentos] = useState<AlimentoForm[]>([
    { nombre: "", cantidad: "", descripcion: "", tags: [] },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { analizando, abrirCamara, abrirGaleria } = useAnalizarImagen();

  const nombreInputRef = useRef<TextInput>(null);
  const cantidadInputRef = useRef<TextInput>(null);
  const descripcionInputRef = useRef<TextInput>(null);

  const nombreRef = useRef("");
  const cantidadRef = useRef("");
  const descripcionRef = useRef("");
  const tagsRef = useRef(""); // Guardado en formato de string separado por coma localmente en ref

  const limpiarFormulario = useCallback(() => {
    nombreRef.current = "";
    cantidadRef.current = "";
    descripcionRef.current = "";
    tagsRef.current = "";
    setFechaVencimiento(null);
    setImagenAnalizada(null);
    setMostrarOpcionesFoto(false);

    alimentosRef.current = [
      { nombre: "", cantidad: "", descripcion: "", tags: [] },
    ];
    setAlimentos([{ nombre: "", cantidad: "", descripcion: "", tags: [] }]);
    setActiveIndex(0);

    nombreInputRef.current?.clear();
    nombreInputRef.current?.setNativeProps({ text: "" });
    cantidadInputRef.current?.clear();
    cantidadInputRef.current?.setNativeProps({ text: "" });
    descripcionInputRef.current?.clear();
    descripcionInputRef.current?.setNativeProps({ text: "" });
  }, []);

  useEffect(() => {
    if (comidaParaEditar) {
      const itemForm: AlimentoForm = {
        nombre: comidaParaEditar.nombre,
        cantidad: comidaParaEditar.cantidad,
        descripcion: comidaParaEditar.descripcion || "",
        tags: comidaParaEditar.tags || [],
        fecha_vencimiento: comidaParaEditar.fecha_vencimiento
          ? toLocalISOString(parseLocalDate(comidaParaEditar.fecha_vencimiento))
          : undefined,
      };

      alimentosRef.current = [itemForm];
      setAlimentos([itemForm]);
      setActiveIndex(0);

      nombreRef.current = comidaParaEditar.nombre;
      cantidadRef.current = comidaParaEditar.cantidad;
      descripcionRef.current = comidaParaEditar.descripcion || "";
      tagsRef.current = comidaParaEditar.tags
        ? comidaParaEditar.tags.join(",")
        : "";
      setFechaVencimiento(
        comidaParaEditar.fecha_vencimiento
          ? parseLocalDate(comidaParaEditar.fecha_vencimiento)
          : null,
      );
      nombreInputRef.current?.setNativeProps({ text: comidaParaEditar.nombre });
      cantidadInputRef.current?.setNativeProps({
        text: comidaParaEditar.cantidad,
      });
      descripcionInputRef.current?.setNativeProps({
        text: comidaParaEditar.descripcion || "",
      });
    } else {
      limpiarFormulario();
    }
  }, [comidaParaEditar, limpiarFormulario]);

  const switchAlimento = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= alimentosRef.current.length) return;

      // 1. Sincronizar valores actuales al item activo actual
      alimentosRef.current[activeIndex] = {
        nombre: nombreRef.current,
        cantidad: cantidadRef.current,
        descripcion: descripcionRef.current,
        fecha_vencimiento: fechaVencimiento ? toLocalISOString(fechaVencimiento) : undefined,
        tags: tagsRef.current
          ? tagsRef.current
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        categoria: alimentosRef.current[activeIndex]?.categoria,
        dias_duracion_estimados:
          alimentosRef.current[activeIndex]?.dias_duracion_estimados,
      };

      // 2. Cambiar al nuevo índice
      const targetFood = alimentosRef.current[newIndex];
      nombreRef.current = targetFood.nombre;
      cantidadRef.current = targetFood.cantidad;
      descripcionRef.current = targetFood.descripcion;
      tagsRef.current = targetFood.tags.join(",");

      // 3. Actualizar text inputs nativamente
      nombreInputRef.current?.setNativeProps({ text: targetFood.nombre });
      cantidadInputRef.current?.setNativeProps({ text: targetFood.cantidad });
      descripcionInputRef.current?.setNativeProps({
        text: targetFood.descripcion,
      });

      // 4. Sincronizar fecha
      setFechaVencimiento(
        targetFood.fecha_vencimiento
          ? parseLocalDate(targetFood.fecha_vencimiento)
          : null,
      );

      setActiveIndex(newIndex);
      setAlimentos([...alimentosRef.current]);
    },
    [activeIndex, fechaVencimiento],
  );

  const agregarAlimento = useCallback(() => {
    // 1. Sincronizar el activo actual
    alimentosRef.current[activeIndex] = {
      nombre: nombreRef.current,
      cantidad: cantidadRef.current,
      descripcion: descripcionRef.current,
      fecha_vencimiento: fechaVencimiento ? toLocalISOString(fechaVencimiento) : undefined,
      tags: tagsRef.current
        ? tagsRef.current
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    // 2. Añadir un nuevo elemento vacío
    const nuevo: AlimentoForm = {
      nombre: "",
      cantidad: "",
      descripcion: "",
      tags: [],
    };
    alimentosRef.current.push(nuevo);

    // 3. Limpiar valores para el nuevo activo
    nombreRef.current = "";
    cantidadRef.current = "";
    descripcionRef.current = "";
    tagsRef.current = "";
    setFechaVencimiento(null);

    nombreInputRef.current?.clear();
    nombreInputRef.current?.setNativeProps({ text: "" });
    cantidadInputRef.current?.clear();
    cantidadInputRef.current?.setNativeProps({ text: "" });
    descripcionInputRef.current?.clear();
    descripcionInputRef.current?.setNativeProps({ text: "" });

    const nextIndex = alimentosRef.current.length - 1;
    setActiveIndex(nextIndex);
    setAlimentos([...alimentosRef.current]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [activeIndex, fechaVencimiento]);

  const eliminarAlimento = useCallback(
    (index: number) => {
      if (alimentosRef.current.length <= 1) return;

      // Sincronizar activo si no se está borrando a sí mismo
      if (index !== activeIndex) {
        alimentosRef.current[activeIndex] = {
          nombre: nombreRef.current,
          cantidad: cantidadRef.current,
          descripcion: descripcionRef.current,
          fecha_vencimiento: fechaVencimiento ? toLocalISOString(fechaVencimiento) : undefined,
          tags: tagsRef.current
            ? tagsRef.current
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          categoria: alimentosRef.current[activeIndex]?.categoria,
          dias_duracion_estimados:
            alimentosRef.current[activeIndex]?.dias_duracion_estimados,
        };
      }

      alimentosRef.current.splice(index, 1);

      // Calcular nuevo activeIndex
      let nextIndex = activeIndex;
      if (activeIndex >= alimentosRef.current.length) {
        nextIndex = alimentosRef.current.length - 1;
      }

      const targetFood = alimentosRef.current[nextIndex];
      nombreRef.current = targetFood.nombre;
      cantidadRef.current = targetFood.cantidad;
      descripcionRef.current = targetFood.descripcion;
      tagsRef.current = targetFood.tags.join(",");

      nombreInputRef.current?.setNativeProps({ text: targetFood.nombre });
      cantidadInputRef.current?.setNativeProps({ text: targetFood.cantidad });
      descripcionInputRef.current?.setNativeProps({
        text: targetFood.descripcion,
      });

      setFechaVencimiento(
        targetFood.fecha_vencimiento
          ? parseLocalDate(targetFood.fecha_vencimiento)
          : null,
      );

      setActiveIndex(nextIndex);
      setAlimentos([...alimentosRef.current]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [activeIndex, fechaVencimiento],
  );

  const rellenarDesdeIA = useCallback((resultado: RES_AnalizarImagenItem[]) => {
    if (!resultado || resultado.length === 0) return;

    const items: AlimentoForm[] = resultado.map((item) => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      descripcion: item.descripcion || "",
      tags: item.tags || [],
      fecha_vencimiento: item.fecha_vencimiento,
      categoria: item.categoria,
      dias_duracion_estimados: item.dias_duracion_estimados,
    }));

    alimentosRef.current = items;
    setActiveIndex(0);
    setAlimentos(items);

    // Cargar primer item en los controles locales
    const first = items[0];
    nombreRef.current = first.nombre;
    cantidadRef.current = first.cantidad;
    descripcionRef.current = first.descripcion;
    tagsRef.current = first.tags.join(",");

    nombreInputRef.current?.setNativeProps({ text: first.nombre });
    cantidadInputRef.current?.setNativeProps({ text: first.cantidad });
    descripcionInputRef.current?.setNativeProps({ text: first.descripcion });

    setFechaVencimiento(
      first.fecha_vencimiento ? parseLocalDate(first.fecha_vencimiento) : null,
    );

    setImagenAnalizada({
      categoria: first.categoria,
      dias_duracion_estimados: first.dias_duracion_estimados,
    });
  }, []);

  const handleAnalizarCamara = useCallback(async () => {
    setMostrarOpcionesFoto(false);
    setTimeout(async () => {
      const resultado = await abrirCamara();
      if (resultado) rellenarDesdeIA(resultado);
    }, 150);
  }, [abrirCamara, rellenarDesdeIA]);

  const handleAnalizarGaleria = useCallback(async () => {
    setMostrarOpcionesFoto(false);
    setTimeout(async () => {
      const resultado = await abrirGaleria();
      if (resultado) rellenarDesdeIA(resultado);
    }, 150);
  }, [abrirGaleria, rellenarDesdeIA]);

  const handleDismiss = useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  const handleSave = useCallback(async () => {
    // Sincronizar el activo actual en ref antes de registrar
    alimentosRef.current[activeIndex] = {
      nombre: nombreRef.current,
      cantidad: cantidadRef.current,
      descripcion: descripcionRef.current,
      fecha_vencimiento: fechaVencimiento ? toLocalISOString(fechaVencimiento) : undefined,
      tags: tagsRef.current
        ? tagsRef.current
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      categoria: alimentosRef.current[activeIndex]?.categoria,
      dias_duracion_estimados:
        alimentosRef.current[activeIndex]?.dias_duracion_estimados,
    };

    // Validar datos de toda la lista
    for (let i = 0; i < alimentosRef.current.length; i++) {
      const food = alimentosRef.current[i];
      if (!food.nombre.trim() || !food.cantidad.trim()) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Toast.show({
          type: "error",
          text1: `Datos incompletos (Alimento #${i + 1})`,
          text2: "Por favor indica el nombre y la cantidad 🍎",
        });
        switchAlimento(i);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let success = false;

      if (comidaParaEditar) {
        const item = alimentosRef.current[0];
        success = await onUpdate({
          id: comidaParaEditar.id,
          nombre: item.nombre.trim(),
          cantidad: item.cantidad.trim(),
          descripcion: item.descripcion.trim() || undefined,
          fecha_vencimiento: item.fecha_vencimiento,
          tags: item.tags || undefined,
        });
        if (success) {
          Toast.show({
            type: "success",
            text1: "¡Actualizado!",
            text2: `${item.nombre.trim()} ha sido actualizado con éxito ✨`,
          });
        }
      } else {
        const payload = alimentosRef.current.map((item) => ({
          nombre: item.nombre.trim(),
          cantidad: item.cantidad.trim(),
          descripcion: item.descripcion.trim() || undefined,
          fecha_vencimiento: item.fecha_vencimiento,
          tags: item.tags,
          estado: EstadoComida.PorConsumir,
        }));

        success = await onRegister(payload);
        if (success) {
          Toast.show({
            type: "success",
            text1: "¡Al inventario!",
            text2:
              payload.length > 1
                ? `${payload.length} alimentos agregados correctamente 🚀`
                : `${payload[0].nombre} se agregó correctamente 🚀`,
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
  }, [
    onRegister,
    onUpdate,
    handleDismiss,
    comidaParaEditar,
    fechaVencimiento,
    limpiarFormulario,
    activeIndex,
    switchAlimento,
  ]);

  const handleNombreChange = useCallback(
    (text: string) => {
      nombreRef.current = text;
      alimentosRef.current[activeIndex].nombre = text;
    },
    [activeIndex],
  );

  const handleCantidadChange = useCallback(
    (text: string) => {
      cantidadRef.current = text;
      alimentosRef.current[activeIndex].cantidad = text;
    },
    [activeIndex],
  );

  const handleDescripcionChange = useCallback(
    (text: string) => {
      descripcionRef.current = text;
      alimentosRef.current[activeIndex].descripcion = text;
    },
    [activeIndex],
  );

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
    // Multi Alimentos
    alimentos,
    activeIndex,
    switchAlimento,
    agregarAlimento,
    eliminarAlimento,
  };
}

import { useState, useEffect, useCallback } from "react";
import { DespensaService } from "../service/despensa.service";
import { RES_Comida } from "../service/despensa.responses";
import {
  REQ_RegistrarComida,
  REQ_ActualizarComida,
} from "../service/despensa.requests";
import * as Haptics from "expo-haptics";

export function useDespensa() {
  const [comidas, setComidas] = useState<RES_Comida[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComidas = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await DespensaService.listarComida();
      if (res && res.success && res.data) {
        setComidas(res.data);
      } else if (!res) {
        console.error("[useDespensa] Servidor no respondió (Respuesta nula)");
      }
    } catch (error) {
      console.error("[useDespensa] Error fetching:", error);
    } finally {
      if (!silent) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchComidas();
  }, [fetchComidas]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchComidas(true);
  }, [fetchComidas]);

  const registrarComida = async (data: REQ_RegistrarComida) => {
    try {
      const res = await DespensaService.registrarComida(data);
      if (res && res.success && res.data) {
        setComidas((prev) => [res.data!, ...prev]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      if (!res) console.error("[useDespensa] Registro: Respuesta nula del servidor");
    } catch (error) {
      console.error("[useDespensa] Error registrar:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return false;
  };

  const actualizarComida = async (data: REQ_ActualizarComida) => {
    try {
      const res = await DespensaService.actualizarComida(data);
      if (res && res.success && res.data) {
        setComidas((prev) =>
          prev.map((c) => (c.id === data.id ? res.data! : c)),
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      if (!res) console.error("[useDespensa] Actualización: Respuesta nula del servidor");
    } catch (error) {
      console.error("[useDespensa] Error actualizar:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return false;
  };

  const eliminarComida = async (id: number) => {
    try {
      const res = await DespensaService.eliminarComida(id);
      if (res && res.success) {
        setComidas((prev) => prev.filter((c) => c.id !== id));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      if (!res) console.error("[useDespensa] Eliminación: Respuesta nula del servidor");
    } catch (error) {
      console.error("[useDespensa] Error eliminar:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return false;
  };

  return {
    comidas,
    isLoading,
    isRefreshing,
    onRefresh,
    registrarComida,
    actualizarComida,
    eliminarComida,
    fetchComidas,
  };
}

import { useState, useMemo } from "react";
import { RES_Comida } from "../service/despensa.responses";
import { useListarDespensa } from "./use-listar-despensa";
import { useRegistroDespensa } from "./use-registro-despensa";
import { useActualizarDespensa } from "./use-actualizar-despensa";
import { useEliminarDespensa } from "./use-eliminar-despensa";

export function useDespensa() {
  const [comidas, setComidas] = useState<RES_Comida[]>([]);

  // Sub-hooks de casos de uso
  const { isLoading, isRefreshing, onRefresh, fetchComidas } =
    useListarDespensa(setComidas);
  const { registrarComida } = useRegistroDespensa(setComidas);
  const { actualizarComida } = useActualizarDespensa(setComidas);
  const { eliminarComida } = useEliminarDespensa(setComidas);

  // Lógica derivada (Computed State)
  const proximosVencimientos = useMemo(() => {
    return comidas.filter((c) => {
      if (!c.fecha_vencimiento) return false;
      const diff =
        new Date(c.fecha_vencimiento).getTime() - new Date().getTime();
      return diff > 0 && diff <= 1000 * 60 * 60 * 24 * 3; // 3 días
    }).length;
  }, [comidas]);

  const totalItems = useMemo(() => comidas.length, [comidas]);

  return {
    // Estado y Datos
    comidas,
    totalItems,
    proximosVencimientos,
    isLoading,
    isRefreshing,
    // Acciones
    onRefresh,
    registrarComida,
    actualizarComida,
    eliminarComida,
    fetchComidas,
  };
}

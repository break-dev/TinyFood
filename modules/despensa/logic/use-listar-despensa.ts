import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { DespensaService } from "../service/despensa.service";
import { RES_Comida } from "../service/despensa.responses";

export function useListarDespensa(
  setComidas: Dispatch<SetStateAction<RES_Comida[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComidas = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      try {
        const res = await DespensaService.listarComida();
        if (res && res.success && res.data) {
          setComidas(res.data);
        } else if (!res) {
          console.error(
            "[useListarDespensa] Servidor no respondió (Respuesta nula)",
          );
        }
      } catch (error) {
        console.error("[useListarDespensa] Error fetching:", error);
      } finally {
        if (!silent) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [setComidas],
  );

  useEffect(() => {
    fetchComidas();
  }, [fetchComidas]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchComidas(true);
  }, [fetchComidas]);

  return {
    isLoading,
    isRefreshing,
    onRefresh,
    fetchComidas,
  };
}

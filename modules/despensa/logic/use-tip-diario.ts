import { useState, useEffect } from 'react';
import { DespensaService } from '../service/despensa.service';
import { RES_TipDiario } from '../service/despensa.responses';

export function useTipDiario(trigger?: number) {
  const [tip, setTip] = useState<RES_TipDiario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTip();
  }, [trigger]); // ← trigger en dependencias para que se recargue

  const cargarTip = async () => {
    try {
      setCargando(true);
      const res = await DespensaService.tipDiario();
      if (res && res.success && res.data) {
        setTip(res.data);
      } else {
        setTip(null);
      }
    } catch (error) {
      console.error('[useTipDiario] Error:', error);
      setTip(null);
    } finally {
      setCargando(false);
    }
  };

  return { tip, cargando };
}
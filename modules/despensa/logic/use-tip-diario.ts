import { useState, useEffect } from 'react';
import { DespensaService } from '../service/despensa.service';
import { RES_TipDiario } from '../service/despensa.responses';
import { useConfigStore } from '@/modules/configuracion/store/config.store';

export function useTipDiario(trigger?: number) {
  const [tip, setTip] = useState<RES_TipDiario | null>(null);
  const [cargando, setCargando] = useState(true);
  
  const recordatorios = useConfigStore((state) => state.recordatorios);
  const avisoDias = useConfigStore((state) => state.avisoDiasCaducidad);

  useEffect(() => {
    if (!recordatorios) {
      setTip(null);
      setCargando(false);
      return;
    }
    cargarTip();
  }, [trigger, recordatorios]);

  const cargarTip = async () => {
    try {
      setCargando(true);
      const res = await DespensaService.tipDiario(avisoDias);
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
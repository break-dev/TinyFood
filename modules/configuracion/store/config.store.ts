import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AparienciaTipo = "claro" | "oscuro" | "sistema";

interface IConfigStore {
  avisoDiasCaducidad: number;
  vibracionHaptics: boolean;
  recordatorios: boolean;
  apariencia: AparienciaTipo;
  
  setAvisoDiasCaducidad: (dias: number) => void;
  setVibracionHaptics: (enabled: boolean) => void;
  setRecordatorios: (enabled: boolean) => void;
  setApariencia: (tema: AparienciaTipo) => void;
}

export const useConfigStore = create<IConfigStore>()(
  persist(
    (set) => ({
      avisoDiasCaducidad: 3,
      vibracionHaptics: true,
      recordatorios: true,
      apariencia: "sistema",
      
      setAvisoDiasCaducidad: (avisoDiasCaducidad) => set({ avisoDiasCaducidad }),
      setVibracionHaptics: (vibracionHaptics) => set({ vibracionHaptics }),
      setRecordatorios: (recordatorios) => set({ recordatorios }),
      setApariencia: (apariencia) => set({ apariencia }),
    }),
    {
      name: "tinyfood-config-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

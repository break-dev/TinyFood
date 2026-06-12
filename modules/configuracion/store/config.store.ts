import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AparienciaTipo = "claro" | "oscuro" | "sistema";

interface IConfigStore {
  avisoDiasCaducidad: number;
  vibracionHaptics: boolean;
  recordatorios: boolean;
  apariencia: AparienciaTipo;
  metaAguaDiaria: number; // en ml
  
  setAvisoDiasCaducidad: (dias: number) => void;
  setVibracionHaptics: (enabled: boolean) => void;
  setRecordatorios: (enabled: boolean) => void;
  setApariencia: (tema: AparienciaTipo) => void;
  setMetaAguaDiaria: (meta: number) => void;
}

export const useConfigStore = create<IConfigStore>()(
  persist(
    (set) => ({
      avisoDiasCaducidad: 3,
      vibracionHaptics: true,
      recordatorios: true,
      apariencia: "sistema",
      metaAguaDiaria: 2000,
      
      setAvisoDiasCaducidad: (avisoDiasCaducidad) => {
        set({ avisoDiasCaducidad });
        import("../../../background-tasks").then(({ updateAllWidgets }) => {
          updateAllWidgets();
        }).catch(e => console.error("Error updating widgets:", e));
      },
      setVibracionHaptics: (vibracionHaptics) => set({ vibracionHaptics }),
      setRecordatorios: (recordatorios) => set({ recordatorios }),
      setApariencia: (apariencia) => set({ apariencia }),
      setMetaAguaDiaria: (metaAguaDiaria) => {
        set({ metaAguaDiaria });
        import("../../../background-tasks").then(({ updateAllWidgets }) => {
          updateAllWidgets();
        }).catch(e => console.error("Error updating widgets:", e));
      },
    }),
    {
      name: "tinyfood-config-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

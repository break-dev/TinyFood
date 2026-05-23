import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RES_Auth } from "@/modules/auth/service/auth.responses";

interface IAuthStore {
  usuario: RES_Auth | null; // Perfil de la base de datos (public.usuario)
  token: string | null; // JWT de Supabase
  isInitialized: boolean;
  isRegistering: boolean; // Flag para evitar spam de autenticación si estamos registrándonos
  setUser: (usuario: RES_Auth | null, token: string | null) => void;
  setInitialized: (value: boolean) => void;
  setRegistering: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isInitialized: false,
      isRegistering: false,
      setUser: (usuario, token) =>
        set({
          usuario,
          token,
          isInitialized: true,
          isRegistering: false, // Ya es usuario
        }),
      setInitialized: (value) => set({ isInitialized: value }),
      setRegistering: (value) => set({ isRegistering: value }),
      logout: () =>
        set({
          usuario: null,
          token: null,
          isInitialized: true,
          isRegistering: false,
        }),
    }),
    {
      name: "tinyfood-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
      }),
    },
  ),
);

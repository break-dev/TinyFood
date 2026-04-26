import { create } from "zustand";
import { RES_Auth } from "@/modules/auth/service/auth.responses";

interface IAuthStore {
  usuario: RES_Auth | null; // Perfil de la base de datos (public.usuario)
  token: string | null; // JWT de Supabase
  isInitialized: boolean;
  setUser: (usuario: RES_Auth | null, token: string | null) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  usuario: null,
  token: null,
  isInitialized: false,
  setUser: (usuario, token) =>
    set({
      usuario,
      token,
      isInitialized: true,
    }),
  setInitialized: (value) => set({ isInitialized: value }),
  logout: () =>
    set({
      usuario: null,
      token: null,
      isInitialized: true, // Ya terminó la verificación inicial
    }),
}));

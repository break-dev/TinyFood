import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null | undefined;
  user: User | null | undefined;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: undefined,
  user: undefined,
  isInitialized: false,
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isInitialized: true,
    }),
}));

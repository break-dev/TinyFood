import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const CHUNK_SIZE = 2048;

/**
 * Adaptador SecureStore con soporte de chunks.
 * Supabase guarda la sesión completa en un solo key, pero SecureStore
 * tiene un límite de 2048 bytes. Este adapter divide el valor en parter.
 */
const SecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    const chunks: string[] = [];
    let index = 0;

    while (true) {
      const chunk = await SecureStore.getItemAsync(`${key}.chunk_${index}`);
      if (chunk === null) break;
      chunks.push(chunk);
      index++;
    }

    if (chunks.length > 0) return chunks.join("");

    // Fallback: intenta leer el key original (compatibilidad con sesiones anteriores)
    return SecureStore.getItemAsync(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    // Elimina chunks anteriores
    let index = 0;
    while ((await SecureStore.getItemAsync(`${key}.chunk_${index}`)) !== null) {
      await SecureStore.deleteItemAsync(`${key}.chunk_${index}`);
      index++;
    }

    // Escribe los nuevos chunks
    const chunks = value.match(new RegExp(`.{1,${CHUNK_SIZE}}`, "g")) ?? [];
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(`${key}.chunk_${i}`, chunks[i]);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    let index = 0;
    while ((await SecureStore.getItemAsync(`${key}.chunk_${index}`)) !== null) {
      await SecureStore.deleteItemAsync(`${key}.chunk_${index}`);
      index++;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

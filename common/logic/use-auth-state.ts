import { useAuthStore } from "../stores/auth.store";

/**
 * Hook para desacoplar la capa de presentación del store de Zustand.
 * Centraliza el acceso al estado de autenticación y sus métodos.
 */
export const useAuthState = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const token = useAuthStore((state) => state.token);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  /**
   * Permite obtener el estado actual fuera del ciclo de renderizado (útil para callbacks)
   */
  const getUsuario = () => useAuthStore.getState().usuario;

  return {
    usuario,
    token,
    isInitialized,
    setUser,
    logout,
    setInitialized,
    getUsuario,
  };
};

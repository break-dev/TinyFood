import axios from "axios";

// Instancia global principal de Axios
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para peticiones
api.interceptors.request.use(
  (request) => {
    // TODO: Obtener del gestor de estados (Zustand) o almacenamiento nativo
    const token = "";
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de expiración de sesión
    if (error.response?.status === 401) {
      console.warn("[API] Sesión expirada o no autorizada");
      // useAuthStore.getState().clearAuth(); // Por ejemplo, limpiar estado
      // useUIStore.getState().notifyError(message);
    }
    return Promise.reject(error);
  },
);

export { api };

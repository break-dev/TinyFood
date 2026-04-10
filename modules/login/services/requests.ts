export interface LoginRequest {
  email?: string;
  password?: string;
  token?: string; // Para OAuth (Google)
}

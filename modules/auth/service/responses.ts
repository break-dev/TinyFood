export interface AuthResponseData {
  userId: string;
  email: string;
  accessToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: AuthResponseData;
}

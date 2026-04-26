import { ApiResponse } from "../service/common.responses";

export function successResponse<T>(
  data?: T | null,
  message?: string,
): ApiResponse<T> {
  return { success: true, data: data ?? null, message: message ?? null };
}

export function errorResponse<T>(
  message?: string,
  data?: T | null,
): ApiResponse<T> {
  return { success: false, data: data ?? null, message: message ?? null };
}

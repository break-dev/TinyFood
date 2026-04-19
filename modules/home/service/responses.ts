export interface HomeItemData {
  id: string;
  title: string;
  value: string;
  trend: string;
}

export interface HomeResponse {
  success: boolean;
  message: string;
  data?: {
    user: string;
    metrics: HomeItemData[];
  };
  error?: string;
}

export interface ApiRequest<T> {
  event: string;
  body: T;
  token?: string;
}

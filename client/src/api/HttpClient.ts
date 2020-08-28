export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: Data): Promise<T>;
}

export type Data = Record<string, any>;
export type HttpMethod = keyof HttpClient;

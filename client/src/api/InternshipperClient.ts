import { HttpMethod, Data, HttpClient } from "./HttpClient";

export interface RequestProps {
  method: HttpMethod;
  body?: Data;
}

export class InternshipperClient implements HttpClient {
  private static readonly defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  public async get<T>(path: string) {
    return await this.request<T>(path, { method: "get" });
  }

  public async post<T>(path: string, body: Data) {
    return await this.request<T>(path, { method: "post", body });
  }

  private async request<T>(path: string, props: RequestProps): Promise<T> {
    const req = await fetch(path, {
      credentials: "same-origin",
      headers: InternshipperClient.defaultHeaders,
      body: props.body && JSON.stringify(props.body),
      method: props.method,
    });
    const response = await req.json();
    if (!req.ok) {
      throw new Error(response.detail);
    }
    return response;
  }
}

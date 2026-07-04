// Thin HTTP infrastructure client. Knows nothing about the domain — it only
// speaks JSON/form-data over `fetch`. Business/service code depends on the
// `IHttpClient` interface so it can be swapped or mocked in tests.

export interface HttpFormResult<T> {
  ok: boolean;
  status: number;
  data: T;
}

export interface IHttpClient {
  getJson<T>(path: string): Promise<T>;
  postJson<T>(path: string, body?: unknown): Promise<T>;
  postForm<T>(path: string, form: FormData): Promise<HttpFormResult<T>>;
  delete(path: string): Promise<void>;
}

export class HttpClient implements IHttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getJson<T>(path: string): Promise<T> {
    const res = await fetch(this.baseUrl + path);
    return (await res.json()) as T;
  }

  async postJson<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    return (await res.json()) as T;
  }

  async postForm<T>(path: string, form: FormData): Promise<HttpFormResult<T>> {
    const res = await fetch(this.baseUrl + path, {
      method: "POST",
      body: form,
    });
    const data = (await res.json().catch(() => ({}))) as T;
    return { ok: res.ok, status: res.status, data };
  }

  async delete(path: string): Promise<void> {
    await fetch(this.baseUrl + path, { method: "DELETE" });
  }
}

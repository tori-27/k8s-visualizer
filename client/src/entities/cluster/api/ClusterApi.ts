import type { IHttpClient } from "../../../shared/api/HttpClient";

export interface ConnectResult {
  ok: boolean;
  error?: string;
}

// Business-facing adapter over the cluster HTTP endpoints. Depends on the
// `IHttpClient` interface, not on `fetch` directly, so callers stay decoupled
// from the transport.
export interface IClusterApi {
  connect(file: File): Promise<ConnectResult>;
  disconnect(): Promise<void>;
  getNamespaces(): Promise<string[]>;
  switchNamespace(namespace: string): Promise<void>;
}

export class ClusterApi implements IClusterApi {
  private readonly http: IHttpClient;

  constructor(http: IHttpClient) {
    this.http = http;
  }

  async connect(file: File): Promise<ConnectResult> {
    const form = new FormData();
    form.append("file", file);

    const res = await this.http.postForm<{ error?: string }>(
      "/api/cluster/connect",
      form,
    );
    if (!res.ok) {
      return {
        ok: false,
        error: res.data.error ?? `Connection failed (${res.status})`,
      };
    }
    return { ok: true };
  }

  async disconnect(): Promise<void> {
    await this.http.delete("/api/cluster/disconnect");
  }

  async getNamespaces(): Promise<string[]> {
    const data = await this.http.getJson<{ ok: boolean; data: string[] }>(
      "/api/cluster/namespaces",
    );
    return data.ok ? data.data : [];
  }

  async switchNamespace(namespace: string): Promise<void> {
    await this.http.postJson("/api/cluster/namespace", { namespace });
  }
}

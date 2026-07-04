import type { IHttpClient } from "../../../shared/api/HttpClient";
import type { K8sResource } from "../../cluster/model/cluster.types";

export interface ProviderInfo {
  provider: string;
  model: string;
}

export interface ExplainResult {
  ok: boolean;
  explanation: string;
}

export interface AnalyzeResult {
  ok: boolean;
  analysis: string;
}

// Adapter over the AI HTTP endpoints. The store depends on this interface, so
// the LLM transport can be mocked without touching business logic.
export interface IAiApi {
  explain(resource: K8sResource): Promise<ExplainResult>;
  analyze(): Promise<AnalyzeResult>;
  getProviderInfo(): Promise<ProviderInfo>;
}

export class AiApi implements IAiApi {
  private readonly http: IHttpClient;

  constructor(http: IHttpClient) {
    this.http = http;
  }

  explain(resource: K8sResource): Promise<ExplainResult> {
    return this.http.postJson<ExplainResult>("/api/ai/explain", { resource });
  }

  analyze(): Promise<AnalyzeResult> {
    return this.http.postJson<AnalyzeResult>("/api/ai/analyze", {});
  }

  getProviderInfo(): Promise<ProviderInfo> {
    return this.http.getJson<ProviderInfo>("/api/ai/status");
  }
}

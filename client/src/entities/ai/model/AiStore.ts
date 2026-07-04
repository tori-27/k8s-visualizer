import { makeAutoObservable, runInAction } from "mobx";
import type { K8sResource } from "../../cluster/model/cluster.types";
import type { IAiApi, ProviderInfo } from "../api/AiApi";

// Scoped store for AI features. Holds request state and delegates all network
// work to the injected `IAiApi`, keeping transport concerns out of the store.
export class AiStore {
  explainLoading = false;
  analyzeLoading = false;
  explanation: string | null = null;
  analysis: string | null = null;
  error: string | null = null;
  providerInfo: ProviderInfo | null = null;
  private readonly api: IAiApi;

  constructor(api: IAiApi) {
    // Make the state observable first; deps assigned afterwards stay plain
    // (non-observable) fields, which is what we want for injected services.
    makeAutoObservable(this);
    this.api = api;
  }

  async explainResource(resource: K8sResource): Promise<void> {
    this.explainLoading = true;
    this.error = null;
    try {
      const data = await this.api.explain(resource);
      runInAction(() => {
        if (data.ok) {
          this.explanation = data.explanation;
        } else {
          this.error = "Failed to get explanation.";
        }
      });
    } catch {
      runInAction(() => {
        this.error = "Network error while fetching explanation.";
      });
    } finally {
      runInAction(() => {
        this.explainLoading = false;
      });
    }
  }

  async analyzeCluster(): Promise<void> {
    this.analyzeLoading = true;
    this.error = null;
    try {
      const data = await this.api.analyze();
      runInAction(() => {
        if (data.ok) {
          this.analysis = data.analysis;
        } else {
          this.error = "Failed to get analysis.";
        }
      });
    } catch {
      runInAction(() => {
        this.error = "Network error while fetching analysis.";
      });
    } finally {
      runInAction(() => {
        this.analyzeLoading = false;
      });
    }
  }

  async fetchProviderInfo(): Promise<void> {
    try {
      const info = await this.api.getProviderInfo();
      runInAction(() => {
        this.providerInfo = info;
      });
    } catch {
      // provider info is non-critical, silently ignore
    }
  }

  clearExplanation(): void {
    this.explanation = null;
    this.error = null;
  }

  clearAnalysis(): void {
    this.analysis = null;
  }
}

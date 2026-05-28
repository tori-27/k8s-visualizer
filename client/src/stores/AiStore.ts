import { makeAutoObservable, runInAction } from 'mobx';
import type { K8sResource } from '../types/cluster.types';

class AiStore {
  explainLoading = false;
  analyzeLoading = false;
  explanation: string | null = null;
  analysis: string | null = null;
  error: string | null = null;
  providerInfo: { provider: string; model: string } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async explainResource(resource: K8sResource): Promise<void> {
    this.explainLoading = true;
    this.error = null;
    try {
      const res = await fetch('http://localhost:3001/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource }),
      });
      const data = (await res.json()) as { ok: boolean; explanation: string };
      runInAction(() => {
        if (data.ok) {
          this.explanation = data.explanation;
        } else {
          this.error = 'Failed to get explanation.';
        }
      });
    } catch {
      runInAction(() => {
        this.error = 'Network error while fetching explanation.';
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
      const res = await fetch('http://localhost:3001/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { ok: boolean; analysis: string };
      runInAction(() => {
        if (data.ok) {
          this.analysis = data.analysis;
        } else {
          this.error = 'Failed to get analysis.';
        }
      });
    } catch {
      runInAction(() => {
        this.error = 'Network error while fetching analysis.';
      });
    } finally {
      runInAction(() => {
        this.analyzeLoading = false;
      });
    }
  }

  async fetchProviderInfo(): Promise<void> {
    try {
      const res = await fetch('http://localhost:3001/api/ai/status');
      const data = (await res.json()) as { provider: string; model: string };
      runInAction(() => {
        this.providerInfo = data;
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

export const aiStore = new AiStore();

import * as k8s from "@kubernetes/client-node";

export class ClusterService {
  private kc: k8s.KubeConfig | null = null;
  private connected = false;

  connectFromFile(kubeconfigContent: string): void {
    if (this.connected) {
      this.disconnect();
    }

    this.kc = new k8s.KubeConfig();
    this.kc.loadFromString(kubeconfigContent);

    const cluster = this.kc.getCurrentCluster();
    if (!cluster?.server) {
      throw new Error("No cluster found in provided kubeconfig");
    }

    this.connected = true;
  }

  disconnect(): void {
    this.kc = null;
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getClusterInfo(): { name: string; server: string } | null {
    if (!this.kc) return null;

    const cluster = this.kc.getCurrentCluster();
    const context = this.kc.getCurrentContext();

    return {
      name: context ?? "unknown",
      server: cluster?.server ?? "unknown",
    };
  }
}

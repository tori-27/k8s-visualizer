import { makeAutoObservable } from "mobx";
import {
  ResourceType,
  type ClusterSnapshot,
  type ConnectionStatus,
  type K8sResource,
  type WsMessage,
} from "./cluster.types";

// Pure domain model of the cluster. It owns observable resource state and the
// rules for mutating it, but has *no* dependency on infrastructure: it never
// touches the socket, `fetch`, or the DOM. Messages arrive via `applyMessage`,
// which the composition root feeds from the socket. This keeps the entity a
// scoped store (cluster-only) rather than an app-wide god store.
export class ClusterStore {
  pods = new Map<string, K8sResource>();
  nodes = new Map<string, K8sResource>();
  services = new Map<string, K8sResource>();
  deployments = new Map<string, K8sResource>();
  replicasets = new Map<string, K8sResource>();

  connectionStatus: ConnectionStatus = "disconnected";
  currentNamespace = "default";
  namespaces: string[] = [];
  selectedResource: K8sResource | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  applyMessage(message: WsMessage): void {
    switch (message.type) {
      case "snapshot":
        this.applySnapshot(message.data);
        break;
      case "resource.added":
      case "resource.modified":
        this.upsertResource(message.resource);
        break;
      case "resource.deleted":
        this.deleteResource(message.resource);
        break;
      case "connection.status":
        this.connectionStatus = message.status;
        break;
    }
  }

  selectResource(resource: K8sResource | null): void {
    this.selectedResource = resource;
  }

  setNamespaces(namespaces: string[]): void {
    this.namespaces = namespaces;
  }

  setCurrentNamespace(namespace: string): void {
    this.currentNamespace = namespace;
  }

  setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
  }

  get isConnected(): boolean {
    return this.connectionStatus === "connected";
  }

  get allResources(): K8sResource[] {
    return [
      ...this.pods.values(),
      ...this.nodes.values(),
      ...this.services.values(),
      ...this.deployments.values(),
      ...this.replicasets.values(),
    ];
  }

  get resourceCount(): number {
    return (
      this.pods.size +
      this.nodes.size +
      this.services.size +
      this.deployments.size +
      this.replicasets.size
    );
  }

  private applySnapshot(snapshot: ClusterSnapshot): void {
    this.pods.clear();
    this.nodes.clear();
    this.services.clear();
    this.deployments.clear();
    this.replicasets.clear();

    // Arrays are guarded because the backend snapshot payload is not guaranteed
    // to include every collection (e.g. it omits replicasets).
    (snapshot.pods ?? []).forEach((p) => this.pods.set(p.id, p));
    (snapshot.nodes ?? []).forEach((n) => this.nodes.set(n.id, n));
    (snapshot.services ?? []).forEach((s) => this.services.set(s.id, s));
    (snapshot.deployments ?? []).forEach((d) => this.deployments.set(d.id, d));
    (snapshot.replicasets ?? []).forEach((r) => this.replicasets.set(r.id, r));
  }

  private upsertResource(resource: K8sResource): void {
    const map = this.mapFor(resource.resourceType);
    if (map) map.set(resource.id, resource);
  }

  private deleteResource(resource: K8sResource): void {
    const map = this.mapFor(resource.resourceType);
    if (map) map.delete(resource.id);
  }

  private mapFor(type: ResourceType): Map<string, K8sResource> | undefined {
    switch (type) {
      case ResourceType.Pod:
        return this.pods;
      case ResourceType.Node:
        return this.nodes;
      case ResourceType.Service:
        return this.services;
      case ResourceType.Deployment:
        return this.deployments;
      case ResourceType.ReplicaSet:
        return this.replicasets;
      default:
        return undefined;
    }
  }
}

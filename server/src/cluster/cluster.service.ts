import { EventEmitter } from "events";
import * as k8s from "@kubernetes/client-node";
import {
  ClusterSnapshot,
  ResourceEvent,
  ResourceType,
} from "./cluster.types.js";
import { WATCHED_RESOURCES } from "./cluster.config.js";
import { normalizeResource } from "./cluster.normalizer.js";
import { AppError, AppErrorCode } from "../errors.js";

export class ClusterService extends EventEmitter {
  private kc: k8s.KubeConfig | null = null;
  private watches: AbortController[] = [];
  private connected = false;
  private currentNamespace: string = "default";

  connectFromFile(kubeconfigContent: string): void {
    if (this.connected) {
      this.disconnect();
    }
    try {
      this.kc = new k8s.KubeConfig();
      this.kc.loadFromString(kubeconfigContent);
    } catch {
      throw new AppError(
        AppErrorCode.INVALID_KUBECONFIG,
        "Invalid kubeconfig format",
        400,
      );
    }

    const cluster = this.kc.getCurrentCluster();
    if (!cluster?.server) {
      throw new Error("No cluster found in provided kubeconfig");
    }

    this.connected = true;
    this.emit("connection.status", { status: "connected" });
    this.startWatches("default");
  }

  disconnect(): void {
    this.stopWatches();
    this.kc = null;
    this.connected = false;
    this.emit("connection.status", { status: "disconnected" });
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

  async getSnapshot(
    namespace: string = this.currentNamespace,
  ): Promise<ClusterSnapshot> {
    if (!this.kc) throw new Error("Not connected");

    const coreApi = this.kc.makeApiClient(k8s.CoreV1Api);

    const [podsRes, nodesRes, servicesRes] = await Promise.all([
      namespace === "all"
        ? coreApi.listPodForAllNamespaces()
        : coreApi.listNamespacedPod({ namespace }),
      coreApi.listNode(),
      namespace === "all"
        ? coreApi.listServiceForAllNamespaces()
        : coreApi.listNamespacedService({ namespace }),
    ]);

    return {
      pods: podsRes.items.map((obj) =>
        normalizeResource(ResourceType.Pod, obj),
      ),
      nodes: nodesRes.items.map((obj) =>
        normalizeResource(ResourceType.Node, obj),
      ),
      services: servicesRes.items.map((obj) =>
        normalizeResource(ResourceType.Service, obj),
      ),
      deployments: servicesRes.items.map((obj) =>
        normalizeResource(ResourceType.Deployment, obj),
      ),
      replicasents: servicesRes.items.map((obj) =>
        normalizeResource(ResourceType.ReplicaSet, obj),
      ),
    };
  }

  async getNamespaces(): Promise<string[]> {
    if (!this.kc) {
      throw new AppError(
        AppErrorCode.CLUSTER_NOT_CONNECTED,
        "No cluster connected",
        503,
      );
    }

    const coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
    const res = await coreApi.listNamespace();

    return res.items.map((ns) => ns.metadata?.name ?? "").filter(Boolean);
  }

  switchNamespace(namespace: string): void {
    this.currentNamespace = namespace;
    this.stopWatches();
    this.startWatches(namespace);
    this.emit("namespace.changed", { namespace });
  }

  getCurrentNamespace(): string {
    return this.currentNamespace;
  }

  private startWatches(namespace: string): void {
    if (!this.kc) return;

    for (const { path, resourceType } of WATCHED_RESOURCES) {
      const watchPath = this.buildWatchPath(path, namespace);
      this.watchResource(watchPath, resourceType);
    }
  }

  private stopWatches(): void {
    this.watches.forEach((w) => w.abort());
    this.watches = [];
  }

  private buildWatchPath(basePath: string, namespace: string): string {
    if (basePath.includes("nodes")) return basePath;
    return basePath.replace("/api/v1/", `/api/v1/namespaces/${namespace}/`);
  }

  private watchResource(path: string, resourceType: ResourceType): void {
    if (!this.kc) return;

    const watch = new k8s.Watch(this.kc);

    const startWatch = async () => {
      const controller = await watch.watch(
        path,
        {},
        (type, obj) => this.onEvent(type, obj, resourceType),
        (error) => this.onWatchError(error, resourceType, startWatch),
      );
      this.watches.push(controller);
    };

    startWatch();
  }

  private onEvent(type: string, obj: any, resourceType: ResourceType): void {
    if (!["ADDED", "MODIFIED", "DELETED"].includes(type)) return;

    const event: ResourceEvent = {
      type: type as ResourceEvent["type"],
      resource: normalizeResource(resourceType, obj),
    };

    this.emit("resource.event", event);
  }

  private onWatchError(
    error: Error,
    resourceType: ResourceType,
    startWatch: () => void,
  ): void {
    if (!this.connected) return;

    this.emit("watch.error", { resourceType, error: error?.message });

    setTimeout(() => {
      if (this.connected) startWatch();
    }, 5000);
  }
}

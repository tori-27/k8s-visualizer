import { makeAutoObservable, runInAction } from "mobx";
import type { IClusterApi } from "../../../entities/cluster/api/ClusterApi";
import type { ClusterStore } from "../../../entities/cluster/model/ClusterStore";
import type { IClusterSocket } from "../../../shared/infrastructure/ClusterSocket";

// Feature store that owns the connect/disconnect flow and its transient form
// state. It orchestrates the infrastructure (api + socket) and updates the
// cluster entity, but does so through injected dependencies — nothing here
// imports a concrete client or a global singleton.
export class ConnectClusterStore {
  selectedFile: File | null = null;
  isConnecting = false;
  error: string | null = null;

  private readonly api: IClusterApi;
  private readonly socket: IClusterSocket;
  private readonly cluster: ClusterStore;

  constructor(api: IClusterApi, socket: IClusterSocket, cluster: ClusterStore) {
    // Observe state first; injected deps assigned afterwards stay plain fields.
    makeAutoObservable(this);
    this.api = api;
    this.socket = socket;
    this.cluster = cluster;
  }

  setFile(file: File): void {
    this.selectedFile = file;
    this.error = null;
  }

  async connect(): Promise<void> {
    const file = this.selectedFile;
    if (!file) return;

    this.isConnecting = true;
    this.error = null;
    try {
      const result = await this.api.connect(file);
      if (!result.ok) throw new Error(result.error);

      this.socket.connect();
      const namespaces = await this.api.getNamespaces();
      runInAction(() => this.cluster.setNamespaces(namespaces));
    } catch (e) {
      runInAction(() => {
        this.error = (e as Error).message;
        this.selectedFile = null;
      });
    } finally {
      runInAction(() => {
        this.isConnecting = false;
      });
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.api.disconnect();
    } catch {
      // best-effort; tear down the client side regardless
    }
    this.socket.disconnect();
    runInAction(() => {
      this.selectedFile = null;
      this.error = null;
    });
    this.cluster.selectResource(null);
  }
}

import { API_BASE_URL, WS_URL } from "../../shared/config";
import { HttpClient } from "../../shared/api/HttpClient";
import { ClusterSocket } from "../../shared/infrastructure/ClusterSocket";
import { ClusterApi, type IClusterApi } from "../../entities/cluster/api/ClusterApi";
import { ClusterStore } from "../../entities/cluster/model/ClusterStore";
import { parseWsMessage } from "../../entities/cluster/lib/parseMessage";
import { AiApi } from "../../entities/ai/api/AiApi";
import { AiStore } from "../../entities/ai/model/AiStore";
import { ConnectClusterStore } from "../../features/connect-cluster/model/ConnectClusterStore";
import { GraphViewStore } from "../../widgets/cluster-graph/model/GraphViewStore";
import { AppMediator } from "../AppMediator";

export interface AppRoot {
  clusterStore: ClusterStore;
  clusterApi: IClusterApi;
  aiStore: AiStore;
  connectStore: ConnectClusterStore;
  graphStore: GraphViewStore;
  mediator: AppMediator;
}

// The composition root: the one place that instantiates infrastructure, wires
// it to the domain, and constructs the scoped stores. This is where all the
// dependency injection happens, so nothing below the app layer imports a
// concrete client or a global singleton.
export function createAppRoot(): AppRoot {
  // --- Infrastructure ---
  const http = new HttpClient(API_BASE_URL);
  const socket = new ClusterSocket(WS_URL);
  const clusterApi = new ClusterApi(http);
  const aiApi = new AiApi(http);

  // --- Domain stores ---
  const clusterStore = new ClusterStore();
  const aiStore = new AiStore(aiApi);
  const connectStore = new ConnectClusterStore(clusterApi, socket, clusterStore);
  const graphStore = new GraphViewStore(clusterStore);

  // --- Infrastructure -> domain bridge ---
  // The socket only moves raw strings; parsing and dispatch happen here so the
  // store stays free of transport concerns.
  socket.onMessage((raw) => {
    const message = parseWsMessage(raw);
    if (message) clusterStore.applyMessage(message);
  });
  socket.onClose(() => clusterStore.setConnectionStatus("disconnected"));

  // --- Cross-store coordination ---
  const mediator = new AppMediator();
  mediator.registerCluster(clusterStore);
  mediator.registerAi(aiStore);
  mediator.init();

  // --- Initial data ---
  void aiStore.fetchProviderInfo();

  return { clusterStore, clusterApi, aiStore, connectStore, graphStore, mediator };
}

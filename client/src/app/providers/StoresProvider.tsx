import type { ReactNode } from "react";
import type { AppRoot } from "../composition/createAppRoot";
import { ClusterStoreContext } from "../../entities/cluster/model/clusterContext";
import { ClusterApiContext } from "../../entities/cluster/api/clusterApiContext";
import { AiStoreContext } from "../../entities/ai/model/aiContext";
import { ConnectStoreContext } from "../../features/connect-cluster/model/connectContext";
import { GraphStoreContext } from "../../widgets/cluster-graph/model/graphContext";

interface StoresProviderProps {
  root: AppRoot;
  children: ReactNode;
}

// Provides each scoped store through its own context. Components pull exactly
// the store they need via the matching `useX` hook — no prop drilling, and no
// single omniscient context object leaking everything everywhere.
export default function StoresProvider({ root, children }: StoresProviderProps) {
  return (
    <ClusterStoreContext.Provider value={root.clusterStore}>
      <ClusterApiContext.Provider value={root.clusterApi}>
        <AiStoreContext.Provider value={root.aiStore}>
          <ConnectStoreContext.Provider value={root.connectStore}>
            <GraphStoreContext.Provider value={root.graphStore}>
              {children}
            </GraphStoreContext.Provider>
          </ConnectStoreContext.Provider>
        </AiStoreContext.Provider>
      </ClusterApiContext.Provider>
    </ClusterStoreContext.Provider>
  );
}

import { observer } from "mobx-react-lite";
import { useClusterStore } from "../../entities/cluster/model/clusterContext";
import NamespaceSelector from "../select-namespace/NamespaceSelector";
import { useConnectStore } from "./model/connectContext";
import ConnectedStatus from "./ui/ConnectedStatus";
import ClusterStats from "./ui/ClusterStats";
import DisconnectButton from "./ui/DisconnectButton";

// Business component for the connected state: derives the stat rows from the
// cluster store and composes status/stats/namespace/disconnect.
const ConnectedView = observer(() => {
  const cluster = useClusterStore();
  const connect = useConnectStore();

  const stats = [
    { label: "Nodes", value: cluster.nodes.size },
    { label: "Pods", value: cluster.pods.size },
    { label: "Services", value: cluster.services.size },
    { label: "Deployments", value: cluster.deployments.size },
  ];

  return (
    <>
      <ConnectedStatus />
      <ClusterStats stats={stats} />
      <NamespaceSelector />
      <DisconnectButton onClick={() => connect.disconnect()} />
    </>
  );
});

export default ConnectedView;

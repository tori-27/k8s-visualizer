import { observer } from "mobx-react-lite";
import { useClusterStore } from "../../entities/cluster/model/clusterContext";
import ClusterGraph from "../../widgets/cluster-graph/ClusterGraph";
import AnalyzeButton from "../../features/analyze-cluster/AnalyzeButton";
import EmptyState from "./ui/EmptyState";

// Business component: gates the graph vs. the empty state on connection status
// and overlays the analyze action.
const GraphArea = observer(() => {
  const cluster = useClusterStore();

  return (
    <main className="flex-1 overflow-hidden relative bg-bg">
      {cluster.isConnected ? <ClusterGraph /> : <EmptyState />}
      <AnalyzeButton />
    </main>
  );
});

export default GraphArea;

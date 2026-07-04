import { observer } from "mobx-react-lite";
import { type Node } from "reactflow";
import { useClusterStore } from "../../entities/cluster/model/clusterContext";
import { useGraphStore } from "./model/graphContext";
import GraphCanvas from "./ui/GraphCanvas";
import type { NodeData } from "./ui/nodes/nodeTypes";

// Business component: reads the derived graph view state and translates node
// clicks into a domain selection. Rendering is delegated to GraphCanvas.
const ClusterGraph = observer(() => {
  const cluster = useClusterStore();
  const graph = useGraphStore();

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    cluster.selectResource((node.data as NodeData).resource);
  };

  return (
    <GraphCanvas
      nodes={graph.nodes}
      edges={graph.edges}
      onNodesChange={graph.onNodesChange}
      onEdgesChange={graph.onEdgesChange}
      onNodeClick={handleNodeClick}
    />
  );
});

export default ClusterGraph;

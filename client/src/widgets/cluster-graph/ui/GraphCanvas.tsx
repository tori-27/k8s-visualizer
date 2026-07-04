import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeChange,
  type EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import "../../../styles/reactflow.css";
import K8sNodeCard from "./nodes/K8sNodeCard";
import PodCard from "./nodes/PodCard";
import ServiceCard from "./nodes/ServiceCard";
import type { NodeData } from "./nodes/nodeTypes";

const nodeTypes: NodeTypes = {
  k8sNode: K8sNodeCard,
  pod: PodCard,
  service: ServiceCard,
};

interface GraphCanvasProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
}

// UI: the ReactFlow canvas. Receives fully-prepared nodes/edges and forwards
// interaction callbacks. No store access, no layout math.
export default function GraphCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
}: GraphCanvasProps) {
  return (
    <div className="rf-wrapper w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
      >
        <Background variant={BackgroundVariant.Dots} color="#1e2235" gap={24} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "pod") return "#22c55e";
            if (n.type === "service") return "#4f9cf9";
            return "#4a5568";
          }}
          maskColor="rgba(15, 17, 23, 0.75)"
          style={{ background: "#1a1d27" }}
        />
      </ReactFlow>
    </div>
  );
}

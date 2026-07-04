import { Handle, Position, type NodeProps } from "reactflow";
import { getStatusColor } from "../../../../entities/cluster/lib/status";
import type { NodeData } from "./nodeTypes";

// UI: a pod card rendered inside the graph.
export default function PodCard({ data }: NodeProps<NodeData>) {
  const { resource } = data;
  const color = getStatusColor(resource.status);

  return (
    <div className="bg-surface border-[1.5px] border-border-strong rounded-md px-[10px] py-2 w-[160px] shadow-card cursor-pointer transition-colors duration-150 hover:border-border-node">
      <Handle type="source" position={Position.Top} className="opacity-0 pointer-events-none" />
      <div className="node-header">
        <span className="status-dot" style={{ background: color }} />
        <span className="type-tag">Pod</span>
      </div>
      <div className="node-name">{resource.name}</div>
      {resource.namespace && (
        <div className="text-xxs text-text-muted mt-[2px]">{resource.namespace}</div>
      )}
    </div>
  );
}

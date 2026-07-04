import { Handle, Position, type NodeProps } from "reactflow";
import { getStatusColor } from "../../../../entities/cluster/lib/status";
import type { NodeData } from "./nodeTypes";

type RawNode = {
  status?: { addresses?: Array<{ type: string; address: string }> };
};

// UI: a Kubernetes node card rendered inside the graph.
export default function K8sNodeCard({ data }: NodeProps<NodeData>) {
  const { resource } = data;
  const color = getStatusColor(resource.status);
  const raw = resource.raw as RawNode;
  const ip = raw.status?.addresses?.find((a) => a.type === "InternalIP")?.address;

  return (
    <div className="bg-surface border-[1.5px] border-border-strong rounded-lg px-[14px] py-3 w-[340px] min-h-[100px] shadow-node cursor-pointer transition-colors duration-150 hover:border-border-node">
      <Handle type="target" position={Position.Bottom} className="opacity-0 pointer-events-none" />
      <div className="node-header">
        <span className="status-dot" style={{ background: color }} />
        <span className="type-tag">Node</span>
      </div>
      <div className="node-name">{resource.name}</div>
      <div className="text-11 text-text-secondary" style={{ color }}>
        {resource.status}
      </div>
      {ip && (
        <div className="node-meta">
          <div className="node-meta-row">
            <span className="text-text-muted">IP</span>
            <span className="text-text-secondary max-w-[180px] truncate">{ip}</span>
          </div>
        </div>
      )}
    </div>
  );
}

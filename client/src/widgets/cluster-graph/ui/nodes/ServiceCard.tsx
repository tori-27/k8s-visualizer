import { type NodeProps } from "reactflow";
import type { NodeData } from "./nodeTypes";

type RawService = {
  spec?: { type?: string; clusterIP?: string };
};

// UI: a service card rendered inside the graph.
export default function ServiceCard({ data }: NodeProps<NodeData>) {
  const { resource } = data;
  const raw = resource.raw as RawService;
  const svcType = raw.spec?.type ?? "ClusterIP";
  const clusterIP = raw.spec?.clusterIP;

  return (
    <div className="bg-surface border-[1.5px] border-[#1e3a5f] rounded-md px-3 py-[10px] w-[200px] shadow-card cursor-pointer transition-colors duration-150 hover:border-primary relative">
      {/* Left accent bar — positional, not expressible with Tailwind alone */}
      <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-[2px]" />
      <div className="node-header pl-2">
        <span className="status-dot" style={{ background: "#4f9cf9" }} />
        <span className="type-tag">Service</span>
      </div>
      <div className="node-name pl-2">{resource.name}</div>
      {resource.namespace && (
        <div className="text-xxs text-text-muted mt-[2px] pl-2">{resource.namespace}</div>
      )}
      <div className="node-meta pl-2">
        <div className="node-meta-row">
          <span className="text-text-muted">Type</span>
          <span className="text-text-secondary max-w-[180px] truncate">{svcType}</span>
        </div>
        {clusterIP && clusterIP !== "None" && (
          <div className="node-meta-row">
            <span className="text-text-muted">ClusterIP</span>
            <span className="text-text-secondary max-w-[180px] truncate">{clusterIP}</span>
          </div>
        )}
      </div>
    </div>
  );
}

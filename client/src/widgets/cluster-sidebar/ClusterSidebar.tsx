import ConnectPanel from "../../features/connect-cluster/ConnectPanel";
import AiProviderBadge from "./AiProviderBadge";

// Compositional widget: the left sidebar. Assembles the connect panel and the
// AI provider footer inside the aside shell. No logic of its own.
export default function ClusterSidebar() {
  return (
    <aside className="w-[280px] flex-shrink-0 bg-surface-deep border-r border-border flex flex-col overflow-hidden">
      <ConnectPanel />
      <AiProviderBadge />
    </aside>
  );
}

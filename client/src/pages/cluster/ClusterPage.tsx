import ClusterSidebar from "../../widgets/cluster-sidebar/ClusterSidebar";
import ResourceDetails from "../../widgets/resource-details/ResourceDetails";
import AnalysisModal from "../../features/analyze-cluster/AnalysisModal";
import GraphArea from "./GraphArea";

// Compositional page: assembles the top-level screen from widgets and features.
// No styling logic or business rules of its own beyond the layout shell.
export default function ClusterPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      <ClusterSidebar />
      <GraphArea />
      <ResourceDetails />
      <AnalysisModal />
    </div>
  );
}

import { observer } from "mobx-react-lite";
import { useClusterStore } from "../../entities/cluster/model/clusterContext";
import { useAiStore } from "../../entities/ai/model/aiContext";
import AnalyzeButtonView from "./ui/AnalyzeButtonView";

// Business component: shows the analyze action only while connected and drives
// the AI store.
const AnalyzeButton = observer(() => {
  const cluster = useClusterStore();
  const ai = useAiStore();

  if (!cluster.isConnected) return null;

  return (
    <AnalyzeButtonView
      loading={ai.analyzeLoading}
      onClick={() => ai.analyzeCluster()}
    />
  );
});

export default AnalyzeButton;

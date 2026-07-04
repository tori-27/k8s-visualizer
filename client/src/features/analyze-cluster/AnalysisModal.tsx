import { observer } from "mobx-react-lite";
import { useAiStore } from "../../entities/ai/model/aiContext";
import AnalysisModalView from "./ui/AnalysisModalView";

// Business component: renders the analysis modal when an analysis is available.
const AnalysisModal = observer(() => {
  const ai = useAiStore();

  if (!ai.analysis) return null;

  return (
    <AnalysisModalView analysis={ai.analysis} onClose={() => ai.clearAnalysis()} />
  );
});

export default AnalysisModal;

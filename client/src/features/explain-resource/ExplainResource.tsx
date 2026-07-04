import { observer } from "mobx-react-lite";
import type { K8sResource } from "../../entities/cluster/model/cluster.types";
import { useAiStore } from "../../entities/ai/model/aiContext";
import ExplainPanel from "./ui/ExplainPanel";

// Business component: connects the AI store to the explain panel for a given
// resource. The `clear on selection change` behaviour lives in the mediator,
// not here — this component only triggers and displays.
const ExplainResource = observer(({ resource }: { resource: K8sResource }) => {
  const ai = useAiStore();

  return (
    <ExplainPanel
      loading={ai.explainLoading}
      error={ai.error}
      explanation={ai.explanation}
      onExplain={() => ai.explainResource(resource)}
    />
  );
});

export default ExplainResource;

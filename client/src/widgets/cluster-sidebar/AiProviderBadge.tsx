import { observer } from "mobx-react-lite";
import { useAiStore } from "../../entities/ai/model/aiContext";

// Business component: footer badge showing the active AI provider/model.
const AiProviderBadge = observer(() => {
  const ai = useAiStore();

  if (!ai.providerInfo) return null;

  return (
    <div className="text-xxs text-text-muted px-4 py-[10px] border-t border-border flex-shrink-0 mt-auto">
      AI: {ai.providerInfo.provider} / {ai.providerInfo.model}
    </div>
  );
});

export default AiProviderBadge;

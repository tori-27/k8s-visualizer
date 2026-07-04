interface AnalysisModalViewProps {
  analysis: string;
  onClose: () => void;
}

// UI: modal presenting the cluster analysis text.
export default function AnalysisModalView({
  analysis,
  onClose,
}: AnalysisModalViewProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-100 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-strong rounded-xl w-full max-w-[600px] max-h-[80vh] flex flex-col shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-[14px] border-b border-border flex-shrink-0">
          <span className="text-13 font-bold text-text-primary flex items-center gap-2">
            <span className="text-15 text-primary">✦</span>
            Cluster Analysis
          </span>
          <button
            className="w-[26px] h-[26px] flex items-center justify-center text-text-muted text-lg rounded-[5px] cursor-pointer transition-colors duration-150 hover:bg-bg hover:text-text-primary"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="px-5 py-5 overflow-y-auto flex-1">
          <p className="font-mono text-xs text-text-body leading-[1.7] whitespace-pre-wrap break-words">
            {analysis}
          </p>
        </div>
      </div>
    </div>
  );
}

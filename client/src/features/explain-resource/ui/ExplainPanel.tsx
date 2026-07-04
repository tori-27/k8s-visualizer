interface ExplainPanelProps {
  loading: boolean;
  error: string | null;
  explanation: string | null;
  onExplain: () => void;
}

// UI: the AI explain section. Purely presentational — all state arrives as props.
export default function ExplainPanel({
  loading,
  error,
  explanation,
  onExplain,
}: ExplainPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="section-title">AI</div>
      <div className="flex flex-col gap-[10px] pt-1">
        <button
          className="flex items-center gap-[7px] px-3 py-[7px] bg-bg border border-border-strong rounded-md text-text-tertiary text-xs font-medium w-full text-left transition-colors duration-150 hover:not-disabled:bg-surface-deep hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-55 disabled:cursor-not-allowed"
          onClick={onExplain}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-sm" />
          ) : (
            <span className="text-13 leading-none text-primary">✦</span>
          )}
          {loading ? "Explaining…" : "Explain with AI"}
        </button>

        {error && (
          <div className="text-11 text-danger-light bg-danger-light/[0.06] border border-danger-light/20 rounded-[5px] px-[10px] py-[7px]">
            {error}
          </div>
        )}

        {explanation && (
          <div className="bg-bg border border-border rounded-md px-3 py-[10px]">
            <p className="font-mono text-11 text-text-body leading-[1.65] whitespace-pre-wrap break-words m-0">
              {explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

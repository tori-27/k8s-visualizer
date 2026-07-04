interface AnalyzeButtonViewProps {
  loading: boolean;
  onClick: () => void;
}

// UI: floating "Analyze Cluster" action button.
export default function AnalyzeButtonView({
  loading,
  onClick,
}: AnalyzeButtonViewProps) {
  return (
    <button
      className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-surface border border-border-strong rounded-lg text-text-primary text-13 font-semibold cursor-pointer transition-colors duration-150 hover:not-disabled:bg-surface-hover hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span className="spinner" />
      ) : (
        <span className="text-15 leading-none">✦</span>
      )}
      Analyze Cluster
    </button>
  );
}

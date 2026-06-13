import { observer } from 'mobx-react-lite';
import { aiStore } from '../../stores/AiStore';
import { clusterStore } from '../../stores/cluster.store';

const AnalyzeButton = observer(() => {
  if (clusterStore.connectionStatus !== 'connected') return null;

  return (
    <button
      className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-surface border border-border-strong rounded-lg text-text-primary text-13 font-semibold cursor-pointer transition-colors duration-150 hover:not-disabled:bg-surface-hover hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={() => aiStore.analyzeCluster()}
      disabled={aiStore.analyzeLoading}
    >
      {aiStore.analyzeLoading ? (
        <span className="spinner" />
      ) : (
        <span className="text-15 leading-none">✦</span>
      )}
      Analyze Cluster
    </button>
  );
});

export default AnalyzeButton;

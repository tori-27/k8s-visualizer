import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ConnectionPanel from './components/ConnectionPanel/ConnectionPanel';
import ClusterGraph from './components/Graph/ClusterGraph';
import ResourceSidebar from './components/Sidebar/ResourceSidebar';
import AnalyzeButton from './components/AnalyzeButton/AnalyzeButton';
import AnalysisModal from './components/AnalysisModal/AnalysisModal';
import { clusterStore } from './stores/cluster.store';
import { aiStore } from './stores/AiStore';

const App = observer(() => {
  const connected = clusterStore.connectionStatus === 'connected';

  useEffect(() => {
    aiStore.fetchProviderInfo();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      <aside className="w-[280px] flex-shrink-0 bg-surface-deep border-r border-border flex flex-col overflow-hidden">
        <ConnectionPanel />
        {aiStore.providerInfo && (
          <div className="text-xxs text-text-muted px-4 py-[10px] border-t border-border flex-shrink-0 mt-auto">
            AI: {aiStore.providerInfo.provider} / {aiStore.providerInfo.model}
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-hidden relative bg-bg">
        {connected ? (
          <ClusterGraph />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-text-muted">
            <div className="text-lg font-semibold text-text-secondary">No cluster connected</div>
            <div className="text-13 text-text-muted text-center max-w-[280px] leading-relaxed">
              Upload a kubeconfig file from the sidebar to visualize your Kubernetes cluster.
            </div>
          </div>
        )}
        <AnalyzeButton />
      </main>

      {clusterStore.selectedResource && <ResourceSidebar />}
      <AnalysisModal />
    </div>
  );
});

export default App;

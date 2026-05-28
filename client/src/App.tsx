import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ConnectionPanel from './components/ConnectionPanel/ConnectionPanel';
import ClusterGraph from './components/Graph/ClusterGraph';
import ResourceSidebar from './components/Sidebar/ResourceSidebar';
import AnalyzeButton from './components/AnalyzeButton/AnalyzeButton';
import AnalysisModal from './components/AnalysisModal/AnalysisModal';
import styles from './App.module.css';
import { clusterStore } from './stores/cluster.store';
import { aiStore } from './stores/AiStore';

const App = observer(() => {
  const connected = clusterStore.connectionStatus === 'connected';

  useEffect(() => {
    aiStore.fetchProviderInfo();
  }, []);

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <ConnectionPanel />
        {aiStore.providerInfo && (
          <div className={styles.providerInfo}>
            AI: {aiStore.providerInfo.provider} / {aiStore.providerInfo.model}
          </div>
        )}
      </aside>

      <main className={styles.canvas}>
        {connected ? (
          <ClusterGraph />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No cluster connected</div>
            <div className={styles.emptyDesc}>
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

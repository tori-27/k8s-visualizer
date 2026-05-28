import { observer } from 'mobx-react-lite';
import { aiStore } from '../../stores/AiStore';
import { clusterStore } from '../../stores/cluster.store';
import styles from './AnalyzeButton.module.css';

const AnalyzeButton = observer(() => {
  if (clusterStore.connectionStatus !== 'connected') return null;

  return (
    <button
      className={styles.button}
      onClick={() => aiStore.analyzeCluster()}
      disabled={aiStore.analyzeLoading}
    >
      {aiStore.analyzeLoading ? (
        <span className={styles.spinner} />
      ) : (
        <span className={styles.icon}>✦</span>
      )}
      Analyze Cluster
    </button>
  );
});

export default AnalyzeButton;

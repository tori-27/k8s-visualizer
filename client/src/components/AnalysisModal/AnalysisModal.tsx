import { observer } from 'mobx-react-lite';
import { aiStore } from '../../stores/AiStore';
import styles from './AnalysisModal.module.css';

const AnalysisModal = observer(() => {
  if (!aiStore.analysis) return null;

  return (
    <div className={styles.backdrop} onClick={() => aiStore.clearAnalysis()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>
            <span className={styles.titleIcon}>✦</span>
            Cluster Analysis
          </span>
          <button className={styles.closeBtn} onClick={() => aiStore.clearAnalysis()}>
            ×
          </button>
        </div>
        <div className={styles.body}>
          <p className={styles.text}>{aiStore.analysis}</p>
        </div>
      </div>
    </div>
  );
});

export default AnalysisModal;

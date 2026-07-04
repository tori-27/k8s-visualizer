import { observer } from "mobx-react-lite";
import { useClusterStore } from "../../entities/cluster/model/clusterContext";
import { useClusterApi } from "../../entities/cluster/api/clusterApiContext";
import NamespaceSelect from "./ui/NamespaceSelect";

// Business component: bridges the cluster store + api to the presentational
// select. Optimistically updates the current namespace, then tells the backend
// to switch the watch.
const NamespaceSelector = observer(() => {
  const cluster = useClusterStore();
  const api = useClusterApi();

  if (!cluster.isConnected) return null;

  const handleChange = (namespace: string) => {
    cluster.setCurrentNamespace(namespace);
    api.switchNamespace(namespace).catch(console.error);
  };

  return (
    <NamespaceSelect
      value={cluster.currentNamespace}
      options={cluster.namespaces}
      onChange={handleChange}
    />
  );
});

export default NamespaceSelector;

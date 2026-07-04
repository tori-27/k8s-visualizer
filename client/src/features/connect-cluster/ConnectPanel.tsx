import { observer } from "mobx-react-lite";
import { useClusterStore } from "../../entities/cluster/model/clusterContext";
import PanelHeader from "./ui/PanelHeader";
import ConnectForm from "./ConnectForm";
import ConnectedView from "./ConnectedView";

// Compositional entry point for the connect feature: chooses which sub-view to
// render based on connection state and provides the panel scaffolding.
const ConnectPanel = observer(() => {
  const cluster = useClusterStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <PanelHeader />
      <div className="px-4 py-4 flex-1 flex flex-col gap-4">
        {cluster.isConnected ? <ConnectedView /> : <ConnectForm />}
      </div>
    </div>
  );
});

export default ConnectPanel;

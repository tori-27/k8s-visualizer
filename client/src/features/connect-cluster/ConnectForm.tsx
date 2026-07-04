import { observer } from "mobx-react-lite";
import { useConnectStore } from "./model/connectContext";
import Dropzone from "./ui/Dropzone";
import SelectedFileChip from "./ui/SelectedFileChip";
import ErrorBanner from "./ui/ErrorBanner";
import ConnectButton from "./ui/ConnectButton";

// Business component for the disconnected state: wires the connect store to the
// dropzone/file/error/button UI pieces.
const ConnectForm = observer(() => {
  const connect = useConnectStore();

  return (
    <>
      <Dropzone onFile={(file) => connect.setFile(file)} />
      {connect.selectedFile && <SelectedFileChip name={connect.selectedFile.name} />}
      {connect.error && <ErrorBanner message={connect.error} />}
      <ConnectButton
        disabled={!connect.selectedFile || connect.isConnecting}
        isConnecting={connect.isConnecting}
        onClick={() => connect.connect()}
      />
    </>
  );
});

export default ConnectForm;

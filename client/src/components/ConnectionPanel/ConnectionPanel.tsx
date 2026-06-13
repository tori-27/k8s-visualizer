import { useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { wsClient } from '../../services/wsClient';
import NamespaceSelector from './NamespaceSelector';
import { clusterStore } from '../../stores/cluster.store';

const ConnectionPanel = observer(() => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnect = useCallback(async (file: File) => {
    setIsConnecting(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/api/cluster/connect', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Connection failed (${res.status})`);
      }

      wsClient.connect();

      const nsRes = await fetch('http://localhost:3001/api/cluster/namespaces');
      const nsData = await nsRes.json() as { ok: boolean; data: string[] };
      if (nsData.ok) {
        clusterStore.setNamespaces(nsData.data);
      }
    } catch (e) {
      setError((e as Error).message);
      setSelectedFile(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleFileChange = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  }, [handleFileChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDisconnect = useCallback(async () => {
    try {
      await fetch('http://localhost:3001/api/cluster/disconnect', { method: 'DELETE' });
    } catch {
      // ignore
    }
    wsClient.disconnect();
    setSelectedFile(null);
    setError(null);
    clusterStore.selectResource(null);
  }, []);

  const connected = clusterStore.connectionStatus === 'connected';

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
        {/* ::before dot is replaced with an explicit inline element */}
        <div className="text-sm font-bold text-text-primary tracking-px-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          K8s Visualizer
        </div>
        <div className="text-11 text-text-muted mt-[2px] tracking-px-tight">Cluster graph explorer</div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 flex-1 flex flex-col gap-4">
        {connected ? (
          <>
            {/* Connected status */}
            <div className="flex items-center gap-2 px-3 py-[10px] bg-success/[0.08] border border-success/20 rounded-md">
              <span className="status-dot bg-success shadow-dot-glow" />
              <span className="text-xs text-text-tertiary flex-1 overflow-hidden whitespace-nowrap text-ellipsis">Connected</span>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-1">
              {[
                ['Nodes',       clusterStore.nodes.size],
                ['Pods',        clusterStore.pods.size],
                ['Services',    clusterStore.services.size],
                ['Deployments', clusterStore.deployments.size],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between items-center py-[5px] border-b border-border text-11">
                  <span className="text-text-muted">{label}</span>
                  <span className="text-text-tertiary font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <NamespaceSelector />

            <button
              className="w-full py-[7px] px-4 rounded-md bg-transparent border border-border-strong text-text-tertiary text-xs font-semibold tracking-px-tight transition-colors duration-150 hover:border-danger hover:text-danger"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </>
        ) : (
          <>
            {/* Dropzone */}
            <div
              className={`border-[1.5px] border-dashed rounded-lg px-4 py-7 text-center cursor-pointer outline-none transition-colors duration-150 ${
                isDragOver
                  ? 'border-primary bg-primary/[0.05]'
                  : 'border-border-strong bg-transparent hover:border-primary hover:bg-primary/[0.05]'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <div className="text-2xl mb-2 text-text-muted">⬆</div>
              <div className="text-xs text-text-secondary leading-relaxed">
                Drop kubeconfig here<br />or click to browse
              </div>
              <div className="text-11 text-text-muted mt-[6px]">~/.kube/config or any kubeconfig file</div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleInputChange}
              accept="*/*"
            />

            {selectedFile && (
              <div className="text-11 text-text-tertiary bg-surface rounded-[5px] px-[10px] py-[7px] break-all">
                📄 {selectedFile.name}
              </div>
            )}

            {error && (
              <div className="text-11 text-danger bg-danger/[0.08] border border-danger/20 rounded-[5px] px-[10px] py-2 leading-relaxed">
                {error}
              </div>
            )}

            <button
              className="w-full py-[9px] px-4 rounded-md bg-primary text-bg text-xs font-bold tracking-px-normal transition-colors duration-150 hover:not-disabled:bg-primary-hover disabled:opacity-45 disabled:cursor-not-allowed"
              disabled={!selectedFile || isConnecting}
              onClick={() => selectedFile && handleConnect(selectedFile)}
            >
              {isConnecting ? 'Connecting…' : 'Connect'}
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default ConnectionPanel;

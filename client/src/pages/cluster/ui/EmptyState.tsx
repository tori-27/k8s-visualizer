// UI: shown in the main area when no cluster is connected.
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-text-muted">
      <div className="text-lg font-semibold text-text-secondary">No cluster connected</div>
      <div className="text-13 text-text-muted text-center max-w-[280px] leading-relaxed">
        Upload a kubeconfig file from the sidebar to visualize your Kubernetes cluster.
      </div>
    </div>
  );
}

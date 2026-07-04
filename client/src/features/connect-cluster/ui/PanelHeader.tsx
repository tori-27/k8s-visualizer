// UI: static sidebar header. No state, no logic.
export default function PanelHeader() {
  return (
    <div className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
      <div className="text-sm font-bold text-text-primary tracking-px-wide flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        K8s Visualizer
      </div>
      <div className="text-11 text-text-muted mt-[2px] tracking-px-tight">
        Cluster graph explorer
      </div>
    </div>
  );
}

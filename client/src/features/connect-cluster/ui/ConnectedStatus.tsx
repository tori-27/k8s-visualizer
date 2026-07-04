// UI: "Connected" indicator shown while a cluster session is live.
export default function ConnectedStatus() {
  return (
    <div className="flex items-center gap-2 px-3 py-[10px] bg-success/[0.08] border border-success/20 rounded-md">
      <span className="status-dot bg-success shadow-dot-glow" />
      <span className="text-xs text-text-tertiary flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
        Connected
      </span>
    </div>
  );
}

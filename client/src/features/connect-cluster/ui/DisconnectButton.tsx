// UI: disconnect action button.
export default function DisconnectButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="w-full py-[7px] px-4 rounded-md bg-transparent border border-border-strong text-text-tertiary text-xs font-semibold tracking-px-tight transition-colors duration-150 hover:border-danger hover:text-danger"
      onClick={onClick}
    >
      Disconnect
    </button>
  );
}

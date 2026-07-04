interface ConnectButtonProps {
  disabled: boolean;
  isConnecting: boolean;
  onClick: () => void;
}

// UI: the primary connect action button.
export default function ConnectButton({
  disabled,
  isConnecting,
  onClick,
}: ConnectButtonProps) {
  return (
    <button
      className="w-full py-[9px] px-4 rounded-md bg-primary text-bg text-xs font-bold tracking-px-normal transition-colors duration-150 hover:not-disabled:bg-primary-hover disabled:opacity-45 disabled:cursor-not-allowed"
      disabled={disabled}
      onClick={onClick}
    >
      {isConnecting ? "Connecting…" : "Connect"}
    </button>
  );
}

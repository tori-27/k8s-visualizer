interface StatusBadgeProps {
  status: string;
  color: string;
}

// UI: coloured status pill. Colour is computed by the caller (domain rule).
export default function StatusBadge({ status, color }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-xl text-11 font-semibold"
        style={{ background: `${color}18`, border: `1px solid ${color}40` }}
      >
        <span className="w-[6px] h-[6px] rounded-full" style={{ background: color }} />
        <span style={{ color }}>{status}</span>
      </span>
    </div>
  );
}

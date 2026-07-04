interface LabelListProps {
  entries: [string, string][];
}

// UI: renders a resource's labels as key=value tags.
export default function LabelList({ entries }: LabelListProps) {
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="section-title">Labels</div>
      <div className="flex flex-wrap gap-[5px]">
        {entries.map(([k, v]) => (
          <span key={k} className="label-tag">
            <span className="text-primary">{k}</span>={v}
          </span>
        ))}
      </div>
    </div>
  );
}

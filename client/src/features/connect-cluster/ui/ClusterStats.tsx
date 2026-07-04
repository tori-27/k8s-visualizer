export interface ClusterStat {
  label: string;
  value: number;
}

// UI: renders the resource-count rows. Receives fully-prepared data.
export default function ClusterStats({ stats }: { stats: ClusterStat[] }) {
  return (
    <div className="flex flex-col gap-1">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="flex justify-between items-center py-[5px] border-b border-border text-11"
        >
          <span className="text-text-muted">{label}</span>
          <span className="text-text-tertiary font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}

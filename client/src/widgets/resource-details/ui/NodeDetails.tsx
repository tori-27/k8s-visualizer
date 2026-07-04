export type RawNode = {
  status?: { capacity?: { cpu?: string; memory?: string } };
};

// UI: node-specific detail section (capacity).
export default function NodeDetails({ raw }: { raw: RawNode }) {
  const capacity = raw.status?.capacity;
  if (!capacity) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="section-title">Capacity</div>
      <div className="info-table">
        {capacity.cpu && (
          <div className="info-row">
            <span className="info-key">CPU</span>
            <span className="info-val">{capacity.cpu}</span>
          </div>
        )}
        {capacity.memory && (
          <div className="info-row">
            <span className="info-key">Memory</span>
            <span className="info-val">{capacity.memory}</span>
          </div>
        )}
      </div>
    </div>
  );
}

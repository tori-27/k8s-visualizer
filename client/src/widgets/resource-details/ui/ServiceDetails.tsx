export type RawService = {
  spec?: { type?: string; clusterIP?: string };
};

// UI: service-specific detail section (spec).
export default function ServiceDetails({ raw }: { raw: RawService }) {
  const spec = raw.spec;
  if (!spec) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="section-title">Spec</div>
      <div className="info-table">
        {spec.type && (
          <div className="info-row">
            <span className="info-key">Type</span>
            <span className="info-val">{spec.type}</span>
          </div>
        )}
        {spec.clusterIP && (
          <div className="info-row">
            <span className="info-key">ClusterIP</span>
            <span className="info-val">{spec.clusterIP}</span>
          </div>
        )}
      </div>
    </div>
  );
}

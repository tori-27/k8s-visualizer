export type RawPod = {
  spec?: { nodeName?: string };
  status?: { containerStatuses?: Array<{ name: string; image: string }> };
};

// UI: pod-specific detail sections (placement + containers).
export default function PodDetails({ raw }: { raw: RawPod }) {
  const nodeName = raw.spec?.nodeName;
  const containers = raw.status?.containerStatuses ?? [];

  return (
    <>
      {nodeName && (
        <div className="flex flex-col gap-2">
          <div className="section-title">Placement</div>
          <div className="info-table">
            <div className="info-row">
              <span className="info-key">Node</span>
              <span className="info-val">{nodeName}</span>
            </div>
          </div>
        </div>
      )}
      {containers.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="section-title">Containers ({containers.length})</div>
          <div className="info-table">
            {containers.map((c) => (
              <div key={c.name} className="info-row">
                <span className="info-key">{c.name}</span>
                <span className="info-val">
                  <span className="text-xxs text-text-secondary bg-bg rounded px-[6px] py-[2px] mt-[3px] block break-all border border-border">
                    {c.image}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

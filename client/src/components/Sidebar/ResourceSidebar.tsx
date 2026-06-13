import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { ResourceType } from '../../types/cluster.types';
import { getStatusColor } from '../Graph/nodes/nodeUtils';
import { clusterStore } from '../../stores/cluster.store';
import { aiStore } from '../../stores/AiStore';

type RawPod = {
  spec?: { nodeName?: string };
  status?: { containerStatuses?: Array<{ name: string; image: string }> };
};

type RawNode = {
  status?: { capacity?: { cpu?: string; memory?: string } };
};

type RawService = {
  spec?: { type?: string; clusterIP?: string };
};

function resourceTypeName(resource: { id: string }): string {
  const id = resource.id;
  if (id.startsWith('pod-') || id.includes('/pod/')) return 'Pod';
  if (id.startsWith('node-') || id.includes('/node/')) return 'Node';
  if (id.startsWith('svc-') || id.includes('/service/')) return 'Service';
  return 'Resource';
}

function guessType(id: string): ResourceType | null {
  if (id.startsWith('pod-') || id.includes('-pod-')) return ResourceType.Pod;
  if (id.startsWith('node-') || id.includes('-node-')) return ResourceType.Node;
  if (id.startsWith('svc-') || id.includes('-service-') || id.includes('-svc-')) return ResourceType.Service;
  return null;
}

function PodDetails({ raw }: { raw: RawPod }) {
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

function NodeDetails({ raw }: { raw: RawNode }) {
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

function ServiceDetails({ raw }: { raw: RawService }) {
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

const ResourceSidebar = observer(() => {
  const resource = clusterStore.selectedResource;

  useEffect(() => {
    aiStore.clearExplanation();
  }, [resource?.id]);

  if (!resource) return null;

  const color = getStatusColor(resource.status);
  const labelEntries = Object.entries(resource.labels ?? {});
  const detectedType = guessType(resource.id);

  return (
    <aside className="w-[320px] flex-shrink-0 bg-surface-deep border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="type-tag">{resourceTypeName(resource)}</span>
        </div>
        <button className="close-btn text-base" onClick={() => clusterStore.selectResource(null)}>
          ×
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-4 overflow-y-auto flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm font-bold text-text-primary break-all leading-snug">{resource.name}</div>
          {resource.namespace && (
            <div className="text-11 text-text-muted">{resource.namespace}</div>
          )}
        </div>

        {/* Status badge — background and border are dynamic, set via inline style */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-xl text-11 font-semibold"
            style={{ background: `${color}18`, border: `1px solid ${color}40` }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ background: color }} />
            <span style={{ color }}>{resource.status}</span>
          </span>
        </div>

        {/* Labels */}
        {labelEntries.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="section-title">Labels</div>
            <div className="flex flex-wrap gap-[5px]">
              {labelEntries.map(([k, v]) => (
                <span key={k} className="label-tag">
                  <span className="text-primary">{k}</span>={v}
                </span>
              ))}
            </div>
          </div>
        )}

        {detectedType === ResourceType.Pod && <PodDetails raw={resource.raw as RawPod} />}
        {detectedType === ResourceType.Node && <NodeDetails raw={resource.raw as RawNode} />}
        {detectedType === ResourceType.Service && <ServiceDetails raw={resource.raw as RawService} />}

        {/* AI section */}
        <div className="flex flex-col gap-2">
          <div className="section-title">AI</div>
          <div className="flex flex-col gap-[10px] pt-1">
            <button
              className="flex items-center gap-[7px] px-3 py-[7px] bg-bg border border-border-strong rounded-md text-text-tertiary text-xs font-medium w-full text-left transition-colors duration-150 hover:not-disabled:bg-surface-deep hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-55 disabled:cursor-not-allowed"
              onClick={() => aiStore.explainResource(resource)}
              disabled={aiStore.explainLoading}
            >
              {aiStore.explainLoading ? (
                <span className="spinner-sm" />
              ) : (
                <span className="text-13 leading-none text-primary">✦</span>
              )}
              {aiStore.explainLoading ? 'Explaining…' : 'Explain with AI'}
            </button>

            {aiStore.error && (
              <div className="text-11 text-danger-light bg-danger-light/[0.06] border border-danger-light/20 rounded-[5px] px-[10px] py-[7px]">
                {aiStore.error}
              </div>
            )}

            {aiStore.explanation && (
              <div className="bg-bg border border-border rounded-md px-3 py-[10px]">
                <p className="font-mono text-11 text-text-body leading-[1.65] whitespace-pre-wrap break-words m-0">
                  {aiStore.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider info footer */}
      {/* Rendered by App.tsx at the sidebar level — nothing needed here */}
    </aside>
  );
});

export default ResourceSidebar;

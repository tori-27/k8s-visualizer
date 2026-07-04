import { observer } from "mobx-react-lite";
import { ResourceType } from "../../entities/cluster/model/cluster.types";
import { useClusterStore } from "../../entities/cluster/model/clusterContext";
import { getStatusColor } from "../../entities/cluster/lib/status";
import {
  guessResourceType,
  resourceTypeName,
} from "../../entities/cluster/lib/resourceType";
import ExplainResource from "../../features/explain-resource/ExplainResource";
import DetailsHeader from "./ui/DetailsHeader";
import StatusBadge from "./ui/StatusBadge";
import LabelList from "./ui/LabelList";
import PodDetails, { type RawPod } from "./ui/PodDetails";
import NodeDetails, { type RawNode } from "./ui/NodeDetails";
import ServiceDetails, { type RawService } from "./ui/ServiceDetails";

// Business component: reads the selected resource, prepares view-ready data
// (colour, labels, detected kind), and composes the presentational sections
// plus the explain feature.
const ResourceDetails = observer(() => {
  const cluster = useClusterStore();
  const resource = cluster.selectedResource;

  if (!resource) return null;

  const color = getStatusColor(resource.status);
  const labelEntries = Object.entries(resource.labels ?? {});
  const detectedType = guessResourceType(resource.id);

  return (
    <aside className="w-[320px] flex-shrink-0 bg-surface-deep border-l border-border flex flex-col overflow-hidden">
      <DetailsHeader
        typeName={resourceTypeName(resource)}
        onClose={() => cluster.selectResource(null)}
      />

      <div className="px-4 py-4 overflow-y-auto flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm font-bold text-text-primary break-all leading-snug">
            {resource.name}
          </div>
          {resource.namespace && (
            <div className="text-11 text-text-muted">{resource.namespace}</div>
          )}
        </div>

        <StatusBadge status={resource.status} color={color} />

        <LabelList entries={labelEntries} />

        {detectedType === ResourceType.Pod && (
          <PodDetails raw={resource.raw as RawPod} />
        )}
        {detectedType === ResourceType.Node && (
          <NodeDetails raw={resource.raw as RawNode} />
        )}
        {detectedType === ResourceType.Service && (
          <ServiceDetails raw={resource.raw as RawService} />
        )}

        <ExplainResource resource={resource} />
      </div>
    </aside>
  );
});

export default ResourceDetails;

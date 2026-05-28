import { K8sResource, ResourceType } from "./cluster.types.js";

export const normalizeResource = (
  resourceType: ResourceType,
  obj: any,
): K8sResource => {
  return {
    id: obj.metadata?.uid ?? "",
    name: obj.metadata?.name ?? "",
    resourceType,
    namespace: obj.metadata?.namespace,
    status: extractStatus(resourceType, obj),
    labels: obj.metadata?.labels ?? {},
    raw: obj,
  };
};

const getPodStatus = (obj: any): string => {
  if (obj.metadata?.deletionTimestamp && obj.spec?.nodeName) {
    return "Terminating";
  }

  for (const cs of obj.status?.initContainerStatuses ?? []) {
    const reason = cs.state?.waiting?.reason ?? cs.state?.terminated?.reason;
    if (reason) return reason;
    if (cs.state?.terminated?.exitCode !== undefined && cs.state.terminated.exitCode !== 0) {
      return "Init:Error";
    }
  }

  for (const cs of obj.status?.containerStatuses ?? []) {
    if (cs.state?.waiting?.reason) return cs.state.waiting.reason;
    if (cs.state?.terminated?.reason) return cs.state.terminated.reason;
    if (cs.state?.terminated?.exitCode !== undefined && cs.state.terminated.exitCode !== 0) {
      return "Error";
    }
  }

  return obj.status?.phase ?? "Unknown";
};

const extractStatus = (resourceType: ResourceType, obj: any): string => {
  switch (resourceType) {
    case ResourceType.Pod:
      return getPodStatus(obj);
    case ResourceType.Node:
      return obj.status?.conditions?.find((c: any) => c.type === "Ready")
        ?.status === "True"
        ? "Ready"
        : "NotReady";
    case ResourceType.Service:
      return obj.spec?.type ?? "ClusterIP";
    default:
      return "Unknown";
  }
};

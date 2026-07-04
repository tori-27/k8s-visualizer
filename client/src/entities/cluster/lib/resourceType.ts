import { ResourceType } from "../model/cluster.types";

// Domain heuristics for recovering a resource's kind from its opaque id.
// Isolated here so both the details panel and any future consumer share one
// source of truth instead of re-implementing the string matching.

export function resourceTypeName(resource: { id: string }): string {
  const id = resource.id;
  if (id.startsWith("pod-") || id.includes("/pod/")) return "Pod";
  if (id.startsWith("node-") || id.includes("/node/")) return "Node";
  if (id.startsWith("svc-") || id.includes("/service/")) return "Service";
  return "Resource";
}

export function guessResourceType(id: string): ResourceType | null {
  if (id.startsWith("pod-") || id.includes("-pod-")) return ResourceType.Pod;
  if (id.startsWith("node-") || id.includes("-node-")) return ResourceType.Node;
  if (id.startsWith("svc-") || id.includes("-service-") || id.includes("-svc-"))
    return ResourceType.Service;
  return null;
}

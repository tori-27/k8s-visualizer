export enum ResourceType {
  Pod = "pod",
  Node = "node",
  Service = "service",
}

export interface K8sResource {
  id: string;
  name: string;
  namespace?: string;
  status: string;
  labels: Record<string, string>;
  raw: object;
}

export interface ResourceEvent {
  type: "ADDED" | "MODIFIED" | "DELETED";
  resourceType: ResourceType;
  resource: K8sResource;
}

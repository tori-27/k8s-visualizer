export enum ResourceType {
  Pod = "pod",
  Node = "node",
  Service = "service",
  Deployment = "deployment",
  ReplicaSet = "replicaset",
}

export interface ClusterSnapshot {
  pods: K8sResource[];
  nodes: K8sResource[];
  services: K8sResource[];
  deployments: K8sResource[];
  replicasents: K8sResource[];
}

export interface K8sResource {
  id: string;
  name: string;
  resourceType: ResourceType;
  namespace?: string;
  status: string;
  labels: Record<string, string>;
  raw: object;
}

export interface ResourceEvent {
  type: "ADDED" | "MODIFIED" | "DELETED";
  resource: K8sResource;
}

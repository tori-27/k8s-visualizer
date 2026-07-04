export const ResourceType = {
  Pod: "pod",
  Node: "node",
  Service: "service",
  Deployment: "deployment",
  ReplicaSet: "replicaset",
} as const;

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export interface K8sResource {
  id: string;
  name: string;
  // The kind is carried on the resource itself by the server; resource events
  // do not repeat it at the message level.
  resourceType: ResourceType;
  namespace?: string;
  status: string;
  labels: Record<string, string>;
  raw: object;
}

export interface ClusterSnapshot {
  pods: K8sResource[];
  nodes: K8sResource[];
  services: K8sResource[];
  deployments: K8sResource[];
  replicasets: K8sResource[];
}

export type WsMessage =
  | { type: "snapshot"; data: ClusterSnapshot }
  | { type: "resource.added"; resource: K8sResource }
  | { type: "resource.modified"; resource: K8sResource }
  | { type: "resource.deleted"; resource: K8sResource }
  | { type: "connection.status"; status: "connected" | "disconnected" }
  | { type: "namespace.changed"; namespace: string }
  | { type: "watch.error"; resourceType: string; error: string }
  | { type: "pong" };

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

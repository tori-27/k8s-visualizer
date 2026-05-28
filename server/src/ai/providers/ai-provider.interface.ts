import { ClusterSnapshot, K8sResource } from "../../cluster/cluster.types.js";

export interface AiProvider {
  readonly name: string;
  explain(resource: K8sResource): Promise<string>;
  analyzeCluster(snapshot: ClusterSnapshot): Promise<string>;
}

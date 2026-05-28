import { ClusterSnapshot, K8sResource } from "../cluster/cluster.types.js";

export const buildExplainPrompt = (resource: K8sResource): string =>
  `
You are a Kubernetes expert assistant. Analyze this Kubernetes resource and provide:
1. What the current status means in plain English
2. If there are any issues, what is likely causing them
3. Specific actionable steps to fix the issues (if any)
4. Keep the response concise — max 150 words

Resource type: ${resource.resourceType}
Name: ${resource.name}
Namespace: ${resource.namespace ?? "cluster-wide"}
Status: ${resource.status}
Labels: ${JSON.stringify(resource.labels)}
Raw status: ${JSON.stringify((resource.raw as any)?.status ?? {})}

Respond in plain English, no markdown formatting.
`.trim();

export const buildAnalyzePrompt = (snapshot: ClusterSnapshot): string =>
  `
You are a Kubernetes expert assistant. Analyze this cluster snapshot and provide:
1. Overall cluster health assessment
2. List of problems found (if any)
3. Top 3 recommended actions
4. Keep the response concise — max 200 words

Pods: ${snapshot.pods.length} total, ${snapshot.pods.filter((p) => p.status !== "Running").length} not running
Nodes: ${snapshot.nodes.length} total, ${snapshot.nodes.filter((n) => n.status !== "Ready").length} not ready
Services: ${snapshot.services.length} total

Problem pods: ${JSON.stringify(
    snapshot.pods
      .filter((p) => p.status !== "Running")
      .map((p) => ({ name: p.name, namespace: p.namespace, status: p.status })),
  )}

Problem nodes: ${JSON.stringify(
    snapshot.nodes
      .filter((n) => n.status !== "Ready")
      .map((n) => ({ name: n.name, status: n.status })),
  )}

Respond in plain English, no markdown formatting.
`.trim();

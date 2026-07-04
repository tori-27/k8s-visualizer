import type { Node, Edge } from "reactflow";
import type { K8sResource } from "../../../entities/cluster/model/cluster.types";
import type { NodeData } from "../ui/nodes/nodeTypes";

// Pure business logic: decides *how* the cluster is visualized (positions,
// grouping of pods under their host node, edges). No React, no store, no DOM —
// just data in, layout out, so it can be unit-tested in isolation.

const K8S_SLOT_W = 420;
const K8S_Y = 60;
const POD_START_Y = 260;
const POD_W = 160;
const POD_GAP_X = 20;
const POD_H = 74;
const POD_GAP_Y = 12;
const PODS_PER_ROW = 2;

type RawPod = { spec?: { nodeName?: string } };

export function buildLayout(
  k8sNodes: K8sResource[],
  pods: K8sResource[],
  services: K8sResource[],
): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const flowNodes: Node<NodeData>[] = [];
  const flowEdges: Edge[] = [];

  k8sNodes.forEach((node, i) => {
    flowNodes.push({
      id: node.id,
      type: "k8sNode",
      position: { x: i * K8S_SLOT_W + 30, y: K8S_Y },
      data: { resource: node },
    });
  });

  const podsByNodeName = new Map<string, K8sResource[]>();
  const unassigned: K8sResource[] = [];

  pods.forEach((pod) => {
    const nodeName = (pod.raw as RawPod).spec?.nodeName;
    if (nodeName && k8sNodes.some((n) => n.name === nodeName)) {
      const list = podsByNodeName.get(nodeName) ?? [];
      list.push(pod);
      podsByNodeName.set(nodeName, list);
    } else {
      unassigned.push(pod);
    }
  });

  k8sNodes.forEach((node, nodeIdx) => {
    const slotX = nodeIdx * K8S_SLOT_W + 30;
    const nodePods = podsByNodeName.get(node.name) ?? [];

    nodePods.forEach((pod, podIdx) => {
      const col = podIdx % PODS_PER_ROW;
      const row = Math.floor(podIdx / PODS_PER_ROW);
      flowNodes.push({
        id: pod.id,
        type: "pod",
        position: {
          x: slotX + col * (POD_W + POD_GAP_X),
          y: POD_START_Y + row * (POD_H + POD_GAP_Y),
        },
        data: { resource: pod },
      });
      flowEdges.push({
        id: `e-${pod.id}-${node.id}`,
        source: pod.id,
        target: node.id,
        style: { stroke: "#2a2d3e", strokeWidth: 1 },
      });
    });
  });

  const unassignedBaseX = k8sNodes.length * K8S_SLOT_W + 30;
  unassigned.forEach((pod, i) => {
    const col = i % PODS_PER_ROW;
    const row = Math.floor(i / PODS_PER_ROW);
    flowNodes.push({
      id: pod.id,
      type: "pod",
      position: {
        x: unassignedBaseX + col * (POD_W + POD_GAP_X),
        y: K8S_Y + row * (POD_H + POD_GAP_Y),
      },
      data: { resource: pod },
    });
  });

  const svcBaseX =
    k8sNodes.length > 0 || unassigned.length > 0
      ? (k8sNodes.length + (unassigned.length > 0 ? 1 : 0)) * K8S_SLOT_W + 80
      : 80;

  services.forEach((svc, i) => {
    flowNodes.push({
      id: svc.id,
      type: "service",
      position: { x: svcBaseX, y: K8S_Y + i * 130 },
      data: { resource: svc },
    });
  });

  return { nodes: flowNodes, edges: flowEdges };
}

import {
  autorun,
  makeAutoObservable,
  observable,
  runInAction,
  type IReactionDisposer,
} from "mobx";
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from "reactflow";
import type { ClusterStore } from "../../../entities/cluster/model/ClusterStore";
import { buildLayout } from "../lib/buildLayout";
import type { NodeData } from "../ui/nodes/nodeTypes";

// Owns the ReactFlow view state and keeps it in sync with the cluster entity.
// The sync is a MobX `autorun` set up in the constructor — this store *is* the
// lifecycle manager, so the graph component needs no `useEffect` to wire the
// derivation. Interactive node/edge changes (drag) are applied locally until
// the next cluster update rebuilds the layout, matching prior behaviour.
export class GraphViewStore {
  nodes: Node<NodeData>[] = [];
  edges: Edge[] = [];
  private readonly cluster: ClusterStore;
  private readonly disposer: IReactionDisposer;

  constructor(cluster: ClusterStore) {
    // nodes/edges are `observable.ref`: the array reference is observable but
    // its contents stay plain objects. ReactFlow/React freeze node & edge
    // `style` objects, which is illegal on MobX observables — keeping them
    // plain avoids that. `cluster`/`disposer` assigned after the call stay
    // plain fields.
    makeAutoObservable(
      this,
      { nodes: observable.ref, edges: observable.ref },
      { autoBind: true },
    );
    this.cluster = cluster;

    this.disposer = autorun(() => {
      const layout = buildLayout(
        Array.from(this.cluster.nodes.values()),
        Array.from(this.cluster.pods.values()),
        Array.from(this.cluster.services.values()),
      );
      // The autorun body is not itself an action; wrap the writes so they are
      // allowed under MobX strict mode.
      runInAction(() => {
        this.nodes = layout.nodes;
        this.edges = layout.edges;
      });
    });
  }

  onNodesChange(changes: NodeChange[]): void {
    this.nodes = applyNodeChanges(changes, this.nodes);
  }

  onEdgesChange(changes: EdgeChange[]): void {
    this.edges = applyEdgeChanges(changes, this.edges);
  }

  dispose(): void {
    this.disposer();
  }
}

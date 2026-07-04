import { reaction, type IReactionDisposer } from "mobx";
import type { ClusterStore } from "../entities/cluster/model/ClusterStore";
import type { AiStore } from "../entities/ai/model/AiStore";

// Mediator: the single place aware of *cross-module* interactions. Independent
// scoped stores never reference each other directly; instead they register here
// and the mediator wires reactions between them.
//
// Today it enforces one rule — "when the selected resource changes, discard any
// stale AI explanation" — which previously lived in a `useEffect` inside the
// details panel. New cross-store rules get added here, keeping the coupling in
// one auditable location.
export class AppMediator {
  private cluster!: ClusterStore;
  private ai!: AiStore;
  private readonly disposers: IReactionDisposer[] = [];

  registerCluster(store: ClusterStore): void {
    this.cluster = store;
  }

  registerAi(store: AiStore): void {
    this.ai = store;
  }

  init(): void {
    this.disposers.push(
      reaction(
        () => this.cluster.selectedResource?.id ?? null,
        () => this.ai.clearExplanation(),
      ),
    );
  }

  dispose(): void {
    this.disposers.forEach((dispose) => dispose());
    this.disposers.length = 0;
  }
}

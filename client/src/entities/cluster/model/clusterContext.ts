import { createStoreContext } from "../../../shared/lib/context";
import type { ClusterStore } from "./ClusterStore";

export const { Context: ClusterStoreContext, useStore: useClusterStore } =
  createStoreContext<ClusterStore>("ClusterStore");

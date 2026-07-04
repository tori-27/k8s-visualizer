import { createStoreContext } from "../../../shared/lib/context";
import type { IClusterApi } from "./ClusterApi";

export const { Context: ClusterApiContext, useStore: useClusterApi } =
  createStoreContext<IClusterApi>("ClusterApi");

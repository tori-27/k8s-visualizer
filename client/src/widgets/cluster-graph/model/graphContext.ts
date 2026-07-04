import { createStoreContext } from "../../../shared/lib/context";
import type { GraphViewStore } from "./GraphViewStore";

export const { Context: GraphStoreContext, useStore: useGraphStore } =
  createStoreContext<GraphViewStore>("GraphViewStore");

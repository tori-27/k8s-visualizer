import { createStoreContext } from "../../../shared/lib/context";
import type { ConnectClusterStore } from "./ConnectClusterStore";

export const { Context: ConnectStoreContext, useStore: useConnectStore } =
  createStoreContext<ConnectClusterStore>("ConnectClusterStore");

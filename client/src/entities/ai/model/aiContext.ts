import { createStoreContext } from "../../../shared/lib/context";
import type { AiStore } from "./AiStore";

export const { Context: AiStoreContext, useStore: useAiStore } =
  createStoreContext<AiStore>("AiStore");

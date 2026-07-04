import { createContext, useContext, type Context } from "react";

// Small DI helper. Each store/service defines its own context next to itself
// via this factory; the app composition root supplies the concrete instances.
// This gives components direct access to what they need (no prop drilling)
// without a single central registry that every layer has to import.
export function createStoreContext<T>(name: string): {
  Context: Context<T | null>;
  useStore: () => T;
} {
  const Ctx = createContext<T | null>(null);

  const useStore = (): T => {
    const value = useContext(Ctx);
    if (value === null) {
      throw new Error(`${name} was used outside of its provider`);
    }
    return value;
  };

  return { Context: Ctx, useStore };
}

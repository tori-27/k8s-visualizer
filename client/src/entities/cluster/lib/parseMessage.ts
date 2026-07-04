import type { WsMessage } from "../model/cluster.types";

// Serialization boundary: turns a raw socket frame into a typed domain message.
// Kept out of both the socket (infrastructure) and the store (state) so neither
// owns JSON parsing.
export function parseWsMessage(raw: string): WsMessage | null {
  try {
    return JSON.parse(raw) as WsMessage;
  } catch {
    console.warn("[WS] Invalid message:", raw);
    return null;
  }
}

// WebSocket lifecycle manager. This is pure infrastructure: it owns the socket,
// reconnection, and keep-alive ping, and emits *raw* string frames. It has no
// knowledge of the cluster message protocol or of MobX — parsing and dispatch
// live in the domain layer, wired together at the composition root.

export interface IClusterSocket {
  connect(): void;
  disconnect(): void;
  /** Subscribe to raw text frames. Returns an unsubscribe function. */
  onMessage(handler: (raw: string) => void): () => void;
  /** Subscribe to socket close events. Returns an unsubscribe function. */
  onClose(handler: () => void): () => void;
}

const RECONNECT_DELAY_MS = 3000;
const PING_INTERVAL_MS = 30000;

export class ClusterSocket implements IClusterSocket {
  private ws: WebSocket | null = null;
  private readonly messageHandlers = new Set<(raw: string) => void>();
  private readonly closeHandlers = new Set<() => void>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private shouldReconnect = true;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    this.shouldReconnect = true;
    this.createConnection();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearTimers();
    this.ws?.close();
    this.ws = null;
  }

  onMessage(handler: (raw: string) => void): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onClose(handler: () => void): () => void {
    this.closeHandlers.add(handler);
    return () => this.closeHandlers.delete(handler);
  }

  private createConnection(): void {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[WS] Connected");
      this.startPing();
    };

    this.ws.onmessage = (event) => {
      this.messageHandlers.forEach((handler) => handler(event.data));
    };

    this.ws.onclose = () => {
      console.log("[WS] Disconnected");
      this.clearPing();
      this.closeHandlers.forEach((handler) => handler());
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    console.log("[WS] Reconnecting in 3s...");
    this.reconnectTimer = setTimeout(() => this.createConnection(), RECONNECT_DELAY_MS);
  }

  private startPing(): void {
    this.clearPing();
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, PING_INTERVAL_MS);
  }

  private clearPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.clearPing();
  }
}

import type { AssetEvent, AssetEventType, AssetId } from "@/types/assets";

type AssetEventListener = (event: AssetEvent) => void | Promise<void>;

const listeners = new Set<AssetEventListener>();

/**
 * In-process AMS event bus (server-side).
 * Future CRM / CDN adapters subscribe here.
 */
export function onAssetEvent(listener: AssetEventListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function publishAssetEvent(input: {
  type: AssetEventType;
  assetId: AssetId;
  actorUserId?: string | null;
  payload?: Record<string, unknown>;
}): Promise<AssetEvent> {
  const event: AssetEvent = {
    type: input.type,
    assetId: input.assetId,
    actorUserId: input.actorUserId ?? null,
    payload: input.payload,
    occurredAt: new Date().toISOString(),
  };

  for (const listener of listeners) {
    try {
      await listener(event);
    } catch (error) {
      console.error("[CWMC]", {
        context: "assets.events",
        message: error instanceof Error ? error.message : "listener failed",
      });
    }
  }

  return event;
}

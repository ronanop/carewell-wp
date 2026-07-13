/**
 * Experience Studio Event Bus — internal platform events.
 */

import type { StudioEvent, StudioEventType } from "@/types/studio-platform";

type Listener = (event: StudioEvent) => void;

const listeners = new Map<StudioEventType | "*", Set<Listener>>();

export function onStudioEvent(
  type: StudioEventType | "*",
  listener: Listener,
): () => void {
  const set = listeners.get(type) ?? new Set<Listener>();
  set.add(listener);
  listeners.set(type, set);
  return () => {
    set.delete(listener);
  };
}

export function emitStudioEvent<T>(
  type: StudioEventType,
  payload: T,
): StudioEvent<T> {
  const event: StudioEvent<T> = {
    type,
    timestamp: new Date().toISOString(),
    payload,
  };

  for (const listener of listeners.get(type) ?? []) {
    listener(event);
  }
  for (const listener of listeners.get("*") ?? []) {
    listener(event);
  }

  return event;
}

export function clearStudioEvents(): void {
  listeners.clear();
}

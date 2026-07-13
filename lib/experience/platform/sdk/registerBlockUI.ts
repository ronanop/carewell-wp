/**
 * Client-side UI registry for block components / inspectors.
 * Server registry holds manifests; this holds React implementations.
 */

"use client";

import type { ComponentType, ReactNode } from "react";

export type BlockComponentProps = {
  props: Record<string, unknown>;
  children?: ReactNode;
};

type BlockUIEntry = {
  component: ComponentType<BlockComponentProps>;
  inspector?: ComponentType<{
    props: Record<string, unknown>;
    onChange: (next: Record<string, unknown>) => void;
  }>;
};

const uiRegistry = new Map<string, BlockUIEntry>();

export function registerBlockUI(
  componentKey: string,
  entry: BlockUIEntry,
): void {
  uiRegistry.set(componentKey, entry);
}

export function getBlockUI(componentKey: string): BlockUIEntry | undefined {
  return uiRegistry.get(componentKey);
}

export function listRegisteredUIKeys(): string[] {
  return [...uiRegistry.keys()].sort();
}

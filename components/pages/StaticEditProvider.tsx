"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { PresentationConfig } from "@/types/presentation-config";
import type { StaticPageMode } from "@/types/static-page-descriptor";

type StaticEditContextValue = {
  mode: StaticPageMode;
  config: PresentationConfig | null;
  pageSlug: string | null;
};

const StaticEditContext = createContext<StaticEditContextValue>({
  mode: "public",
  config: null,
  pageSlug: null,
});

/**
 * Provides edit mode + live config to EditableElement trees.
 * Public routes omit the provider (defaults to public).
 */
export function StaticEditProvider({
  mode,
  config,
  pageSlug = null,
  children,
}: {
  mode: StaticPageMode;
  config?: PresentationConfig | null;
  pageSlug?: string | null;
  children: ReactNode;
}) {
  return (
    <StaticEditContext.Provider
      value={{ mode, config: config ?? null, pageSlug }}
    >
      {children}
    </StaticEditContext.Provider>
  );
}

export function useStaticEditContext(): StaticEditContextValue {
  return useContext(StaticEditContext);
}

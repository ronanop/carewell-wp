/**
 * Editorial Component Registry — plugin-style resolution of semantic types → React.
 * Register new components without changing the renderer core.
 */

import type { ComponentType } from "react";

import type { SemanticSection, SemanticSectionType } from "@/types/semantic-article";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";
import type { EditorialPreset } from "@/types/semantic-article";

export type EditorialSectionProps = {
  section: SemanticSection;
  config: BlogPresentationConfig;
  preset: EditorialPreset;
  /** Fallback body when confidence is low or no specialist component. */
  fallback: React.ReactNode;
};

export type EditorialComponentRegistration = {
  type: SemanticSectionType;
  component: ComponentType<EditorialSectionProps>;
  /** Minimum confidence required; below this → fallback renderer. */
  minConfidence?: "high" | "medium" | "low";
};

const registry = new Map<SemanticSectionType, EditorialComponentRegistration>();

export function registerEditorialComponent(
  registration: EditorialComponentRegistration,
): void {
  registry.set(registration.type, registration);
}

export function getEditorialComponent(
  type: SemanticSectionType,
): EditorialComponentRegistration | undefined {
  return registry.get(type);
}

export function listEditorialComponents(): EditorialComponentRegistration[] {
  return [...registry.values()];
}

export function clearEditorialRegistryForTests(): void {
  registry.clear();
}

const CONFIDENCE_RANK = { low: 0, medium: 1, high: 2 } as const;

export function meetsConfidence(
  actual: "high" | "medium" | "low",
  required: "high" | "medium" | "low" = "medium",
): boolean {
  return CONFIDENCE_RANK[actual] >= CONFIDENCE_RANK[required];
}

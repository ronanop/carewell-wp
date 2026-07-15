/**
 * Element override helpers — PresentationConfig.elementOverrides (ADR-016).
 */

import type {
  ElementOverride,
  ElementOverrides,
} from "@/types/element-descriptor";
import type { PresentationConfig } from "@/types/presentation-config";

/** Legacy section prop keys → element paths (Hero ADR-015 → ADR-016). */
const LEGACY_PROP_TO_ELEMENT: Record<string, { elementId: string; field: string }> =
  {
    "home.hero:title": { elementId: "home.hero.heading", field: "text" },
    "home.hero:subtitle": { elementId: "home.hero.subtitle", field: "text" },
    "home.hero:imageSrc": { elementId: "home.hero.heroImage", field: "src" },
    "home.hero:backgroundSrc": {
      elementId: "home.hero.background",
      field: "src",
    },
  };

export function getElementOverride(
  config: PresentationConfig | null | undefined,
  elementId: string,
): ElementOverride {
  if (!config) return {};
  const direct = config.elementOverrides?.[elementId];
  if (direct) return { ...direct };

  // Back-compat: section propOverrides for home.hero.*
  const parts = elementId.split(".");
  if (parts.length >= 3) {
    const sectionId = `${parts[0]}.${parts[1]}`;
    const leaf = parts.slice(2).join(".");
    const legacyKey = `${sectionId}:${leaf === "heading" ? "title" : leaf === "heroImage" ? "imageSrc" : leaf === "background" ? "backgroundSrc" : leaf}`;
    const mapped = LEGACY_PROP_TO_ELEMENT[legacyKey];
    if (mapped && mapped.elementId === elementId) {
      const sectionProps = config.propOverrides?.[sectionId];
      const propKey =
        leaf === "heading"
          ? "title"
          : leaf === "heroImage"
            ? "imageSrc"
            : leaf === "background"
              ? "backgroundSrc"
              : leaf;
      const value = sectionProps?.[propKey];
      if (value !== undefined) {
        return { [mapped.field]: value };
      }
    }
  }

  return {};
}

export function resolveElementField<T = unknown>(
  config: PresentationConfig | null | undefined,
  elementId: string,
  field: string,
  fallback: T,
): T {
  const override = getElementOverride(config, elementId);
  const value = override[field];
  if (value === undefined || value === null || value === "") return fallback;
  return value as T;
}

export function resolveElementText(
  config: PresentationConfig | null | undefined,
  elementId: string,
  fallback: string,
  field = "text",
): string {
  const value = resolveElementField(config, elementId, field, fallback);
  return typeof value === "string" ? value : fallback;
}

export function setElementOverrideField(
  config: PresentationConfig,
  elementId: string,
  field: string,
  value: unknown,
): PresentationConfig {
  const prev = config.elementOverrides?.[elementId] ?? {};
  const nextFields: ElementOverride = { ...prev };
  if (value === undefined || value === "") {
    delete nextFields[field];
  } else {
    nextFields[field] = value;
  }

  const elementOverrides: ElementOverrides = {
    ...(config.elementOverrides ?? {}),
  };

  if (Object.keys(nextFields).length === 0) {
    delete elementOverrides[elementId];
  } else {
    elementOverrides[elementId] = nextFields;
  }

  return {
    ...config,
    elementOverrides,
  };
}

export function setElementOverrides(
  config: PresentationConfig,
  elementId: string,
  patch: ElementOverride,
): PresentationConfig {
  let next = config;
  for (const [field, value] of Object.entries(patch)) {
    next = setElementOverrideField(next, elementId, field, value);
  }
  return next;
}

export function listElementOverrides(
  config: PresentationConfig | null | undefined,
): ElementOverrides {
  return { ...(config?.elementOverrides ?? {}) };
}

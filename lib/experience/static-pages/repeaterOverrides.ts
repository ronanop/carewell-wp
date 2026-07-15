/**
 * Repeater + responsive + binding override helpers (ADR-017).
 */

import type {
  ElementBinding,
  RepeaterItem,
  RepeaterOverride,
  ResponsiveBreakpoint,
} from "@/types/repeater-descriptor";
import type { PresentationConfig } from "@/types/presentation-config";
import {
  resolveElementField,
  setElementOverrideField,
} from "@/lib/experience/static-pages/elementOverrides";

export function itemElementId(
  repeaterId: string,
  index: number,
  field: string,
): string {
  return `${repeaterId}.item.${index}.${field}`;
}

export function getRepeaterOverride(
  config: PresentationConfig | null | undefined,
  repeaterId: string,
): RepeaterOverride {
  return config?.repeaterOverrides?.[repeaterId] ?? {};
}

/**
 * Resolve repeater items: defaults → optional full snapshot → order/hidden →
 * per-field elementOverrides (desktop) + optional responsive patch.
 */
export function resolveRepeaterItems<T extends RepeaterItem>(
  config: PresentationConfig | null | undefined,
  repeaterId: string,
  defaults: T[],
  fields: string[],
  breakpoint: ResponsiveBreakpoint = "desktop",
): Array<T & { __index: number }> {
  const override = getRepeaterOverride(config, repeaterId);
  const baseItems = (override.items?.length ? override.items : defaults) as T[];

  let indexes = baseItems.map((_, index) => index);
  if (override.order?.length) {
    const seen = new Set<number>();
    const ordered: number[] = [];
    for (const index of override.order) {
      if (index >= 0 && index < baseItems.length && !seen.has(index)) {
        ordered.push(index);
        seen.add(index);
      }
    }
    for (const index of indexes) {
      if (!seen.has(index)) ordered.push(index);
    }
    indexes = ordered;
  }

  const hidden = new Set(override.hidden ?? []);

  return indexes
    .filter((index) => !hidden.has(index))
    .map((index) => {
      const base = { ...baseItems[index] } as T;
      const merged: Record<string, unknown> = { ...base };
      for (const field of fields) {
        const elementId = itemElementId(repeaterId, index, field);
        const fallback = base[field];
        let value = resolveElementField(config, elementId, "text", fallback);
        // Prefer explicit field key storage when present
        const direct = config?.elementOverrides?.[elementId];
        if (direct) {
          if (direct[field] !== undefined) value = direct[field];
          else if (direct.text !== undefined && (field === "title" || field === "label" || field === "heading" || field === "question" || field === "value" || field === "name")) {
            value = direct.text;
          } else if (direct.src !== undefined && (field === "imageSrc" || field === "src")) {
            value = direct.src;
          } else if (direct.label !== undefined && field === "label") {
            value = direct.label;
          } else if (direct.href !== undefined && field === "href") {
            value = direct.href;
          }
        }
        const responsive = config?.elementResponsive?.[elementId]?.[breakpoint];
        if (responsive) {
          if (responsive[field] !== undefined) value = responsive[field];
          else if (responsive.text !== undefined) value = responsive.text;
        }
        merged[field] = value;
      }
      return { ...(merged as T), __index: index };
    });
}

export function setRepeaterOverride(
  config: PresentationConfig,
  repeaterId: string,
  patch: Partial<RepeaterOverride>,
): PresentationConfig {
  const prev = config.repeaterOverrides?.[repeaterId] ?? {};
  return {
    ...config,
    repeaterOverrides: {
      ...config.repeaterOverrides,
      [repeaterId]: { ...prev, ...patch },
    },
  };
}

export function duplicateRepeaterItem(
  config: PresentationConfig,
  repeaterId: string,
  defaults: RepeaterItem[],
  index: number,
): PresentationConfig {
  const override = getRepeaterOverride(config, repeaterId);
  const items = [...(override.items?.length ? override.items : defaults)];
  if (index < 0 || index >= items.length) return config;
  items.splice(index + 1, 0, structuredClone(items[index]));
  return setRepeaterOverride(config, repeaterId, {
    items,
    order: undefined,
  });
}

export function removeRepeaterItem(
  config: PresentationConfig,
  repeaterId: string,
  defaults: RepeaterItem[],
  index: number,
  soft = true,
): PresentationConfig {
  if (soft) {
    const override = getRepeaterOverride(config, repeaterId);
    const hidden = new Set(override.hidden ?? []);
    hidden.add(index);
    return setRepeaterOverride(config, repeaterId, {
      hidden: Array.from(hidden),
    });
  }
  const override = getRepeaterOverride(config, repeaterId);
  const items = [...(override.items?.length ? override.items : defaults)];
  items.splice(index, 1);
  return setRepeaterOverride(config, repeaterId, { items, hidden: [], order: undefined });
}

export function addRepeaterItem(
  config: PresentationConfig,
  repeaterId: string,
  defaults: RepeaterItem[],
  template: RepeaterItem,
): PresentationConfig {
  const override = getRepeaterOverride(config, repeaterId);
  const items = [...(override.items?.length ? override.items : defaults), template];
  return setRepeaterOverride(config, repeaterId, { items });
}

export function reorderRepeaterItems(
  config: PresentationConfig,
  repeaterId: string,
  order: number[],
): PresentationConfig {
  return setRepeaterOverride(config, repeaterId, { order });
}

export function setElementBinding(
  config: PresentationConfig,
  elementOrRepeaterId: string,
  binding: ElementBinding,
): PresentationConfig {
  return {
    ...config,
    elementBindings: {
      ...config.elementBindings,
      [elementOrRepeaterId]: binding,
    },
  };
}

export function getElementBinding(
  config: PresentationConfig | null | undefined,
  id: string,
): ElementBinding {
  return config?.elementBindings?.[id] ?? { mode: "static" };
}

export function setResponsiveField(
  config: PresentationConfig,
  elementId: string,
  breakpoint: ResponsiveBreakpoint,
  field: string,
  value: unknown,
): PresentationConfig {
  const prev = config.elementResponsive?.[elementId] ?? {};
  const bp = { ...(prev[breakpoint] ?? {}) };
  if (value === undefined || value === "") delete bp[field];
  else bp[field] = value;
  return {
    ...config,
    elementResponsive: {
      ...config.elementResponsive,
      [elementId]: {
        ...prev,
        [breakpoint]: bp,
      },
    },
  };
}

/** Set a repeater item field into elementOverrides (primary field key). */
export function setRepeaterItemField(
  config: PresentationConfig,
  repeaterId: string,
  index: number,
  field: string,
  value: unknown,
): PresentationConfig {
  const elementId = itemElementId(repeaterId, index, field);
  return setElementOverrideField(config, elementId, field, value);
}

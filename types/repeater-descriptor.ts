/**
 * Repeater + binding + responsive contracts (Phase 4.10 / ADR-017).
 */

import type { ElementFieldSchema, ElementSupports } from "@/types/element-descriptor";

export type BindingMode = "static" | "wordpress" | "api" | "ai";

export type ElementBinding = {
  mode: BindingMode;
  /** e.g. wordpress.page.title, wordpress.cpt.doctor, wordpress.latestPosts */
  source?: string;
  /** Optional CPT / taxonomy / query hint */
  query?: string;
};

export type ResponsiveBreakpoint = "desktop" | "tablet" | "mobile";

/** Per-breakpoint field patches for one element. */
export type ResponsiveFieldOverrides = Partial<
  Record<ResponsiveBreakpoint, Record<string, unknown>>
>;

export type RepeaterItem = Record<string, unknown>;

export type RepeaterOverride = {
  /** Full item snapshots when structure diverges from defaults. */
  items?: RepeaterItem[];
  /** Display order (indexes into items). */
  order?: number[];
  /** Hidden indexes (soft delete). */
  hidden?: number[];
  binding?: ElementBinding;
};

export type RepeaterDescriptor = {
  id: string;
  displayName: string;
  sectionId: string;
  /** Field schema for each item. */
  itemFields: ElementFieldSchema[];
  itemSupports?: ElementSupports;
  minItems?: number;
  maxItems?: number;
  defaultItems: RepeaterItem[];
  bindingSources?: string[];
  allowAdd?: boolean;
  allowDelete?: boolean;
  allowDuplicate?: boolean;
  allowReorder?: boolean;
};

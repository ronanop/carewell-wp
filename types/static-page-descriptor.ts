/**
 * Static page / section descriptors (Phase 4.8 / ADR-015).
 * Serializable metadata only — React components live on StaticPageModule.
 */

import type { SectionType } from "@/types/presentation-config";
import type { StaticPageCategory, StaticPageSlug } from "@/types/static-page";

export type StaticPageMode = "public" | "editor";

export type SectionPropType =
  | "text"
  | "textarea"
  | "image"
  | "select"
  | "boolean"
  | "number"
  | "url";

export type SectionPropSchema = {
  key: string;
  label: string;
  type: SectionPropType;
  group?: string;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: string }>;
  /** Optional responsive values (desktop / tablet / mobile). */
  responsive?: boolean;
  description?: string;
};

export type SectionSupports = {
  resize?: boolean;
  drag?: boolean;
  animation?: boolean;
  responsive?: boolean;
  duplicatable?: boolean;
  resizable?: boolean;
};

export type SectionDescriptor = {
  id: string;
  displayName: string;
  /** Maps to PresentationConfig SectionType for storage compat. */
  type: SectionType;
  defaultVariant?: string;
  editableProps: SectionPropSchema[];
  /** Phase 4.9 — canvas-editable child elements. */
  elements?: import("@/types/element-descriptor").ElementDescriptor[];
  supports: SectionSupports;
  inspectorPanels?: string[];
  bindings?: string[];
  /** Legacy hyphenated ids accepted when reading overrides. */
  legacyIds?: string[];
};

export type StaticPageDescriptor = {
  id: StaticPageSlug;
  title: string;
  route: string;
  category: StaticPageCategory;
  description: string;
  templateSlug: string;
  sections: SectionDescriptor[];
  breakpoints?: Array<"desktop" | "tablet" | "mobile">;
  constraints?: {
    /** Sections that cannot be deleted from the tree. */
    lockedSectionIds?: string[];
  };
  toolbarActions?: string[];
};

export type StaticPageViewProps = {
  mode: StaticPageMode;
  config?: import("@/types/presentation-config").PresentationConfig | null;
};

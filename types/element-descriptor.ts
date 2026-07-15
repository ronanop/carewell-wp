/**
 * Element descriptors — universal content editing (Phase 4.9 / ADR-016).
 * Serializable only; React wraps via EditableElement.
 */

export type ElementPropType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "media"
  | "color"
  | "gradient"
  | "boolean"
  | "number"
  | "range"
  | "spacing"
  | "typography"
  | "icon"
  | "link"
  | "select"
  | "repeater"
  | "json"
  | "binding";

export type ElementKind =
  | "heading"
  | "paragraph"
  | "caption"
  | "label"
  | "badge"
  | "button"
  | "image"
  | "icon"
  | "statistic"
  | "card"
  | "link"
  | "list-item"
  | "form-field"
  | "map"
  | "repeater"
  | "generic";

export type ElementFieldSchema = {
  key: string;
  label: string;
  type: ElementPropType;
  group?:
    | "Content"
    | "Typography"
    | "Layout"
    | "Spacing"
    | "Background"
    | "Border"
    | "Effects"
    | "Animation"
    | "Responsive"
    | "Accessibility"
    | "Bindings"
    | "Advanced";
  defaultValue?: unknown;
  options?: Array<{ label: string; value: string }>;
  responsive?: boolean;
  description?: string;
  /** For range / number */
  min?: number;
  max?: number;
  step?: number;
};

export type ElementSupports = {
  inlineEdit?: boolean;
  replaceMedia?: boolean;
  crop?: boolean;
  duplicate?: boolean;
  delete?: boolean;
  reorder?: boolean;
  bind?: boolean;
  responsive?: boolean;
  animation?: boolean;
};

/**
 * One editable surface on the canvas (heading, button label, image, …).
 * id is a stable dotted path, e.g. home.hero.heading
 */
export type ElementDescriptor = {
  id: string;
  displayName: string;
  kind: ElementKind;
  /** Parent section id (home.hero). */
  sectionId: string;
  fields: ElementFieldSchema[];
  supports: ElementSupports;
  /** Primary field used for inline text editing. */
  inlineField?: string;
  defaultValues?: Record<string, unknown>;
  bindingSources?: string[];
};

/** Stored override for one element — field key → value. */
export type ElementOverride = Record<string, unknown>;

/** PresentationConfig.elementOverrides — elementId → fields. */
export type ElementOverrides = Record<string, ElementOverride>;

export type ButtonElementValue = {
  label?: string;
  href?: string;
  variant?: string;
};

export type ImageElementValue = {
  src?: string;
  alt?: string;
  mediaId?: number;
  objectFit?: "cover" | "contain" | "fill";
  objectPosition?: string;
};

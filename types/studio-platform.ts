/**
 * Experience Studio Platform — core types.
 * Blocks are discovered via the Plugin SDK; components never talk to WordPress.
 */

import type { ZodType } from "zod";

/** Binding source kinds — CMS-agnostic. */
export type BindingKind =
  | "static"
  | "field"
  | "computed"
  | "expression"
  | "api";

/**
 * Declares how a single prop is filled.
 * Components only ever receive resolved primitive props.
 */
export type PropBinding = {
  kind: BindingKind;
  /** Dot-path into BindingContext, e.g. `page.title`, `doctor.name`. */
  path?: string;
  /** Literal value when kind is static. */
  value?: unknown;
  /** Named computed resolver, e.g. `featuredImageOrFallback`. */
  compute?: string;
  /** Future expression DSL (stored, not evaluated until expression engine ships). */
  expression?: string;
  /** Future remote API binding key. */
  apiKey?: string;
};

export type BindingSchema = Record<string, PropBinding>;

export type RuleOperator =
  | "exists"
  | "notExists"
  | "equals"
  | "notEquals"
  | "includes"
  | "truthy"
  | "falsy";

export type VisibilityRule = {
  id: string;
  description?: string;
  /** Dot-path into BindingContext / runtime context. */
  path: string;
  operator: RuleOperator;
  value?: unknown;
};

export type DeviceVisibility = "always" | "desktop" | "mobile" | "tablet";

export type BlockRules = {
  visibility?: DeviceVisibility;
  /** All rules must pass (AND). Empty = always show. */
  when?: VisibilityRule[];
  /** Template / page-type gates. */
  templates?: string[];
  themes?: string[];
  /** Future targeting slots — stored, ignored until engines support them. */
  schedule?: {
    startAt?: string | null;
    endAt?: string | null;
  } | null;
  geo?: string[] | null;
  campaign?: string[] | null;
  abVariant?: string | null;
  locales?: string[] | null;
  requireAuth?: boolean | null;
};

export type ResponsiveSchema = {
  minWidth?: number | null;
  maxWidth?: number | null;
  hideOn?: Array<"mobile" | "tablet" | "desktop">;
};

export type AnimationSchema = {
  preset?: "none" | "fade" | "rise" | "inherit";
  delayMs?: number;
};

export type ThemeCompatibility = {
  tokens: string[];
  themes?: string[];
};

export type BlockCapabilities = {
  resizable?: boolean;
  croppable?: boolean;
  draggable?: boolean;
  editableText?: boolean;
  repeatable?: boolean;
  nestable?: boolean;
  responsive?: boolean;
  supportsVariants?: boolean;
  supportsBindings?: boolean;
};

/**
 * Marketplace-ready block manifesto.
 * Owned by each block pack — never hardcoded into the builder core.
 */
export type BlockManifest = {
  id: string;
  displayName: string;
  category: string;
  version: string;
  author: string;
  description: string;
  packId: string;
  icon?: string;
  thumbnail?: string;
  supportedTemplates?: string[];
  defaultProps: Record<string, unknown>;
  bindingSchema: BindingSchema;
  inspectorSchema?: Record<string, unknown>;
  responsiveSchema?: ResponsiveSchema;
  animationSchema?: AnimationSchema;
  themeCompatibility?: ThemeCompatibility;
  minimumWidth?: number | null;
  maximumWidth?: number | null;
  /** Whether this block may nest children. */
  acceptsChildren?: boolean;
  /** Allowed child block category/id filters. */
  allowedChildCategories?: string[];
  allowedChildIds?: string[];
  /** Editor tools enabled from declaration — never hardcode in overlays. */
  capabilities?: BlockCapabilities;
};

export type BlockDefinition = {
  manifest: BlockManifest;
  /** Zod validation for persisted props. */
  schema: ZodType<Record<string, unknown>>;
  bindings: BindingSchema;
  /** Client UI registry keys — resolved only in the browser. */
  componentKey: string;
  inspectorKey: string;
};

/**
 * Instance node in a composition tree (supports nesting).
 */
export type BlockNode = {
  instanceId: string;
  blockId: string;
  version: string;
  props: Record<string, unknown>;
  bindings?: BindingSchema;
  rules?: BlockRules;
  children?: BlockNode[];
};

/**
 * Document stored alongside / migrating from PresentationConfig.
 */
export type BlockDocument = {
  schemaVersion: 1;
  packIds: string[];
  root: BlockNode[];
  themeId: string;
  meta?: {
    generatedBy?: "editor" | "ai" | "template" | "migration";
    notes?: string | null;
  };
};

/** Runtime context fed to the Binding Engine — never passed to React components. */
export type BindingContext = {
  page: {
    title: string;
    uri: string;
    slug: string;
    contentHtml: string;
    featuredImage: {
      url: string | null;
      alt: string | null;
      width: number | null;
      height: number | null;
    } | null;
    seo: {
      title: string | null;
      metaDesc: string | null;
      canonical: string | null;
      ogImage: string | null;
    };
  };
  doctor?: {
    name: string | null;
    designation: string | null;
    photoUrl: string | null;
  } | null;
  site?: {
    name: string;
    phone: string | null;
  };
  theme: {
    id: string;
    variant: string;
  };
  runtime: {
    device: "mobile" | "tablet" | "desktop";
    path: string;
    isHomepage: boolean;
    locale: string;
    now: string;
  };
  custom?: Record<string, unknown>;
};

export type DesignTokens = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    border: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
    scale: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
    };
  };
  animation: {
    durationFast: string;
    durationBase: string;
    durationSlow: string;
    easing: string;
  };
};

export type StudioEventType =
  | "BlockAdded"
  | "BlockRemoved"
  | "BlockMoved"
  | "ThemeChanged"
  | "MediaChanged"
  | "TemplateApplied"
  | "PresentationPublished"
  | "PackRegistered"
  | "AiLayoutGenerated";

export type StudioEvent<T = unknown> = {
  type: StudioEventType;
  timestamp: string;
  payload: T;
};

export type AiLayoutRequest = {
  prompt: string;
  templateSlug?: string | null;
  packIds?: string[];
};

export type AiLayoutResult = {
  document: BlockDocument;
  rationale?: string;
};

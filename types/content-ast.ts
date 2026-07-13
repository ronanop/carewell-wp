/**
 * Content AST — decomposed WordPress HTML for Experience Studio visual editing.
 * WordPress HTML remains source of truth; overrides live in PresentationConfig.
 */

export type ContentNodeType =
  | "heading"
  | "paragraph"
  | "image"
  | "gallery"
  | "video"
  | "quote"
  | "table"
  | "list"
  | "list-item"
  | "button"
  | "callout"
  | "code"
  | "divider"
  | "faq"
  | "embed"
  | "figure"
  | "link"
  | "span"
  | "custom-html"
  | "group";

export type ContentSource = "wordpress" | "studio";

export type ContentInlineMark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "underline" }
  | { type: "code" }
  | { type: "link"; href: string; target?: string; rel?: string }
  | { type: "highlight"; color?: string };

export type ContentTextRun = {
  text: string;
  marks?: ContentInlineMark[];
};

export type ContentNodeStyles = {
  margin?: Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  padding?: Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  maxWidth?: number | null;
  width?: string | null;
  height?: string | null;
  textAlign?: "left" | "center" | "right" | "justify" | null;
  fontSize?: number | null;
  fontWeight?: number | string | null;
  color?: string | null;
  background?: string | null;
  borderRadius?: number | null;
  opacity?: number | null;
  objectFit?: "cover" | "contain" | "fill" | "none" | null;
  objectPosition?: string | null;
  /** Direct manipulation — percentages 0–100 */
  objectPositionX?: number | null;
  objectPositionY?: number | null;
  /** Zoom inside frame (1 = 100%) */
  imageScale?: number | null;
  /** Crop as % of natural image — never mutates WordPress media */
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  boxShadow?: string | null;
  filter?: string | null;
  rotate?: number | null;
};

export type ContentNodeResponsive = {
  desktop?: ContentNodeStyles;
  tablet?: ContentNodeStyles;
  mobile?: ContentNodeStyles;
};

export type ContentNodeAttributes = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  href?: string;
  target?: string;
  rel?: string;
  src?: string;
  alt?: string;
  title?: string;
  width?: number | null;
  height?: number | null;
  caption?: string | null;
  loading?: "lazy" | "eager" | null;
  listStyle?: "bulleted" | "numbered" | "checklist";
  calloutTone?: "tip" | "warning" | "success" | "info" | "danger";
  buttonVariant?: "primary" | "secondary" | "outline" | "ghost";
  buttonSize?: "sm" | "md" | "lg";
  className?: string;
  rawTag?: string;
  /** Original outer HTML for custom-html / lossless fallback */
  rawHtml?: string;
  [key: string]: unknown;
};

export type ContentNode = {
  id: string;
  type: ContentNodeType;
  source: ContentSource;
  /** Deterministic fingerprint of original WP markup (for override matching). */
  fingerprint: string;
  children: ContentNode[];
  /** Plain / marked text for leaf text blocks */
  runs?: ContentTextRun[];
  attributes: ContentNodeAttributes;
  styles: ContentNodeStyles;
  bindings: Record<string, string>;
  animations: {
    preset?: "none" | "fade" | "rise" | "scale" | null;
    delayMs?: number;
  };
  responsive: ContentNodeResponsive;
  visibility: "always" | "desktop" | "mobile" | "hidden";
  metadata: {
    wpBlockClass?: string | null;
    order: number;
    locked?: boolean;
  };
};

export type ContentDocument = {
  version: 1;
  /** SHA of source HTML used to build this tree */
  sourceHash: string;
  nodes: ContentNode[];
};

/** Per-node visual / content overrides — never mutates WordPress HTML. */
export type ContentNodeOverride = {
  text?: string | null;
  runs?: ContentTextRun[] | null;
  attributes?: Partial<ContentNodeAttributes>;
  styles?: ContentNodeStyles;
  responsive?: ContentNodeResponsive;
  visibility?: ContentNode["visibility"];
  animations?: ContentNode["animations"];
  bindings?: Record<string, string>;
  hidden?: boolean;
  locked?: boolean;
};

export type ContentOverrides = {
  /** Keyed by stable node id (or fingerprint fallback). */
  nodes: Record<string, ContentNodeOverride>;
  /** Optional reorder of top-level wordpress node ids. */
  order: string[] | null;
  /** Studio-inserted nodes not present in WordPress HTML. */
  insertions: ContentNode[];
};

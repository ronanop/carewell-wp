/**
 * Phase 6.2 — Editorial layout composition types.
 * Presentation only; never mutates WordPress content.
 */

import type { SemanticSection, SemanticSectionType } from "@/types/semantic-article";

/** Image fit — Original never crops. Cover only when explicitly chosen. */
export type EditorialImageFit =
  | "original"
  | "contain"
  | "cover"
  | "fill"
  | "responsive"
  | "editorial-portrait"
  | "editorial-landscape";

export type EditorialImagePosition =
  | "top"
  | "center"
  | "bottom"
  | "left"
  | "right"
  | "custom";

export type HeroLayoutVariant =
  | "editorial"
  | "magazine"
  | "split-left"
  | "split-right"
  | "full-bleed"
  | "floating-card"
  | "minimal"
  | "medical-journal"
  | "luxury"
  | "center-focus"
  | "image-focus";

export type ArticleLayoutTemplateId =
  | "treatment-guide"
  | "medical-research"
  | "celebrity-health"
  | "faq-heavy"
  | "cost-guide"
  | "before-after-showcase"
  | "recovery-guide"
  | "long-form-editorial";

export type SpacingPreset =
  | "compact"
  | "comfortable"
  | "luxury"
  | "magazine"
  | "medical";

export type SectionBackground =
  | "none"
  | "light"
  | "muted"
  | "accent"
  | "dark"
  | "card"
  | "split"
  | "cream"
  | "editorial";

export type SectionWidth = "narrow" | "measure" | "wide" | "full";

export type SectionVariant =
  | "default"
  | "grid"
  | "cards"
  | "icons"
  | "magazine"
  | "horizontal"
  | "timeline"
  | "stepper"
  | "accordion"
  | "checklist"
  | "journal"
  | "highlight"
  | "dark-block"
  | "floating"
  | "banner"
  | "split"
  | "minimal"
  | "large";

export type ImagePlacement =
  | "none"
  | "full-width"
  | "inline"
  | "floating"
  | "side-by-side"
  | "editorial-offset"
  | "gallery"
  | "before-after"
  | "sticky";

export type HeroMediaConfig = {
  fit: EditorialImageFit;
  position: EditorialImagePosition;
  positionX?: number;
  positionY?: number;
  aspectRatio?: string | null;
  borderRadius?: number;
  containerHeight?: "auto" | "sm" | "md" | "lg" | "xl";
  overlayEnabled?: boolean;
  overlayOpacity?: number;
  backgroundBlur?: boolean;
  shadow?: boolean;
  scale?: number;
  parallax?: boolean;
  layoutVariant?: HeroLayoutVariant;
  responsive?: {
    desktop?: Partial<HeroMediaConfig>;
    tablet?: Partial<HeroMediaConfig>;
    mobile?: Partial<HeroMediaConfig>;
  };
};

export type ComposedSection = {
  section: SemanticSection;
  variant: SectionVariant;
  background: SectionBackground;
  width: SectionWidth;
  spacing: SpacingPreset;
  imagePlacement: ImagePlacement;
  showInlineCta: boolean;
  separator: "none" | "line" | "fade" | "space";
  /** Visual weight 1–5 for rhythm engine. */
  visualWeight: number;
  /**
   * Phase 8.1 — Experience Composition polish (presentation only).
   * Optional for backward compatibility with older compositions.
   */
  presentationMode?: SectionPresentationMode;
  importance?: SectionImportance;
  spacingTokens?: SectionSpacingTokens;
  cardStyle?: SectionCardStyle;
  /** Contextual inline CTA copy when showInlineCta is true. */
  ctaCopy?: {
    title: string;
    body: string;
    label: string;
  };
};

/** Presentation modes — calm medical editorial, never flashy. */
export type SectionPresentationMode =
  | "editorial"
  | "minimal"
  | "premium-card"
  | "split"
  | "highlight"
  | "soft-surface"
  | "cream"
  | "light-tint"
  | "full-width"
  | "compact"
  | "wide-reading";

export type SectionImportance = "primary" | "secondary" | "tertiary";

export type SectionCardStyle =
  | "minimal"
  | "editorial"
  | "medical"
  | "glass"
  | "highlight"
  | "comparison"
  | "statistics"
  | "warning"
  | "research"
  | "timeline"
  | "none";

/** Neighbor-aware spacing — pixel-ish rem tokens applied as CSS variables. */
export type SectionSpacingTokens = {
  top: "tight" | "snug" | "normal" | "relaxed" | "loose";
  bottom: "tight" | "snug" | "normal" | "relaxed" | "loose";
  paddingY: "none" | "sm" | "md" | "lg";
  contentGap: "sm" | "md" | "lg";
  mediaGap: "sm" | "md" | "lg";
  divider: "none" | "line" | "fade" | "space";
};

/** Studio-facing presentation polish overlay (ExperienceConfig). */
export type ExperiencePresentationPolish = {
  /** Prefer cream/soft surfaces over flat white. */
  preferSoftSurfaces?: boolean;
  /** Default card style for grid/card sections. */
  defaultCardStyle?: SectionCardStyle;
  /** Tighten first content section under hero. */
  tightHeroHandoff?: boolean;
  /** Reading measure: narrow (~68ch) | comfortable (~72ch) | wide (~75ch). */
  readingMeasure?: "narrow" | "comfortable" | "wide";
  /** Button hierarchy for ContactActions groups. */
  buttonHierarchy?: "primary-secondary-tertiary" | "primary-only";
};

export type LayoutComposition = {
  templateId: ArticleLayoutTemplateId;
  heroLayout: HeroLayoutVariant;
  spacingPreset: SpacingPreset;
  sections: ComposedSection[];
  /** Validator notes (non-blocking). */
  validationNotes: string[];
};

export type LayoutComposerInput = {
  sections: SemanticSection[];
  /** Counts / signals from semantic analysis. */
  signals: {
    faqCount: number;
    hasProcedure: boolean;
    hasCost: boolean;
    hasResearch: boolean;
    hasBeforeAfter: boolean;
    hasRecovery: boolean;
    hasBenefits: boolean;
    hasRisks: boolean;
    readingMinutes: number;
    sectionCount: number;
  };
  overrides?: {
    templateId?: ArticleLayoutTemplateId | null;
    heroLayout?: HeroLayoutVariant | null;
    spacingPreset?: SpacingPreset | null;
    sectionVariants?: Record<string, SectionVariant>;
    /** Phase 8.1 presentation polish (Studio). */
    presentationPolish?: ExperiencePresentationPolish | null;
  };
};

export const DEFAULT_HERO_MEDIA: HeroMediaConfig = {
  fit: "original",
  position: "center",
  containerHeight: "auto",
  overlayEnabled: true,
  overlayOpacity: 0.2,
  shadow: true,
  scale: 1,
  layoutVariant: "editorial",
};

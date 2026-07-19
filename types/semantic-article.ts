/**
 * Semantic Article model — output of the Semantic Analysis Engine.
 * Independent from Presentation Engine; never mutates WordPress content.
 */

import type { ArticleDocument, ArticleFaqItem } from "@/types/article-ast";
import type { ContentNode } from "@/types/content-ast";

/** Deterministic section classifications for medical editorial content. */
export type SemanticSectionType =
  | "INTRODUCTION"
  | "SUMMARY"
  | "KEY_TAKEAWAYS"
  | "BENEFITS"
  | "RISKS"
  | "SIDE_EFFECTS"
  | "PROCEDURE"
  | "STEP_BY_STEP"
  | "RECOVERY"
  | "PREPARATION"
  | "COST"
  | "TIMELINE"
  | "COMPARISON"
  | "RESEARCH"
  | "STATISTICS"
  | "FAQ"
  | "DOCTOR_ADVICE"
  | "CONCLUSION"
  | "REFERENCES"
  | "VIDEO"
  | "TESTIMONIAL"
  | "IMAGE_GALLERY"
  | "RESULTS"
  | "WARNING"
  | "MEDICAL_DISCLAIMER"
  | "WHEN_TO_CONTACT"
  | "ELIGIBILITY"
  | "AFTERCARE"
  | "BEFORE_AFTER"
  | "FACT"
  | "QUOTE"
  | "TECHNOLOGY"
  | "GALLERY"
  | "LOCATION"
  | "CONTACT"
  | "INSURANCE"
  | "CONSULTATION"
  | "TESTIMONIALS"
  | "REVIEWS"
  | "GENERIC";

export type SemanticConfidence = "high" | "medium" | "low";

export type SemanticSection = {
  id: string;
  type: SemanticSectionType;
  /** Confidence — low/GENERIC triggers RichContent fallback for body nodes. */
  confidence: SemanticConfidence;
  /** Matching rule id for debugging / Studio inspector. */
  ruleId: string | null;
  title: string | null;
  anchorId: string | null;
  /** Content AST nodes belonging to this section (heading + body until next H2). */
  nodes: ContentNode[];
  /** Extracted list items when applicable. */
  listItems: string[];
  /** FAQ items if type === FAQ (document-level or section-local). */
  faqs: ArticleFaqItem[];
  /** Heading level that opened this section (2–4), or null for pre-heading intro. */
  headingLevel: 2 | 3 | 4 | null;
};

export type SemanticAnalysisResult = {
  version: 1;
  sections: SemanticSection[];
  /** Document-level FAQ (Yoast-lifted) not nested under a heading. */
  documentFaqs: ArticleFaqItem[];
};

export type EditorialPresetId =
  | "editorial"
  | "medical-journal"
  | "magazine"
  | "luxury"
  | "minimal";

export type EditorialPreset = {
  id: EditorialPresetId;
  label: string;
  description: string;
  /** CSS modifier class on the article root. */
  className: string;
  typography: {
    readingWidth: "narrow" | "article" | "wide";
    headingScale: "quiet" | "editorial" | "bold" | "display";
    paragraphSpacing: "compact" | "default" | "spacious";
  };
  hero: {
    variant: "editorial" | "magazine" | "minimal" | "luxury";
    overlay: "gradient" | "soft" | "none";
  };
  density: "airy" | "balanced" | "compact";
};

/** Article document + semantic analysis for the editorial renderer. */
export type SemanticArticle = {
  article: ArticleDocument;
  semantic: SemanticAnalysisResult;
};

/**
 * Article AST — semantic editorial tree derived from WordPress blog HTML.
 * Parallel to Content AST (`types/content-ast.ts`) with blog-specific block kinds.
 * WordPress HTML remains source of truth; this tree never mutates WP content.
 */

import type { ContentDocument, ContentNode } from "@/types/content-ast";

/** Editorial block kinds layered on top of Content AST nodes. */
export type ArticleBlockKind =
  | "toc-source"
  | "key-takeaways"
  | "faq-item"
  | "faq-group"
  | "warning"
  | "fact-box"
  | "research"
  | "pros-cons"
  | "comparison"
  | "timeline"
  | "checklist"
  | "doctor-recommendation"
  | "medical-disclaimer"
  | "summary"
  | "callout"
  | "standard";

export type ArticleTocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
  nodeId: string;
};

export type ArticleFaqItem = {
  id: string;
  question: string;
  answerHtml: string;
  answerText: string;
};

export type ArticleBlockMeta = {
  kind: ArticleBlockKind;
  /** Stable anchor id for TOC / deep links (from WP or generated). */
  anchorId?: string | null;
  faq?: ArticleFaqItem | null;
  takeawayItems?: string[] | null;
};

/**
 * ArticleDocument wraps a ContentDocument with editorial enrichment.
 * `content` holds the typed block tree; `meta` holds document-level analytics hooks.
 */
export type ArticleDocument = {
  version: 1;
  /** Content AST built from WordPress HTML (after TOC strip / FAQ lift). */
  content: ContentDocument;
  /** Per-node editorial metadata keyed by ContentNode.id */
  blockMeta: Record<string, ArticleBlockMeta>;
  toc: ArticleTocItem[];
  faqs: ArticleFaqItem[];
  readingTimeMinutes: number;
  wordCount: number;
  /** SHA of original WP HTML before enrichment transforms. */
  sourceHash: string;
};

export type ArticleRenderNode = {
  node: ContentNode;
  meta: ArticleBlockMeta;
};

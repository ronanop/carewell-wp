/**
 * Semantic Analysis Engine — groups Article AST nodes into classified sections.
 * Deterministic only. Never mutates WordPress / AST source.
 */

import { ensureMedicalCoreSemanticRules } from "@/lib/experience/blog/semantic/medicalCoreRules";
import {
  evaluateSemanticRules,
  nodePlainText,
  type SemanticRuleContext,
} from "@/lib/experience/blog/semantic/ruleRegistry";
import type { ArticleDocument } from "@/types/article-ast";
import type { ContentNode } from "@/types/content-ast";
import type {
  SemanticAnalysisResult,
  SemanticSection,
  SemanticSectionType,
} from "@/types/semantic-article";

function extractListItems(nodes: ContentNode[]): string[] {
  const items: string[] = [];
  for (const node of nodes) {
    if (node.type === "list") {
      for (const child of node.children) {
        if (child.type === "list-item") {
          const text = nodePlainText(child).trim();
          if (text) items.push(text);
        }
      }
    }
  }
  return items;
}

function collectSignals(nodes: ContentNode[]): Omit<
  SemanticRuleContext,
  "headingText" | "headingLevel" | "previousType" | "index"
> {
  const bodyParts: string[] = [];
  const nodeTypes: string[] = [];
  let hasTable = false;
  let hasImage = false;
  let hasVideo = false;
  let hasQuote = false;

  for (const node of nodes) {
    nodeTypes.push(node.type);
    if (node.type !== "heading") {
      bodyParts.push(nodePlainText(node));
    }
    if (node.type === "table") hasTable = true;
    if (node.type === "image" || node.type === "figure" || node.type === "gallery") {
      hasImage = true;
    }
    if (node.type === "video" || node.type === "embed") hasVideo = true;
    if (node.type === "quote") hasQuote = true;
  }

  return {
    bodyText: bodyParts.join(" ").replace(/\s+/g, " ").trim(),
    listItems: extractListItems(nodes),
    hasTable,
    hasImage,
    hasVideo,
    hasQuote,
    nodeTypes,
  };
}

/**
 * Split flat AST nodes into sections: optional leading intro, then each H2+ chunk.
 */
function splitIntoChunks(nodes: ContentNode[]): Array<{
  heading: ContentNode | null;
  body: ContentNode[];
}> {
  const chunks: Array<{ heading: ContentNode | null; body: ContentNode[] }> = [];
  let current: { heading: ContentNode | null; body: ContentNode[] } = {
    heading: null,
    body: [],
  };

  for (const node of nodes) {
    const isSectionBreak =
      node.type === "heading" && (node.attributes.level ?? 2) <= 2;

    if (isSectionBreak) {
      if (current.heading || current.body.length) {
        chunks.push(current);
      }
      current = { heading: node, body: [] };
    } else {
      current.body.push(node);
    }
  }

  if (current.heading || current.body.length) {
    chunks.push(current);
  }

  return chunks;
}

/**
 * Analyze an ArticleDocument into semantic sections.
 */
export function analyzeArticleSemantics(
  article: ArticleDocument,
): SemanticAnalysisResult {
  ensureMedicalCoreSemanticRules();

  const chunks = splitIntoChunks(article.content.nodes);
  const sections: SemanticSection[] = [];
  let previousType: SemanticSectionType | null = null;

  chunks.forEach((chunk, index) => {
    const headingText = chunk.heading
      ? nodePlainText(chunk.heading).trim()
      : "";
    const headingLevel = chunk.heading
      ? ((chunk.heading.attributes.level ?? 2) as 2 | 3 | 4)
      : null;
    const allNodes = chunk.heading
      ? [chunk.heading, ...chunk.body]
      : chunk.body;
    const signals = collectSignals(allNodes);

    const ctx: SemanticRuleContext = {
      headingText,
      headingLevel,
      previousType,
      index,
      ...signals,
    };

    const evaluated = evaluateSemanticRules(ctx);
    const type = evaluated?.match.type ?? "GENERIC";
    const confidence = evaluated?.match.confidence ?? "low";
    const ruleId = evaluated?.ruleId ?? null;

    // Prefer document blockMeta for takeaways / FAQ headings
    const headingMeta = chunk.heading
      ? article.blockMeta[chunk.heading.id]
      : null;
    let resolvedType = type;
    let resolvedConfidence = confidence;

    if (headingMeta?.kind === "key-takeaways") {
      resolvedType = "KEY_TAKEAWAYS";
      resolvedConfidence = "high";
    } else if (headingMeta?.kind === "faq-group") {
      resolvedType = "FAQ";
      resolvedConfidence = "high";
    } else if (headingMeta?.kind === "warning") {
      resolvedType = "WARNING";
      resolvedConfidence = "high";
    } else if (headingMeta?.kind === "medical-disclaimer") {
      resolvedType = "MEDICAL_DISCLAIMER";
      resolvedConfidence = "high";
    }

    const anchorId =
      headingMeta?.anchorId ??
      (chunk.heading
        ? (typeof chunk.heading.attributes.title === "string"
            ? chunk.heading.attributes.title
            : null)
        : null);

    const listItems =
      headingMeta?.takeawayItems?.length
        ? headingMeta.takeawayItems
        : signals.listItems;

    sections.push({
      id: `sec-${index}-${chunk.heading?.id ?? "intro"}`,
      type: resolvedType,
      confidence: resolvedConfidence,
      ruleId:
        headingMeta?.kind && headingMeta.kind !== "standard"
          ? `blockMeta.${headingMeta.kind}`
          : ruleId,
      title: headingText || null,
      anchorId,
      nodes: allNodes,
      listItems,
      faqs: resolvedType === "FAQ" ? [] : [],
      headingLevel,
    });

    previousType = resolvedType;
  });

  // Append document FAQs as a dedicated section if not already present
  if (article.faqs.length > 0 && !sections.some((s) => s.type === "FAQ")) {
    sections.push({
      id: "sec-document-faq",
      type: "FAQ",
      confidence: "high",
      ruleId: "document.yoast-faq",
      title: "FAQs",
      anchorId: "faqs",
      nodes: [],
      listItems: [],
      faqs: article.faqs,
      headingLevel: 2,
    });
  } else if (article.faqs.length > 0) {
    const faqSection = sections.find((s) => s.type === "FAQ");
    if (faqSection && faqSection.faqs.length === 0) {
      faqSection.faqs = article.faqs;
    }
  }

  return {
    version: 1,
    sections,
    documentFaqs: article.faqs,
  };
}

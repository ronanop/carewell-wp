/**
 * Article AST — convert WordPress blog HTML into a semantic editorial tree.
 *
 * Pipeline:
 *   WP HTML → strip plugin TOC → lift Yoast FAQ → parseHtmlToAst (Content AST)
 *   → enrich headings/FAQ/takeaways → ArticleDocument
 *
 * Never mutates WordPress. Foundation for AI summarization, annotations,
 * citations, per-block editing, localization, and content analytics.
 */

import { parse } from "node-html-parser";

import { parseHtmlToAst } from "@/lib/experience/content/parseHtmlToAst";
import { fingerprintFromHtml } from "@/lib/experience/content/stableId";
import {
  countWords,
  estimateReadingTimeMinutes,
  stripHtmlToText,
} from "@/lib/blog/readingTime";
import type {
  ArticleBlockKind,
  ArticleBlockMeta,
  ArticleDocument,
  ArticleFaqItem,
  ArticleTocItem,
} from "@/types/article-ast";
import type { ContentNode } from "@/types/content-ast";

function slugifyAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

function nodePlainText(node: ContentNode): string {
  if (node.runs?.length) {
    return node.runs.map((r) => r.text).join("");
  }
  return node.children.map(nodePlainText).join(" ");
}

/**
 * Remove Easy TOC / similar plugin containers — we generate our own TOC.
 */
export function stripPluginToc(html: string): string {
  const root = parse(`<div id="cw-strip-root">${html}</div>`);
  const container = root.querySelector("#cw-strip-root");
  if (!container) return html;

  container
    .querySelectorAll(
      "#ez-toc-container, .ez-toc-v2_0_85, .ez-toc-container, .toc-container, .wp-block-rank-math-toc-block",
    )
    .forEach((el) => el.remove());

  return container.innerHTML;
}

/**
 * Extract Yoast FAQ blocks and remove them from HTML (re-rendered as accordion).
 */
export function extractAndRemoveFaqs(html: string): {
  html: string;
  faqs: ArticleFaqItem[];
} {
  const root = parse(`<div id="cw-faq-root">${html}</div>`);
  const container = root.querySelector("#cw-faq-root");
  if (!container) return { html, faqs: [] };

  const faqs: ArticleFaqItem[] = [];
  const sections = container.querySelectorAll(
    ".schema-faq-section, .wp-block-yoast-faq-block .schema-faq-section",
  );

  sections.forEach((section, index) => {
    const qEl =
      section.querySelector(".schema-faq-question") ??
      section.querySelector("strong");
    const aEl =
      section.querySelector(".schema-faq-answer") ??
      section.querySelector("p");
    const question = (qEl?.textContent ?? "").replace(/\s+/g, " ").trim();
    const answerHtml = aEl?.innerHTML?.trim() ?? "";
    const answerText = stripHtmlToText(answerHtml || (aEl?.textContent ?? ""));

    if (question && answerText) {
      faqs.push({
        id: section.getAttribute("id") || `faq-${index + 1}`,
        question,
        answerHtml,
        answerText,
      });
    }
  });

  container
    .querySelectorAll(".schema-faq, .wp-block-yoast-faq-block")
    .forEach((el) => el.remove());

  // Also strip lone FAQs heading if it would be empty
  return { html: container.innerHTML, faqs };
}

function detectBlockKind(node: ContentNode, plain: string): ArticleBlockKind {
  const cls = (node.attributes.className ?? "").toLowerCase();
  const lower = plain.toLowerCase();

  if (node.type === "callout") {
    if (node.attributes.calloutTone === "warning" || node.attributes.calloutTone === "danger") {
      return "warning";
    }
    return "callout";
  }

  if (cls.includes("warning") || cls.includes("alert-danger")) return "warning";
  if (cls.includes("fact") || cls.includes("did-you-know")) return "fact-box";
  if (cls.includes("research") || cls.includes("study")) return "research";
  if (cls.includes("disclaimer") || lower.includes("medical disclaimer")) {
    return "medical-disclaimer";
  }
  if (cls.includes("pros") || cls.includes("cons")) return "pros-cons";
  if (node.type === "table" && (cls.includes("comparison") || lower.includes("vs"))) {
    return "comparison";
  }
  if (node.type === "list" && node.attributes.listStyle === "checklist") {
    return "checklist";
  }
  if (node.type === "heading") {
    if (/key\s*takeaways?/i.test(plain)) return "key-takeaways";
    if (/^faq|^frequently asked/i.test(plain)) return "faq-group";
    if (/summary|conclusion/i.test(plain)) return "summary";
  }

  return "standard";
}

function enrichNodes(
  nodes: ContentNode[],
  faqs: ArticleFaqItem[],
): {
  blockMeta: Record<string, ArticleBlockMeta>;
  toc: ArticleTocItem[];
} {
  const blockMeta: Record<string, ArticleBlockMeta> = {};
  const toc: ArticleTocItem[] = [];
  let takeawayCapture: string | null = null;

  for (const node of nodes) {
    const plain = nodePlainText(node).trim();
    const kind = detectBlockKind(node, plain);
    const meta: ArticleBlockMeta = { kind };

    if (node.type === "heading") {
      const level = (node.attributes.level ?? 2) as 1 | 2 | 3 | 4 | 5 | 6;
      const existingId =
        (typeof node.attributes.title === "string" && node.attributes.title) ||
        null;
      // Prefer WP ez-toc anchors embedded in attributes/class if present
      const anchorFromClass = (node.attributes.className ?? "").match(
        /ez-toc-section[^"]*/,
      );
      const anchorId =
        existingId ||
        slugifyAnchor(plain) ||
        node.id;

      meta.anchorId = anchorId;
      node.attributes.title = anchorId;

      if (level >= 2 && level <= 4 && plain) {
        toc.push({
          id: anchorId,
          text: plain,
          level: level as 2 | 3 | 4,
          nodeId: node.id,
        });
      }

      if (kind === "key-takeaways") {
        takeawayCapture = node.id;
      } else {
        takeawayCapture = null;
      }
    }

    if (
      takeawayCapture &&
      node.type === "list" &&
      blockMeta[takeawayCapture]?.kind === "key-takeaways"
    ) {
      const items = node.children
        .filter((c) => c.type === "list-item")
        .map((c) => nodePlainText(c).trim())
        .filter(Boolean);
      blockMeta[takeawayCapture] = {
        ...blockMeta[takeawayCapture],
        takeawayItems: items,
      };
      meta.kind = "key-takeaways";
      meta.takeawayItems = items;
    }

    blockMeta[node.id] = meta;
  }

  // Attach FAQ group meta if we lifted Yoast FAQs
  if (faqs.length > 0) {
    const faqHeading = nodes.find(
      (n) =>
        n.type === "heading" &&
        /^faq|^frequently asked/i.test(nodePlainText(n)),
    );
    if (faqHeading) {
      blockMeta[faqHeading.id] = {
        ...blockMeta[faqHeading.id],
        kind: "faq-group",
      };
    }
  }

  return { blockMeta, toc };
}

/**
 * Parse WordPress blog HTML into an {@link ArticleDocument}.
 */
export function parseHtmlToArticleAst(html: string): ArticleDocument {
  const originalHash = fingerprintFromHtml(html?.trim() ?? "");
  const stripped = stripPluginToc(html ?? "");
  const { html: withoutFaqs, faqs } = extractAndRemoveFaqs(stripped);
  const content = parseHtmlToAst(withoutFaqs);
  const { blockMeta, toc } = enrichNodes(content.nodes, faqs);
  const text = stripHtmlToText(html ?? "");
  const wordCount = countWords(text);

  return {
    version: 1,
    content,
    blockMeta,
    toc,
    faqs,
    readingTimeMinutes: estimateReadingTimeMinutes(html ?? ""),
    wordCount,
    sourceHash: originalHash,
  };
}

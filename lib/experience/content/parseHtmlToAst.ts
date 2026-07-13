import { parse, type HTMLElement, type Node as HtmlNode, type TextNode } from "node-html-parser";

import {
  fingerprintFromHtml,
  hashString,
  stableNodeId,
} from "@/lib/experience/content/stableId";
import type {
  ContentDocument,
  ContentInlineMark,
  ContentNode,
  ContentNodeType,
  ContentTextRun,
} from "@/types/content-ast";

const BLOCK_TAGS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "ul",
  "ol",
  "li",
  "blockquote",
  "figure",
  "figcaption",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "pre",
  "code",
  "hr",
  "div",
  "section",
  "aside",
  "iframe",
  "video",
  "a",
  "span",
  "button",
]);

/**
 * Parse WordPress HTML into a ContentDocument AST.
 * Unknown structures become custom-html nodes (lossless).
 */
export function parseHtmlToAst(html: string): ContentDocument {
  const normalized = html?.trim() ?? "";
  const sourceHash = fingerprintFromHtml(normalized);

  if (!normalized) {
    return { version: 1, sourceHash, nodes: [] };
  }

  const root = parse(`<div id="cw-content-root">${normalized}</div>`, {
    blockTextElements: {
      script: true,
      style: true,
      pre: true,
    },
  });

  const container = root.querySelector("#cw-content-root");
  if (!container) {
    return {
      version: 1,
      sourceHash,
      nodes: [
        createCustomHtml("0", normalized, 0),
      ],
    };
  }

  const nodes: ContentNode[] = [];
  let order = 0;

  for (const child of container.childNodes) {
    const mapped = mapNode(child, `r${order}`, order);
    if (!mapped) continue;
    if (Array.isArray(mapped)) {
      for (const item of mapped) {
        item.metadata.order = order;
        nodes.push(item);
        order += 1;
      }
    } else {
      mapped.metadata.order = order;
      nodes.push(mapped);
      order += 1;
    }
  }

  return { version: 1, sourceHash, nodes };
}

function mapNode(
  node: HtmlNode,
  path: string,
  order: number,
): ContentNode | ContentNode[] | null {
  if (node.nodeType === 3) {
    const text = (node as TextNode).text.replace(/\u00a0/g, " ").trim();
    if (!text) return null;
    return createParagraph(path, text, order);
  }

  if (node.nodeType !== 1) return null;
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  // Skip empty wrappers that only contain whitespace
  if (tag === "br") {
    return null;
  }

  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag[1]) as 1 | 2 | 3 | 4 | 5 | 6;
    return createTextBlock("heading", path, el, order, { level });
  }

  if (tag === "p") {
    return createTextBlock("paragraph", path, el, order);
  }

  if (tag === "ul" || tag === "ol") {
    return createList(path, el, order, tag === "ol" ? "numbered" : "bulleted");
  }

  if (tag === "blockquote") {
    return createTextBlock("quote", path, el, order);
  }

  if (tag === "hr") {
    return createLeaf("divider", path, el, order);
  }

  if (tag === "pre") {
    return createTextBlock("code", path, el, order, {
      rawTag: "pre",
      className: el.getAttribute("class") ?? undefined,
    });
  }

  if (tag === "img") {
    return createImage(path, el, order);
  }

  if (tag === "figure") {
    return createFigure(path, el, order);
  }

  if (tag === "table") {
    return createTable(path, el, order);
  }

  if (tag === "iframe" || tag === "video") {
    return createEmbed(path, el, order);
  }

  if (tag === "a" && isButtonLike(el)) {
    return createButton(path, el, order);
  }

  if (tag === "div" || tag === "section" || tag === "aside") {
    const className = el.getAttribute("class") ?? "";
    const callout = detectCallout(className, el);
    if (callout) return callout;

    const faq = detectFaq(className, el, path, order);
    if (faq) return faq;

    // Gutenberg group / columns — map children, or custom-html if mixed complexity
    const children = mapChildren(el, path);
    if (children.length && isMostlyBlockChildren(el)) {
      return {
        id: stableNodeId([path, tag, className, el.innerText.slice(0, 40)]),
        type: "group",
        source: "wordpress",
        fingerprint: hashString(el.toString()),
        children,
        attributes: {
          className: className || undefined,
          rawTag: tag,
        },
        styles: {},
        bindings: {},
        animations: {},
        responsive: {},
        visibility: "always",
        metadata: {
          wpBlockClass: className || null,
          order,
        },
      };
    }

    return createCustomHtml(path, el.toString(), order, className);
  }

  if (!BLOCK_TAGS.has(tag)) {
    return createCustomHtml(path, el.toString(), order);
  }

  // Fallback: preserve losslessly
  return createCustomHtml(path, el.toString(), order);
}

function mapChildren(el: HTMLElement, parentPath: string): ContentNode[] {
  const out: ContentNode[] = [];
  let i = 0;
  for (const child of el.childNodes) {
    const mapped = mapNode(child, `${parentPath}.${i}`, i);
    if (!mapped) {
      i += 1;
      continue;
    }
    if (Array.isArray(mapped)) out.push(...mapped);
    else out.push(mapped);
    i += 1;
  }
  return out;
}

function createTextBlock(
  type: Extract<ContentNodeType, "heading" | "paragraph" | "quote" | "code">,
  path: string,
  el: HTMLElement,
  order: number,
  extra: Record<string, unknown> = {},
): ContentNode {
  const runs = extractRuns(el);
  const text = runs.map((r) => r.text).join("");
  return {
    id: stableNodeId([path, type, text.slice(0, 80)]),
    type,
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: [],
    runs,
    attributes: {
      className: el.getAttribute("class") ?? undefined,
      ...extra,
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: el.getAttribute("class"),
      order,
    },
  };
}

function createParagraph(path: string, text: string, order: number): ContentNode {
  return {
    id: stableNodeId([path, "paragraph", text.slice(0, 80)]),
    type: "paragraph",
    source: "wordpress",
    fingerprint: hashString(text),
    children: [],
    runs: [{ text }],
    attributes: {},
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: { order },
  };
}

function createList(
  path: string,
  el: HTMLElement,
  order: number,
  listStyle: "bulleted" | "numbered",
): ContentNode {
  const items: ContentNode[] = [];
  let i = 0;
  for (const child of el.childNodes) {
    if (child.nodeType !== 1) continue;
    const li = child as HTMLElement;
    if (li.tagName.toLowerCase() !== "li") continue;
    const nested = mapChildren(li, `${path}.li${i}`).filter(
      (n) => n.type === "list",
    );
    items.push({
      id: stableNodeId([path, "li", i, li.innerText.slice(0, 60)]),
      type: "list-item",
      source: "wordpress",
      fingerprint: hashString(li.toString()),
      children: nested,
      runs: extractRuns(li, true),
      attributes: {},
      styles: {},
      bindings: {},
      animations: {},
      responsive: {},
      visibility: "always",
      metadata: { order: i },
    });
    i += 1;
  }

  return {
    id: stableNodeId([path, "list", listStyle, el.innerText.slice(0, 60)]),
    type: "list",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: items,
    attributes: {
      listStyle,
      className: el.getAttribute("class") ?? undefined,
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: el.getAttribute("class"),
      order,
    },
  };
}

function createImage(
  path: string,
  el: HTMLElement,
  order: number,
): ContentNode {
  const src = el.getAttribute("src") ?? "";
  return {
    id: stableNodeId([path, "image", src]),
    type: "image",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: [],
    attributes: {
      src,
      alt: el.getAttribute("alt") ?? "",
      title: el.getAttribute("title") ?? undefined,
      width: num(el.getAttribute("width")),
      height: num(el.getAttribute("height")),
      loading: (el.getAttribute("loading") as "lazy" | "eager" | null) ?? "lazy",
      className: el.getAttribute("class") ?? undefined,
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: el.getAttribute("class"),
      order,
    },
  };
}

function createFigure(
  path: string,
  el: HTMLElement,
  order: number,
): ContentNode {
  const img = el.querySelector("img");
  const caption = el.querySelector("figcaption");
  const children: ContentNode[] = [];
  if (img) {
    const image = createImage(`${path}.img`, img, 0);
    children.push(image);
  }
  return {
    id: stableNodeId([path, "figure", el.innerText.slice(0, 40)]),
    type: "figure",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children,
    attributes: {
      caption: caption?.text?.trim() || null,
      className: el.getAttribute("class") ?? undefined,
      rawHtml: img ? undefined : el.toString(),
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: el.getAttribute("class"),
      order,
    },
  };
}

function createTable(
  path: string,
  el: HTMLElement,
  order: number,
): ContentNode {
  return {
    id: stableNodeId([path, "table", el.innerText.slice(0, 40)]),
    type: "table",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: [],
    attributes: {
      rawHtml: el.toString(),
      className: el.getAttribute("class") ?? undefined,
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: el.getAttribute("class"),
      order,
    },
  };
}

function createEmbed(
  path: string,
  el: HTMLElement,
  order: number,
): ContentNode {
  return {
    id: stableNodeId([path, "embed", el.getAttribute("src") ?? ""]),
    type: el.tagName.toLowerCase() === "video" ? "video" : "embed",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: [],
    attributes: {
      src: el.getAttribute("src") ?? undefined,
      rawHtml: el.toString(),
      className: el.getAttribute("class") ?? undefined,
      rawTag: el.tagName.toLowerCase(),
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: { order },
  };
}

function createButton(
  path: string,
  el: HTMLElement,
  order: number,
): ContentNode {
  const runs = extractRuns(el);
  return {
    id: stableNodeId([path, "button", el.getAttribute("href") ?? "", el.innerText]),
    type: "button",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: [],
    runs,
    attributes: {
      href: el.getAttribute("href") ?? "#",
      target: el.getAttribute("target") ?? undefined,
      rel: el.getAttribute("rel") ?? undefined,
      buttonVariant: "primary",
      buttonSize: "md",
      className: el.getAttribute("class") ?? undefined,
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: el.getAttribute("class"),
      order,
    },
  };
}

function createLeaf(
  type: ContentNodeType,
  path: string,
  el: HTMLElement,
  order: number,
): ContentNode {
  return {
    id: stableNodeId([path, type]),
    type,
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: [],
    attributes: { className: el.getAttribute("class") ?? undefined },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: { order },
  };
}

function createCustomHtml(
  path: string,
  rawHtml: string,
  order: number,
  className?: string,
): ContentNode {
  return {
    id: stableNodeId([path, "custom-html", hashString(rawHtml)]),
    type: "custom-html",
    source: "wordpress",
    fingerprint: hashString(rawHtml),
    children: [],
    attributes: {
      rawHtml,
      className,
      rawTag: "div",
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: className ?? null,
      order,
    },
  };
}

function extractRuns(
  el: HTMLElement,
  skipNestedLists = false,
): ContentTextRun[] {
  const runs: ContentTextRun[] = [];

  function walk(node: HtmlNode, marks: ContentInlineMark[]) {
    if (node.nodeType === 3) {
      const text = (node as TextNode).text.replace(/\u00a0/g, " ");
      if (!text) return;
      runs.push({
        text,
        marks: marks.length ? [...marks] : undefined,
      });
      return;
    }
    if (node.nodeType !== 1) return;
    const child = node as HTMLElement;
    const tag = child.tagName.toLowerCase();
    if (skipNestedLists && (tag === "ul" || tag === "ol")) return;

    const next = [...marks];
    if (tag === "strong" || tag === "b") next.push({ type: "bold" });
    if (tag === "em" || tag === "i") next.push({ type: "italic" });
    if (tag === "u") next.push({ type: "underline" });
    if (tag === "code") next.push({ type: "code" });
    if (tag === "a") {
      next.push({
        type: "link",
        href: child.getAttribute("href") ?? "#",
        target: child.getAttribute("target") ?? undefined,
        rel: child.getAttribute("rel") ?? undefined,
      });
    }
    if (tag === "mark") next.push({ type: "highlight" });

    if (tag === "br") {
      runs.push({ text: "\n", marks: marks.length ? [...marks] : undefined });
      return;
    }

    for (const c of child.childNodes) walk(c, next);
  }

  for (const c of el.childNodes) walk(c, []);
  return runs.length ? runs : [{ text: el.innerText }];
}

function isButtonLike(el: HTMLElement): boolean {
  const className = el.getAttribute("class") ?? "";
  return (
    className.includes("wp-block-button") ||
    className.includes("button") ||
    className.includes("btn")
  );
}

function detectCallout(
  className: string,
  el: HTMLElement,
): ContentNode | null {
  const tone = (() => {
    if (/tip|success/i.test(className)) return "tip" as const;
    if (/warn/i.test(className)) return "warning" as const;
    if (/danger|error/i.test(className)) return "danger" as const;
    if (/info|note/i.test(className)) return "info" as const;
    if (/callout|is-style-notice/i.test(className)) return "info" as const;
    return null;
  })();
  if (!tone) return null;

  const runs = extractRuns(el);
  return {
    id: stableNodeId(["callout", tone, el.innerText.slice(0, 60)]),
    type: "callout",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: [],
    runs,
    attributes: {
      calloutTone: tone,
      className,
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: {
      wpBlockClass: className,
      order: 0,
    },
  };
}

function detectFaq(
  className: string,
  el: HTMLElement,
  path: string,
  order: number,
): ContentNode | null {
  if (!/faq|accordion/i.test(className)) return null;
  return {
    id: stableNodeId([path, "faq", el.innerText.slice(0, 40)]),
    type: "faq",
    source: "wordpress",
    fingerprint: hashString(el.toString()),
    children: mapChildren(el, path),
    attributes: {
      className,
      rawHtml: el.toString(),
    },
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: { wpBlockClass: className, order },
  };
}

function isMostlyBlockChildren(el: HTMLElement): boolean {
  const elements = el.childNodes.filter((n) => n.nodeType === 1) as HTMLElement[];
  if (!elements.length) return false;
  return elements.every((child) => {
    const tag = child.tagName.toLowerCase();
    return BLOCK_TAGS.has(tag);
  });
}

function num(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

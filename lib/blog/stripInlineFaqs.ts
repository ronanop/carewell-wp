type PtSpan = { text?: string };
type PtBlock = {
  _type?: string;
  style?: string;
  children?: PtSpan[];
};

function blockPlainText(block: PtBlock): string {
  return (block.children || [])
    .map((child) => child.text || "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/** Headings that mark an inline FAQ block migrated from WordPress body copy. */
export function isInlineFaqHeading(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return (
    normalized === "faq" ||
    normalized === "faqs" ||
    normalized === "frequently asked questions" ||
    normalized === "common questions"
  );
}

/** Drop h2–h4 FAQ sections from portable text — accordion renders FAQs below the article. */
export function stripInlineFaqFromPortableText(
  body: unknown[] | null | undefined,
): unknown[] {
  if (!Array.isArray(body) || body.length === 0) return [];

  const faqIndex = body.findIndex((node) => {
    const block = node as PtBlock;
    if (block._type !== "block") return false;
    const style = block.style || "";
    if (style !== "h2" && style !== "h3" && style !== "h4") return false;
    return isInlineFaqHeading(blockPlainText(block));
  });

  return faqIndex >= 0 ? body.slice(0, faqIndex) : body;
}

const FAQ_HEADING_HTML =
  /<h[234][^>]*>\s*(?:<[^>]+>\s*)*(?:FAQs?|Frequently Asked Questions|Common Questions)(?:\s*<[^>]+>)*\s*<\/h[234]>/i;

/** Remove trailing FAQ markup from legacy WordPress HTML bodies. */
export function stripInlineFaqFromHtml(html: string): string {
  const match = html.match(FAQ_HEADING_HTML);
  if (match?.index === undefined) return html;
  return html.slice(0, match.index).trimEnd();
}

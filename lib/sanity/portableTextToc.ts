/**
 * Build a table of contents from Sanity portable text heading blocks.
 */

export type PortableTextTocItem = {
  /** Anchor id used on the heading and in TOC links */
  id: string;
  /** Block `_key` — used to attach `id` when rendering Portable Text */
  key: string;
  text: string;
  level: 2 | 3 | 4;
};

type PtSpan = { text?: string };
type PtBlock = {
  _type?: string;
  _key?: string;
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

export function slugifyHeading(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "section";
}

/**
 * Collect h2–h4 blocks in document order. Duplicate titles get `-2`, `-3`, …
 */
export function extractPortableTextToc(
  body: unknown[] | null | undefined,
): PortableTextTocItem[] {
  if (!Array.isArray(body) || body.length === 0) return [];

  const used = new Set<string>();
  const items: PortableTextTocItem[] = [];

  for (const node of body) {
    const block = node as PtBlock;
    if (block._type !== "block" || !block._key) continue;
    const style = block.style || "";
    if (style !== "h2" && style !== "h3" && style !== "h4") continue;

    const text = blockPlainText(block);
    if (!text) continue;

    const level = Number(style.slice(1)) as 2 | 3 | 4;
    let id = slugifyHeading(text);
    let n = 2;
    while (used.has(id)) {
      id = `${slugifyHeading(text)}-${n}`;
      n += 1;
    }
    used.add(id);

    items.push({ id, key: block._key, text, level });
  }

  return items;
}

/** Map of portable-text block `_key` → anchor id */
export function tocHeadingIdMap(
  items: PortableTextTocItem[],
): Record<string, string> {
  return Object.fromEntries(items.map((item) => [item.key, item.id]));
}

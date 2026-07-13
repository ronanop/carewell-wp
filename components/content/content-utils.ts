/**
 * Pure helpers for the WordPress content rendering engine.
 * These do not mutate HTML strings and perform no I/O.
 *
 * Assumptions:
 * - HTML passed to RichContent is already sanitized upstream (repository / mapper).
 * - Utilities describe detection and class contracts; RichContent does not rewrite markup.
 */

/**
 * Collapses excessive blank lines while preserving intentional paragraph breaks.
 *
 * @param html - Raw HTML string.
 * @returns Spacing-normalized HTML string.
 */
export function normalizeContentSpacing(html: string): string {
  return html.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Returns whether an href should be treated as an external navigation target.
 *
 * @param href - Anchor href value.
 * @param siteOrigin - Optional public site origin (e.g. `https://www.example.com`).
 */
export function isExternalLink(href: string, siteOrigin?: string): boolean {
  const trimmed = href.trim();
  if (
    trimmed === "" ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("sms:")
  ) {
    return false;
  }

  try {
    const url = new URL(trimmed, siteOrigin ?? "https://example.invalid");
    if (!siteOrigin) {
      return url.protocol === "http:" || url.protocol === "https:";
    }
    const site = new URL(siteOrigin);
    return url.host !== "" && url.host !== site.host;
  } catch {
    return false;
  }
}

/**
 * Known WordPress image alignment class names.
 */
export const WP_IMAGE_ALIGNMENTS = [
  "alignleft",
  "alignright",
  "aligncenter",
  "alignwide",
  "alignfull",
  "alignnone",
] as const;

export type WpImageAlignment = (typeof WP_IMAGE_ALIGNMENTS)[number];

/**
 * Picks the first recognized WordPress alignment class from a class string.
 *
 * @param className - Element `class` attribute value.
 * @returns Alignment token, or `null` when none match.
 */
export function normalizeImageAlignment(
  className: string | null | undefined,
): WpImageAlignment | null {
  if (!className) {
    return null;
  }

  const tokens = className.split(/\s+/);
  for (const alignment of WP_IMAGE_ALIGNMENTS) {
    if (tokens.includes(alignment)) {
      return alignment;
    }
  }

  return null;
}

/**
 * Detects whether an iframe `src` is a known responsive embed provider.
 *
 * @param src - iframe src URL.
 * @returns Provider key, or `null` when unrecognized.
 */
export function responsiveEmbedDetection(
  src: string | null | undefined,
): "youtube" | "vimeo" | "google-maps" | "generic" | null {
  if (!src) {
    return null;
  }

  const lower = src.toLowerCase();
  if (
    lower.includes("youtube.com") ||
    lower.includes("youtube-nocookie.com") ||
    lower.includes("youtu.be")
  ) {
    return "youtube";
  }
  if (lower.includes("player.vimeo.com") || lower.includes("vimeo.com")) {
    return "vimeo";
  }
  if (
    lower.includes("google.com/maps") ||
    lower.includes("maps.google.") ||
    lower.includes("google.com/maps/embed")
  ) {
    return "google-maps";
  }
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return "generic";
  }

  return null;
}

/**
 * Describes the CSS contract for horizontally scrollable tables.
 * RichContent applies this via `.rich-content` styles (no DOM mutation).
 *
 * @returns Class names used by the table overflow wrapper contract.
 */
export function tableOverflowHandling(): {
  readonly wrapperClass: string;
  readonly tableClass: string;
} {
  return {
    wrapperClass: "rich-content__table-scroll",
    tableClass: "rich-content__table",
  } as const;
}

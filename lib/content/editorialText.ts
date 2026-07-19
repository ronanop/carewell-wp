/**
 * Editorial text cleanup — strip decorative emoji / glyph bullets.
 * Presentation only; does not mutate WordPress source HTML in the CMS.
 */

/** Broad emoji + pictograph ranges (including ZWJ / variation selectors). */
const EMOJI_PATTERN =
  /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\uFE0F|\u200D|\u20E3)/gu;

/** Leading decorative bullets WordPress authors often paste into list items. */
const LEADING_BULLET_PATTERN =
  /^(?:[\s]*(?:[✓✔✅❎❌⚠●◆▪▫■□►▶➤➜→←↑↓★☆✦✧❖❖❖•·‣⁃‒–—*\-◦○◎◉]|\uFE0F)+[\s]*)+/u;

/**
 * Remove emoji / pictographs from a string.
 */
export function stripEmoji(text: string): string {
  return text.replace(EMOJI_PATTERN, "").replace(/\uFE0F/g, "");
}

/**
 * Clean list-item copy for editorial bullets: no emoji, no duplicate glyph bullets.
 */
export function formatEditorialListItem(text: string): string {
  return stripEmoji(text)
    .replace(LEADING_BULLET_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Strip emoji from HTML while preserving tags (FAQ answers, etc.).
 */
export function stripEmojiFromHtml(html: string): string {
  return html.replace(EMOJI_PATTERN, "").replace(/\uFE0F/g, "");
}

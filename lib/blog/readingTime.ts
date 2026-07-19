/**
 * Reading-time estimator for blog articles (words / 220 wpm).
 */

const WORDS_PER_MINUTE = 220;

export function stripHtmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTimeMinutes(htmlOrText: string): number {
  const text = htmlOrText.includes("<")
    ? stripHtmlToText(htmlOrText)
    : htmlOrText.trim();
  const words = countWords(text);
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

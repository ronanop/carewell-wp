/**
 * Deterministic content node IDs so overrides survive re-parses.
 */

export function hashString(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function stableNodeId(parts: Array<string | number>): string {
  const fingerprint = parts.map(String).join("|");
  return `cn_${hashString(fingerprint)}`;
}

export function fingerprintFromHtml(html: string): string {
  return hashString(html.replace(/\s+/g, " ").trim());
}

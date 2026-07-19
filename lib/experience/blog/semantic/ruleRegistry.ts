/**
 * Semantic Rule Registry — composable, prioritized, independently testable.
 * Future medical specialties register rules without touching the core engine.
 */

import type {
  SemanticConfidence,
  SemanticSectionType,
} from "@/types/semantic-article";
import type { ContentNode } from "@/types/content-ast";

export type SemanticRuleContext = {
  headingText: string;
  headingLevel: number | null;
  /** Plain text of body nodes until next same-or-higher heading. */
  bodyText: string;
  listItems: string[];
  hasTable: boolean;
  hasImage: boolean;
  hasVideo: boolean;
  hasQuote: boolean;
  nodeTypes: string[];
  /** Prior section type (for sequential hints). */
  previousType: SemanticSectionType | null;
  /** Position among sections (0 = first). */
  index: number;
};

export type SemanticRuleMatch = {
  type: SemanticSectionType;
  confidence: SemanticConfidence;
  score: number;
};

export type SemanticRule = {
  id: string;
  /** Higher priority wins ties after score. */
  priority: number;
  /** Specialty pack id (e.g. "medical.core", "medical.aesthetic"). */
  packId: string;
  match: (ctx: SemanticRuleContext) => SemanticRuleMatch | null;
};

const rules: SemanticRule[] = [];
const byPack = new Map<string, Set<string>>();

export function registerSemanticRule(rule: SemanticRule): void {
  if (rules.some((r) => r.id === rule.id)) return;
  rules.push(rule);
  rules.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  if (!byPack.has(rule.packId)) byPack.set(rule.packId, new Set());
  byPack.get(rule.packId)!.add(rule.id);
}

export function unregisterSemanticRule(id: string): void {
  const idx = rules.findIndex((r) => r.id === id);
  if (idx >= 0) rules.splice(idx, 1);
}

export function getSemanticRules(): readonly SemanticRule[] {
  return rules;
}

export function clearSemanticRulesForTests(): void {
  rules.length = 0;
  byPack.clear();
}

/**
 * Evaluate all rules; return best match or null.
 */
export function evaluateSemanticRules(
  ctx: SemanticRuleContext,
): { ruleId: string; match: SemanticRuleMatch } | null {
  let best: { ruleId: string; match: SemanticRuleMatch } | null = null;

  for (const rule of rules) {
    const match = rule.match(ctx);
    if (!match) continue;
    if (
      !best ||
      match.score > best.match.score ||
      (match.score === best.match.score &&
        (rules.find((r) => r.id === rule.id)?.priority ?? 0) >
          (rules.find((r) => r.id === best!.ruleId)?.priority ?? 0))
    ) {
      best = { ruleId: rule.id, match };
    }
  }

  return best;
}

/** Helpers for rule authors. */
export function includesAny(text: string, keywords: readonly string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k.toLowerCase()));
}

export function startsWithAny(text: string, prefixes: readonly string[]): boolean {
  const lower = text.toLowerCase().trim();
  return prefixes.some((p) => lower.startsWith(p.toLowerCase()));
}

export function nodePlainText(node: ContentNode): string {
  if (node.runs?.length) {
    return node.runs.map((r) => r.text).join("");
  }
  return node.children.map(nodePlainText).join(" ");
}

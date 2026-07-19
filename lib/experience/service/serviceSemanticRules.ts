/**
 * Service semantic rules — treatment-specific classifications.
 * Registers beside medical.core; does not replace blog rules.
 */

import {
  includesAny,
  registerSemanticRule,
  startsWithAny,
  type SemanticRule,
} from "@/lib/experience/semantic/ruleRegistry";
import { ensureMedicalCoreSemanticRules } from "@/lib/experience/semantic/medicalCoreRules";
import type { SemanticSectionType } from "@/types/semantic-article";

function keywordRule(
  id: string,
  type: SemanticSectionType,
  keywords: readonly string[],
  priority: number,
  opts?: {
    requireHeading?: boolean;
    confidence?: "high" | "medium";
  },
): SemanticRule {
  return {
    id,
    priority,
    packId: "medical.service",
    match(ctx) {
      const headingHit =
        includesAny(ctx.headingText, keywords) ||
        startsWithAny(ctx.headingText, keywords);
      const bodyHit = includesAny(ctx.bodyText.slice(0, 600), keywords);
      if (opts?.requireHeading !== false && !headingHit) {
        if (!(ctx.headingText === "" && bodyHit)) return null;
      }
      if (!headingHit && !bodyHit) return null;

      let score = headingHit ? 82 : 48;
      if (
        ctx.listItems.length >= 3 &&
        (type === "BENEFITS" || type === "ELIGIBILITY" || type === "RISKS")
      ) {
        score += 8;
      }
      if (ctx.hasTable && (type === "COMPARISON" || type === "COST")) score += 12;

      return {
        type,
        confidence: opts?.confidence ?? (headingHit ? "high" : "medium"),
        score,
      };
    },
  };
}

let registered = false;

export function resetServiceSemanticRulesForTests(): void {
  registered = false;
}

export function ensureServiceSemanticRules(): void {
  ensureMedicalCoreSemanticRules();
  if (registered) return;
  registered = true;

  const rules: SemanticRule[] = [
    keywordRule(
      "service.candidate",
      "ELIGIBILITY",
      [
        "who is a candidate",
        "who can get",
        "ideal candidate",
        "good candidate",
        "suitable for",
        "eligibility",
        "who should consider",
      ],
      96,
    ),
    keywordRule(
      "service.not-candidate",
      "WARNING",
      [
        "who is not a candidate",
        "not suitable",
        "contraindication",
        "contraindications",
        "when to avoid",
        "not recommended",
      ],
      95,
    ),
    keywordRule(
      "service.technology",
      "TECHNOLOGY",
      [
        "technology",
        "technique",
        "device",
        "equipment",
        "fue",
        "dhi",
        "laser",
        "robotic",
        "how we perform",
      ],
      91,
    ),
    keywordRule(
      "service.cost-package",
      "COST",
      [
        "cost of",
        "price of",
        "pricing",
        "package",
        "packages",
        "how much does",
        "fees",
        "emi",
        "financing",
      ],
      90,
    ),
    keywordRule(
      "service.treatment-process",
      "PROCEDURE",
      [
        "treatment process",
        "how the treatment",
        "what happens during",
        "procedure steps",
        "step by step",
      ],
      89,
    ),
    keywordRule(
      "service.expected-results",
      "RESULTS",
      [
        "expected results",
        "what to expect",
        "results after",
        "outcome",
        "outcomes",
      ],
      88,
    ),
    keywordRule(
      "service.clinic-location",
      "LOCATION",
      [
        "our clinic",
        "clinic location",
        "south delhi",
        "how to reach",
        "visit us",
        "address",
      ],
      86,
    ),
    keywordRule(
      "service.insurance",
      "INSURANCE",
      ["insurance", "cashless", "financing options", "payment plans", "emi options"],
      85,
    ),
    keywordRule(
      "service.consultation",
      "CONSULTATION",
      [
        "book a consultation",
        "free consultation",
        "schedule a consult",
        "meet the doctor",
        "consultation",
      ],
      84,
    ),
    keywordRule(
      "service.related",
      "GENERIC",
      ["related treatments", "related procedures", "you may also", "also consider"],
      50,
      { confidence: "medium" },
    ),
  ];

  for (const rule of rules) {
    registerSemanticRule(rule);
  }
}

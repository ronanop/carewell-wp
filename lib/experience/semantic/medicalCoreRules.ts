/**
 * Core medical semantic rules — deterministic keyword / structure matching.
 * Pack: medical.core — specialty packs can register additional rules.
 */

import {
  includesAny,
  registerSemanticRule,
  startsWithAny,
  type SemanticRule,
} from "@/lib/experience/semantic/ruleRegistry";
import type { SemanticSectionType } from "@/types/semantic-article";

function keywordRule(
  id: string,
  type: SemanticSectionType,
  keywords: readonly string[],
  priority: number,
  opts?: {
    requireHeading?: boolean;
    bodyBoost?: readonly string[];
    confidence?: "high" | "medium";
  },
): SemanticRule {
  return {
    id,
    priority,
    packId: "medical.core",
    match(ctx) {
      const haystack = `${ctx.headingText} ${ctx.bodyText.slice(0, 400)}`;
      const headingHit = includesAny(ctx.headingText, keywords);
      const bodyHit = includesAny(ctx.bodyText.slice(0, 600), keywords);
      if (opts?.requireHeading !== false && !headingHit && !startsWithAny(ctx.headingText, keywords)) {
        if (!bodyHit || ctx.headingText.length > 0) {
          // Allow body-only for some types when heading empty (intro)
          if (!(ctx.headingText === "" && bodyHit)) return null;
        }
      }
      if (!headingHit && !bodyHit) return null;

      let score = headingHit ? 80 : 45;
      if (opts?.bodyBoost && includesAny(ctx.bodyText, opts.bodyBoost)) score += 10;
      if (ctx.listItems.length >= 3 && (type === "BENEFITS" || type === "RISKS" || type === "KEY_TAKEAWAYS")) {
        score += 8;
      }
      if (ctx.hasTable && type === "COMPARISON") score += 15;
      if (ctx.hasTable && type === "COST") score += 10;

      return {
        type,
        confidence: opts?.confidence ?? (headingHit ? "high" : "medium"),
        score,
      };
    },
  };
}

let registered = false;

export function resetMedicalCoreSemanticRulesForTests(): void {
  registered = false;
}

export function ensureMedicalCoreSemanticRules(): void {
  if (registered) return;
  registered = true;

  const rules: SemanticRule[] = [
    keywordRule("core.key-takeaways", "KEY_TAKEAWAYS", ["key takeaway", "key takeaways", "takeaways", "in summary"], 100),
    keywordRule("core.faq", "FAQ", ["faq", "frequently asked", "common questions", "questions people ask"], 95),
    keywordRule("core.warning", "WARNING", ["warning", "caution", "important safety", "contraindication"], 94),
    keywordRule("core.side-effects", "SIDE_EFFECTS", ["side effect", "side effects", "adverse effect", "adverse reaction"], 93),
    keywordRule("core.risks", "RISKS", ["risk", "risks", "complication", "complications", "potential downside"], 92),
    keywordRule("core.benefits", "BENEFITS", ["benefit", "benefits", "advantage", "advantages", "why choose", "why it helps"], 90),
    keywordRule("core.procedure", "PROCEDURE", ["procedure", "how it works", "treatment process", "what happens during", "the treatment"], 88),
    keywordRule("core.step-by-step", "STEP_BY_STEP", ["step by step", "step-by-step", "steps involved", "step 1", "step 2"], 87),
    keywordRule("core.recovery", "RECOVERY", ["recovery", "healing", "downtime", "after the procedure", "post-treatment"], 86),
    keywordRule("core.aftercare", "AFTERCARE", ["aftercare", "after care", "post care", "post-care", "care instructions"], 85),
    keywordRule("core.preparation", "PREPARATION", ["preparation", "prepare", "before the procedure", "before treatment", "pre-treatment"], 84),
    keywordRule("core.cost", "COST", ["cost", "price", "pricing", "fees", "how much", "affordab"], 83),
    keywordRule("core.timeline", "TIMELINE", ["timeline", "how long", "duration", "schedule", "when will i see"], 82),
    keywordRule("core.comparison", "COMPARISON", ["comparison", "compare", "vs", "versus", "difference between", "which is better"], 81),
    keywordRule("core.research", "RESEARCH", ["research", "study", "studies", "clinical trial", "evidence", "journal", "peer-reviewed"], 80),
    keywordRule("core.statistics", "STATISTICS", ["statistic", "statistics", "data shows", "according to data", "% of"], 78),
    keywordRule("core.eligibility", "ELIGIBILITY", ["who is a candidate", "who may benefit", "eligibility", "suitable for", "ideal candidate"], 77),
    keywordRule("core.when-to-contact", "WHEN_TO_CONTACT", ["when to contact", "when to see a doctor", "seek medical", "call your doctor", "emergency"], 76),
    keywordRule("core.doctor-advice", "DOCTOR_ADVICE", ["doctor", "surgeon", "specialist advice", "medical advice", "expert recommendation", "why choose care well"], 75),
    keywordRule("core.results", "RESULTS", ["results", "outcome", "outcomes", "what to expect", "expected results"], 74),
    keywordRule("core.before-after", "BEFORE_AFTER", ["before and after", "before & after", "before/after", "transformation"], 73),
    keywordRule("core.disclaimer", "MEDICAL_DISCLAIMER", ["disclaimer", "medical disclaimer", "not medical advice", "educational purposes"], 72),
    keywordRule("core.conclusion", "CONCLUSION", ["conclusion", "final thoughts", "wrapping up", "to conclude"], 70),
    keywordRule("core.summary", "SUMMARY", ["summary", "overview", "at a glance", "quick summary"], 69),
    keywordRule("core.references", "REFERENCES", ["reference", "references", "sources", "citations", "bibliography", "further reading"], 68),
    keywordRule("core.testimonial", "TESTIMONIAL", ["testimonial", "patient story", "patient experience", "what patients say"], 65),
    keywordRule("core.testimonials", "TESTIMONIALS", ["testimonials", "patient reviews", "success stories"], 64),
    keywordRule("core.reviews", "REVIEWS", ["reviews", "ratings", "google reviews", "patient ratings"], 63),
    keywordRule("core.technology", "TECHNOLOGY", ["technology", "technique", "device", "equipment", "fue", "dhi", "laser technology"], 62),
    keywordRule("core.location", "LOCATION", ["location", "clinic", "south delhi", "how to reach", "address", "directions"], 61),
    keywordRule("core.contact", "CONTACT", ["contact us", "get in touch", "book an appointment", "call us"], 60),
    keywordRule("core.insurance", "INSURANCE", ["insurance", "cashless", "emi", "financing", "payment options"], 59),
    keywordRule("core.consultation", "CONSULTATION", ["consultation", "book a consult", "free consultation", "meet the doctor"], 58),
    keywordRule("core.gallery", "IMAGE_GALLERY", ["gallery", "photo gallery", "image gallery"], 57),
    keywordRule("core.gallery-alias", "GALLERY", ["photo gallery", "image gallery", "clinic gallery"], 56),
    keywordRule("core.introduction", "INTRODUCTION", ["introduction", "overview", "about this"], 40, {
      requireHeading: true,
      confidence: "medium",
    }),
  ];

  // Structural rules
  rules.push({
    id: "core.structure.video",
    priority: 70,
    packId: "medical.core",
    match(ctx) {
      if (!ctx.hasVideo) return null;
      if (includesAny(ctx.headingText, ["video", "watch", "demo"])) {
        return { type: "VIDEO", confidence: "high", score: 85 };
      }
      return { type: "VIDEO", confidence: "medium", score: 55 };
    },
  });

  rules.push({
    id: "core.structure.quote",
    priority: 55,
    packId: "medical.core",
    match(ctx) {
      if (includesAny(ctx.headingText, ["quote", "in their words", "patient voice"])) {
        return { type: "QUOTE", confidence: "high", score: 70 };
      }
      if (ctx.hasQuote && ctx.nodeTypes.every((t) => t === "quote" || t === "paragraph")) {
        return { type: "QUOTE", confidence: "medium", score: 48 };
      }
      return null;
    },
  });

  rules.push({
    id: "core.structure.fact",
    priority: 66,
    packId: "medical.core",
    match(ctx) {
      if (
        includesAny(ctx.headingText, [
          "important",
          "note",
          "remember",
          "tip",
          "fact",
          "good to know",
          "did you know",
        ])
      ) {
        return { type: "FACT", confidence: "high", score: 82 };
      }
      return null;
    },
  });

  rules.push({
    id: "core.structure.first-intro",
    priority: 30,
    packId: "medical.core",
    match(ctx) {
      if (ctx.index === 0 && !ctx.headingText) {
        return { type: "INTRODUCTION", confidence: "medium", score: 50 };
      }
      return null;
    },
  });

  rules.push({
    id: "core.structure.list-benefits-heuristic",
    priority: 45,
    packId: "medical.core",
    match(ctx) {
      if (ctx.listItems.length < 4) return null;
      if (includesAny(ctx.headingText, ["benefit", "advantage", "support", "help"])) {
        return { type: "BENEFITS", confidence: "medium", score: 62 };
      }
      return null;
    },
  });

  for (const rule of rules) {
    registerSemanticRule(rule);
  }
}

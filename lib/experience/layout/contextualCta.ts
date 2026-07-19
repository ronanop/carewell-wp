/**
 * Contextual CTA copy by semantic section — reduces identical consultation spam.
 */

import type { SemanticSectionType } from "@/types/semantic-article";

export type SectionCtaCopy = {
  title: string;
  body: string;
  label: string;
};

const BY_TYPE: Partial<Record<SemanticSectionType, SectionCtaCopy>> = {
  PROCEDURE: {
    title: "Discuss your treatment options",
    body: "Walk through steps, candidacy, and what to expect with our clinical team.",
    label: "Discuss treatment",
  },
  STEP_BY_STEP: {
    title: "Discuss your treatment options",
    body: "Clarify each step before you decide — personalised guidance in South Delhi.",
    label: "Discuss treatment",
  },
  RECOVERY: {
    title: "Ask about recovery expectations",
    body: "Understand downtime, aftercare, and when you can return to routine.",
    label: "Ask about recovery",
  },
  AFTERCARE: {
    title: "Ask about recovery expectations",
    body: "Get a clear aftercare plan tailored to your treatment.",
    label: "Ask about aftercare",
  },
  COST: {
    title: "Request a personalised estimate",
    body: "Pricing depends on clinical assessment — we’ll outline packages transparently.",
    label: "Request estimate",
  },
  INSURANCE: {
    title: "Ask about financing options",
    body: "Learn what payment plans or coverage support may apply to your care.",
    label: "Ask about financing",
  },
  BENEFITS: {
    title: "See if this treatment fits your goals",
    body: "A short consultation helps match benefits to your health and expectations.",
    label: "Book consultation",
  },
  TECHNOLOGY: {
    title: "Learn which technique suits you",
    body: "Devices and methods differ — we’ll recommend what is clinically appropriate.",
    label: "Ask about technique",
  },
  RESULTS: {
    title: "Talk through expected outcomes",
    body: "Realistic timelines and results vary — get guidance before you commit.",
    label: "Discuss outcomes",
  },
  BEFORE_AFTER: {
    title: "View results in context",
    body: "Every case is individual — discuss what is realistic for you.",
    label: "Book a review",
  },
  GALLERY: {
    title: "View results in context",
    body: "Speak with our team about cases similar to yours.",
    label: "Book a review",
  },
  IMAGE_GALLERY: {
    title: "View results in context",
    body: "Speak with our team about cases similar to yours.",
    label: "Book a review",
  },
  FAQ: {
    title: "Still have questions?",
    body: "We’re happy to answer anything not covered above — privately and clearly.",
    label: "Ask a question",
  },
  DOCTOR_ADVICE: {
    title: "Meet the clinical team",
    body: "Book time with Care Well for evidence-led recommendations.",
    label: "Meet the doctor",
  },
  ELIGIBILITY: {
    title: "Check if you’re a candidate",
    body: "Eligibility is individual — a consultation confirms next steps safely.",
    label: "Check eligibility",
  },
  CONSULTATION: {
    title: "Book your consultation",
    body: "Same-day replies on WhatsApp · South Delhi clinic.",
    label: "Book now",
  },
};

const DEFAULT_COPY: SectionCtaCopy = {
  title: "Talk to Care Well Medical Centre",
  body: "Evidence-led consultations for hair, aesthetics, and wellness.",
  label: "Book consultation",
};

export function getSectionContextualCtaCopy(
  type: SemanticSectionType,
): SectionCtaCopy {
  return BY_TYPE[type] ?? DEFAULT_COPY;
}

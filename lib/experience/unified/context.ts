/**
 * Context-aware component orchestration — same component, specialty messaging.
 * Does not create separate components per specialty.
 */

import type { ExperienceDocument } from "@/types/experience-document";

export type SpecialtyContextKey =
  | "hair"
  | "skin"
  | "plastic"
  | "body"
  | "hbot"
  | "aesthetic"
  | "default";

export type ContextAwareCtaCopy = {
  title: string;
  body: string;
  label: string;
};

const CTA_BY_SPECIALTY: Record<SpecialtyContextKey, ContextAwareCtaCopy> = {
  hair: {
    title: "Ready to restore your hair?",
    body: "Book a hair transplant consultation with our clinical team in South Delhi.",
    label: "Hair consultation",
  },
  skin: {
    title: "Skin treatments tailored to you",
    body: "From laser to regenerative care — get a personalised skin assessment.",
    label: "Skin consultation",
  },
  plastic: {
    title: "Explore surgical options safely",
    body: "Discuss goals, risks, and recovery with an experienced cosmetic surgeon.",
    label: "Book surgical consult",
  },
  body: {
    title: "Body contouring guidance",
    body: "Understand eligibility, downtime, and expected outcomes before you decide.",
    label: "Body consultation",
  },
  hbot: {
    title: "Ask about Hyperbaric Oxygen Therapy",
    body: "Learn whether HBOT may support your recovery or wellness goals.",
    label: "HBOT enquiry",
  },
  aesthetic: {
    title: "Aesthetic care with medical oversight",
    body: "Non-surgical and regenerative options — planned around your health.",
    label: "Aesthetic consultation",
  },
  default: {
    title: "Talk to Care Well Medical Centre",
    body: "Evidence-led consultations for hair, aesthetics, and wellness.",
    label: "Book consultation",
  },
};

export function detectSpecialtyFromHaystack(hay: string): SpecialtyContextKey {
  const h = hay.toLowerCase();
  if (/hair|transplant|fue|beard|scalp/.test(h)) return "hair";
  if (/skin|dermat|laser|pigment|acne/.test(h)) return "skin";
  if (/plastic|rhino|breast|facelift|surgery/.test(h)) return "plastic";
  if (/body|lipo|tummy|gynecomastia|weight/.test(h)) return "body";
  if (/hbot|hyperbaric|oxygen/.test(h)) return "hbot";
  if (/botox|filler|aesthetic|cosmetic|anti.?aging|peptide/.test(h)) {
    return "aesthetic";
  }
  return "default";
}

export function detectSpecialtyFromDocument(
  doc: ExperienceDocument,
): SpecialtyContextKey {
  const slug = doc.leadContext.specialtySlug ?? "";
  const hay = [
    slug,
    doc.uri,
    doc.title,
    ...doc.categories.map((c) => `${c.slug} ${c.name}`),
  ].join(" ");

  return detectSpecialtyFromHaystack(hay);
}

export function getContextAwareCtaCopyForSpecialty(
  key: SpecialtyContextKey,
): ContextAwareCtaCopy {
  return CTA_BY_SPECIALTY[key];
}

export function getContextAwareCtaCopy(
  doc: ExperienceDocument,
): ContextAwareCtaCopy {
  return CTA_BY_SPECIALTY[detectSpecialtyFromDocument(doc)];
}

/**
 * Enrich leadContext.specialtySlug when missing — enables downstream CTAs.
 */
export function applyContextAwareMessaging(
  doc: ExperienceDocument,
): ExperienceDocument {
  if (doc.leadContext.specialtySlug) return doc;

  const key = detectSpecialtyFromDocument(doc);
  return {
    ...doc,
    leadContext: {
      ...doc.leadContext,
      specialtySlug: key === "default" ? null : key,
    },
  };
}

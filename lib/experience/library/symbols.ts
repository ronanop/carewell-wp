/**
 * Global Experience Library — reusable sections / symbols.
 * Editing a symbol can update all referencing pages; local overrides allowed.
 */

export type ExperienceSymbolCategory =
  | "doctor"
  | "cta"
  | "faq"
  | "gallery"
  | "timeline"
  | "testimonial"
  | "pricing"
  | "recovery"
  | "benefits"
  | "location"
  | "generic";

export type ExperienceSymbol = {
  id: string;
  name: string;
  category: ExperienceSymbolCategory;
  /** Component type registered in the editorial / platform registry. */
  componentType: string;
  /** Default props (presentation only — no WP HTML). */
  defaults: Record<string, unknown>;
  /** When true, Studio offers “update all instances”. */
  globallyLinked: boolean;
  updatedAt: string;
};

const library = new Map<string, ExperienceSymbol>();

export function registerExperienceSymbol(symbol: ExperienceSymbol): void {
  library.set(symbol.id, symbol);
}

export function unregisterExperienceSymbol(id: string): void {
  library.delete(id);
}

export function getExperienceSymbol(id: string): ExperienceSymbol | undefined {
  return library.get(id);
}

export function listExperienceSymbols(
  category?: ExperienceSymbolCategory,
): ExperienceSymbol[] {
  const all = [...library.values()];
  if (!category) return all;
  return all.filter((s) => s.category === category);
}

export function resolveSymbolProps(
  symbolId: string,
  localOverride?: Record<string, unknown>,
): Record<string, unknown> | null {
  const symbol = library.get(symbolId);
  if (!symbol) return null;
  return { ...symbol.defaults, ...localOverride };
}

export function clearExperienceLibraryForTests(): void {
  library.clear();
}

/** Seed core Care Well symbols (idempotent). */
export function ensureDefaultExperienceSymbols(): void {
  if (library.size > 0) return;

  const now = new Date().toISOString();

  registerExperienceSymbol({
    id: "symbol.doctor.sandeep",
    name: "Dr. Sandeep Bhasin card",
    category: "doctor",
    componentType: "DoctorRecommendation",
    defaults: {
      name: "Dr. Sandeep Bhasin",
      title: "Cosmetic Surgeon · Care Well Medical Centre",
    },
    globallyLinked: true,
    updatedAt: now,
  });

  registerExperienceSymbol({
    id: "symbol.cta.consultation",
    name: "Consultation CTA",
    category: "cta",
    componentType: "InlineConsultationCta",
    defaults: {
      title: "Book a consultation",
      body: "Speak with our clinical team about personalised treatment options.",
    },
    globallyLinked: true,
    updatedAt: now,
  });

  registerExperienceSymbol({
    id: "symbol.faq.accordion",
    name: "FAQ accordion",
    category: "faq",
    componentType: "FaqAccordion",
    defaults: { variant: "accordion" },
    globallyLinked: false,
    updatedAt: now,
  });
}

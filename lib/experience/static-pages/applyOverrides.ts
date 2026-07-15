/**
 * Static page override helpers — PresentationConfig stores overrides only (ADR-015).
 */

import type { PresentationConfig } from "@/types/presentation-config";

/** Canonical dotted id → legacy hyphenated id (published configs). */
const SECTION_ID_ALIASES: Record<string, string[]> = {
  "home.hero": ["home-hero"],
  "home.trust": ["home-trust"],
  "home.journey": ["home-journey"],
  "home.services": ["home-services"],
  "home.ai-skin": ["home-ai-skin"],
  "home.doctors": ["home-doctor", "home-doctors"],
  "home.about": ["home-about"],
  "home.specialties": ["home-specialties"],
  "home.why": ["home-faq", "home-why"],
  "home.blog": ["home-blog"],
  "home.location": ["home-location"],
  "home.cta": ["home-cta"],
  "about.breadcrumb": ["about-breadcrumb"],
  "about.hero": ["about-hero"],
  "about.treatments": ["about-treatments"],
  "about.belief": ["about-belief"],
  "about.why": ["about-why"],
  "about.doctor": ["about-team", "about-doctor"],
  "about.mission": ["about-mission"],
  "about.cta": ["about-cta"],
  "about.values": ["about-values"],
  "about.clinic": ["about-clinic"],
  "contact.breadcrumb": ["contact-breadcrumb"],
  "contact.hero": ["contact-hero"],
  "contact.reach": ["contact-content", "contact-reach"],
  "contact.map": ["contact-location", "contact-map"],
  "privacy.content": ["privacy-content"],
  "disclaimer.content": ["disclaimer-content"],
  "terms.content": ["terms-content"],
  "not-found.message": ["nf-hero", "not-found-message"],
  "not-found.links": ["nf-cta", "not-found-links"],
  "thank-you.message": ["ty-hero", "thank-you-message"],
  "thank-you.cta": ["ty-cta", "thank-you-cta"],
};

function candidateIds(sectionId: string): string[] {
  const aliases = SECTION_ID_ALIASES[sectionId] ?? [];
  return [sectionId, ...aliases];
}

/** Reverse lookup: any known id → canonical dotted id when possible. */
export function normalizeSectionId(sectionId: string): string {
  if (SECTION_ID_ALIASES[sectionId]) return sectionId;
  for (const [canonical, aliases] of Object.entries(SECTION_ID_ALIASES)) {
    if (aliases.includes(sectionId)) return canonical;
  }
  return sectionId;
}

export function findSectionConfig(
  config: PresentationConfig | null | undefined,
  sectionId: string,
) {
  if (!config?.sections?.length) return undefined;
  const ids = new Set(candidateIds(sectionId));
  return config.sections.find((section) => ids.has(section.id));
}

export function isSectionEnabled(
  config: PresentationConfig | null | undefined,
  sectionId: string,
  fallback = true,
): boolean {
  if (!config) return fallback;
  const section = findSectionConfig(config, sectionId);
  return section ? section.enabled : fallback;
}

export function resolveSectionProps<T extends Record<string, unknown>>(
  config: PresentationConfig | null | undefined,
  sectionId: string,
  defaults: T = {} as T,
): T {
  if (!config?.propOverrides) return { ...defaults };
  const ids = candidateIds(sectionId);
  let merged: Record<string, unknown> = { ...defaults };
  for (const id of ids) {
    const overrides = config.propOverrides[id];
    if (overrides && typeof overrides === "object") {
      merged = { ...merged, ...overrides };
    }
  }
  return merged as T;
}

export function setPropOverride(
  config: PresentationConfig,
  sectionId: string,
  key: string,
  value: unknown,
): PresentationConfig {
  const canonical = normalizeSectionId(sectionId);
  const prev = config.propOverrides?.[canonical] ?? {};
  const nextProps = { ...prev };
  if (value === undefined || value === "") {
    delete nextProps[key];
  } else {
    nextProps[key] = value;
  }
  return {
    ...config,
    propOverrides: {
      ...config.propOverrides,
      [canonical]: nextProps,
    },
  };
}

/**
 * Rewrite legacy hyphenated section ids to canonical dotted ids.
 * Merges duplicate rows preferring existing enabled flags.
 * Ensures descriptor sections exist (adds missing with enabled=true).
 */
export function migrateStaticSectionIds(
  config: PresentationConfig,
  expectedSectionIds?: Array<{
    id: string;
    type: PresentationConfig["sections"][number]["type"];
    label: string;
    variant?: string;
  }>,
): PresentationConfig {
  const byCanonical = new Map<
    string,
    PresentationConfig["sections"][number]
  >();

  for (const section of config.sections) {
    const canonical = normalizeSectionId(section.id);
    const existing = byCanonical.get(canonical);
    if (!existing) {
      byCanonical.set(canonical, { ...section, id: canonical });
      continue;
    }
    byCanonical.set(canonical, {
      ...existing,
      ...section,
      id: canonical,
      enabled: existing.enabled || section.enabled,
      settings: {
        ...existing.settings,
        ...section.settings,
      },
    });
  }

  if (expectedSectionIds?.length) {
    for (const expected of expectedSectionIds) {
      if (byCanonical.has(expected.id)) continue;
      byCanonical.set(expected.id, {
        id: expected.id,
        type: expected.type,
        enabled: true,
        variant: expected.variant ?? "default",
        spacing: "default",
        background: "none",
        animation: "inherit",
        visibility: "always",
        settings: {
          doctorPhoto: null,
          gallery: [],
          heading: expected.label,
          supportingText: null,
        },
      });
    }
  }

  const propOverrides: Record<string, Record<string, unknown>> = {
    ...(config.propOverrides ?? {}),
  };
  for (const [key, value] of Object.entries(propOverrides)) {
    const canonical = normalizeSectionId(key);
    if (canonical === key) continue;
    propOverrides[canonical] = {
      ...(propOverrides[canonical] ?? {}),
      ...value,
    };
    delete propOverrides[key];
  }

  const ordered = expectedSectionIds?.length
    ? expectedSectionIds
        .map((expected) => byCanonical.get(expected.id))
        .filter((section): section is NonNullable<typeof section> =>
          Boolean(section),
        )
    : Array.from(byCanonical.values());

  return {
    ...config,
    sections: ordered,
    propOverrides,
  };
}

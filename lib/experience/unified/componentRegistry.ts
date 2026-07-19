/**
 * Experience component registration — plugin-driven, no hardcoding.
 * Complements editorial registry; Studio inspector contract is identical.
 */

export type ExperienceComponentCategory =
  | "hero"
  | "content"
  | "medical"
  | "conversion"
  | "media"
  | "social"
  | "navigation"
  | "chrome";

export type ExperienceInspectorPanel =
  | "content"
  | "appearance"
  | "spacing"
  | "typography"
  | "animations"
  | "responsive"
  | "visibility"
  | "media"
  | "bindings"
  | "accessibility"
  | "seo"
  | "developer";

export type ExperienceComponentRegistration = {
  type: string;
  category: ExperienceComponentCategory;
  label: string;
  supports: {
    variants?: string[];
    bindings?: boolean;
    animations?: boolean;
    responsive?: boolean;
    contextAware?: boolean;
  };
  inspector: ExperienceInspectorPanel[];
  /** Semantic section types this component can render. */
  semanticTypes?: string[];
};

const registry = new Map<string, ExperienceComponentRegistration>();

export function registerExperienceComponent(
  registration: ExperienceComponentRegistration,
): void {
  registry.set(registration.type, registration);
}

export function getExperienceComponent(
  type: string,
): ExperienceComponentRegistration | undefined {
  return registry.get(type);
}

export function listExperienceComponents(
  category?: ExperienceComponentCategory,
): ExperienceComponentRegistration[] {
  const all = [...registry.values()];
  if (!category) return all;
  return all.filter((r) => r.category === category);
}

export function clearExperienceComponentsForTests(): void {
  registry.clear();
}

const ALL_INSPECTOR: ExperienceInspectorPanel[] = [
  "content",
  "appearance",
  "spacing",
  "typography",
  "animations",
  "responsive",
  "visibility",
  "media",
  "bindings",
  "accessibility",
  "seo",
  "developer",
];

/** Seed core registrations (idempotent). */
export function ensureDefaultExperienceComponents(): void {
  if (registry.size > 0) return;

  const core: ExperienceComponentRegistration[] = [
    {
      type: "Hero",
      category: "hero",
      label: "Hero",
      supports: {
        variants: [
          "editorial",
          "medical",
          "luxury",
          "centered",
          "split",
          "image-left",
          "image-right",
          "video",
          "doctor",
          "minimal",
          "magazine",
          "service",
          "landing",
        ],
        bindings: true,
        animations: true,
        responsive: true,
      },
      inspector: ALL_INSPECTOR,
    },
    {
      type: "Benefits",
      category: "medical",
      label: "Benefits",
      supports: {
        variants: ["grid", "cards", "magazine", "luxury", "timeline"],
        responsive: true,
        contextAware: true,
      },
      inspector: ALL_INSPECTOR,
      semanticTypes: ["BENEFITS"],
    },
    {
      type: "FaqAccordion",
      category: "content",
      label: "FAQ",
      supports: {
        variants: ["accordion", "cards", "minimal", "magazine"],
        responsive: true,
      },
      inspector: ALL_INSPECTOR,
      semanticTypes: ["FAQ"],
    },
    {
      type: "InlineConsultationCta",
      category: "conversion",
      label: "Consultation CTA",
      supports: {
        variants: ["inline", "sticky", "floating"],
        contextAware: true,
        animations: true,
      },
      inspector: ALL_INSPECTOR,
    },
    {
      type: "DoctorRecommendation",
      category: "medical",
      label: "Doctor",
      supports: {
        variants: ["compact", "feature", "luxury", "horizontal", "sidebar"],
        contextAware: true,
      },
      inspector: ALL_INSPECTOR,
      semanticTypes: ["DOCTOR_ADVICE"],
    },
    {
      type: "RecoveryTimeline",
      category: "medical",
      label: "Recovery Timeline",
      supports: { variants: ["timeline", "calendar", "checklist"], responsive: true },
      inspector: ALL_INSPECTOR,
      semanticTypes: ["RECOVERY", "AFTERCARE", "TIMELINE"],
    },
    {
      type: "BeforeAfterSlider",
      category: "media",
      label: "Before / After",
      supports: { variants: ["slider", "side-by-side"], responsive: true, animations: true },
      inspector: ALL_INSPECTOR,
      semanticTypes: ["BEFORE_AFTER", "RESULTS"],
    },
    {
      type: "PricingComparison",
      category: "conversion",
      label: "Pricing",
      supports: { variants: ["minimal", "cards", "table"], contextAware: true },
      inspector: ALL_INSPECTOR,
      semanticTypes: ["COST", "COMPARISON"],
    },
  ];

  for (const reg of core) {
    registerExperienceComponent(reg);
  }
}

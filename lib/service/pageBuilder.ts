/**
 * Service page builder — section keys editors can add / remove / reorder in Sanity.
 * Content still lives on the named document fields (overview, comparison, …).
 * When `pageBuilder` is unset, the public template uses DEFAULT_SERVICE_SECTION_ORDER.
 */

export const SERVICE_SECTION_KEYS = [
  "overview",
  "howItWorks",
  "beforeAfter",
  "candidacy",
  "symptoms",
  "causes",
  "diagnosis",
  "benefits",
  "preparation",
  "recovery",
  "risks",
  "untreatedRisks",
  "mistakesToAvoid",
  "expectations",
  "whyChooseUs",
  "whenRecommended",
  "evidence",
  "myths",
  "comparison",
  "technology",
  "treatmentOptions",
  "pricing",
  "emi",
  "costSnapshot",
  "doctor",
  "testimonials",
  "faq",
  "relatedServices",
  "relatedBlogs",
] as const;

export type ServiceSectionKey = (typeof SERVICE_SECTION_KEYS)[number];

export const SERVICE_SECTION_LABELS: Record<ServiceSectionKey, string> = {
  overview: "Overview",
  howItWorks: "How it works",
  beforeAfter: "Before & after",
  candidacy: "Am I a candidate?",
  symptoms: "Symptoms",
  causes: "Causes",
  diagnosis: "Diagnosis",
  benefits: "Benefits",
  preparation: "Preparation",
  recovery: "Recovery",
  risks: "Risks",
  untreatedRisks: "Risks of waiting",
  mistakesToAvoid: "Mistakes to avoid",
  expectations: "Results & expectations",
  whyChooseUs: "Why choose us",
  whenRecommended: "When doctors recommend",
  evidence: "Medical evidence",
  myths: "Myth vs fact",
  comparison: "Comparison",
  technology: "Technology / techniques",
  treatmentOptions: "Treatment options",
  pricing: "Pricing",
  emi: "EMI calculator",
  costSnapshot: "Cost snapshot",
  doctor: "Doctor profile",
  testimonials: "Testimonials",
  faq: "FAQ",
  relatedServices: "Related services",
  relatedBlogs: "Related blogs",
};

/** Sanity Studio list options */
export const SERVICE_SECTION_LIST_OPTIONS = SERVICE_SECTION_KEYS.map((value) => ({
  title: SERVICE_SECTION_LABELS[value],
  value,
}));

/**
 * Default main-column order — matches the pre–page-builder template.
 * Used when `pageBuilder` is null/undefined (existing published pages).
 */
export const DEFAULT_SERVICE_SECTION_ORDER: ServiceSectionKey[] = [
  "overview",
  "howItWorks",
  "beforeAfter",
  "candidacy",
  "symptoms",
  "causes",
  "diagnosis",
  "benefits",
  "preparation",
  "recovery",
  "risks",
  "untreatedRisks",
  "mistakesToAvoid",
  "expectations",
  "whyChooseUs",
  "whenRecommended",
  "evidence",
  "myths",
  "comparison",
  "technology",
  "treatmentOptions",
  "pricing",
  "emi",
  "costSnapshot",
  "doctor",
  "testimonials",
  "faq",
  "relatedServices",
  "relatedBlogs",
];

export type PageBuilderSlot = {
  _key?: string;
  _type?: string;
  section?: string | null;
};

const KEY_SET = new Set<string>(SERVICE_SECTION_KEYS);

export function isServiceSectionKey(value: unknown): value is ServiceSectionKey {
  return typeof value === "string" && KEY_SET.has(value);
}

/**
 * Resolve render order for the main column.
 * - `undefined` / `null` → default order (legacy pages)
 * - `[]` → intentionally no main sections
 * - otherwise → editor order (invalid / duplicate keys dropped)
 */
export function resolveServiceSectionOrder(
  pageBuilder: PageBuilderSlot[] | null | undefined,
): ServiceSectionKey[] {
  if (pageBuilder == null) {
    return DEFAULT_SERVICE_SECTION_ORDER;
  }

  const seen = new Set<ServiceSectionKey>();
  const order: ServiceSectionKey[] = [];

  for (const slot of pageBuilder) {
    const key = slot?.section;
    if (!isServiceSectionKey(key) || seen.has(key)) continue;
    seen.add(key);
    order.push(key);
  }

  return order;
}

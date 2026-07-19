/**
 * Phase 7.0 Unified Experience invariants.
 * Run: npm run test:experience
 */

import {
  blogPresentationConfigToExperienceConfig,
  createDefaultExperienceConfig,
  experienceConfigToBlogPresentationConfig,
  presentationConfigToExperienceConfig,
} from "@/lib/experience/unified/migrate";
import { createDefaultBlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";
import { createDefaultPresentationConfig } from "@/lib/experience/validations/presentationConfig";
import { scoreExperienceIntelligence } from "@/lib/experience/unified/intelligence";
import { validateExperienceQuality } from "@/lib/experience/quality/validator";
import { buildExperienceReviewReport } from "@/lib/experience/quality/reviewMode";
import {
  clearExperienceLibraryForTests,
  ensureDefaultExperienceSymbols,
  getExperienceSymbol,
  resolveSymbolProps,
} from "@/lib/experience/library/symbols";
import {
  clearExperienceComponentsForTests,
  ensureDefaultExperienceComponents,
  getExperienceComponent,
  listExperienceComponents,
} from "@/lib/experience/unified/componentRegistry";
import {
  detectSpecialtyFromDocument,
  getContextAwareCtaCopy,
} from "@/lib/experience/unified/context";
import type { ExperienceDocument } from "@/types/experience-document";
import { DEFAULT_BLOG_SIDEBAR } from "@/lib/experience/validations/blogPresentationConfig";
import type { ResolvedPageChrome } from "@/types/page-chrome";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`OK: ${message}`);
}

function minimalDoc(
  overrides: Partial<ExperienceDocument> = {},
): ExperienceDocument {
  const config = createDefaultExperienceConfig("blog");
  const chrome = {
    pageType: "BLOG" as const,
    widgets: [],
  } as unknown as ResolvedPageChrome;

  return {
    kind: "blog",
    uri: "/peptide-therapy/",
    slug: "peptide-therapy",
    title: "Peptide Therapy Benefits",
    wordpressStatus: "publish",
    pageType: "BLOG",
    hero: {
      title: "Peptide Therapy Benefits",
      excerpt: "An overview",
      featuredImage: null,
      category: null,
      categories: [],
      publishedAt: "2026-01-01",
      modifiedAt: null,
      author: null,
      readingTimeMinutes: 8,
      views: null,
      shareUrl: "https://example.com/peptide-therapy/",
    },
    author: null,
    tags: [],
    categories: [
      { id: "1", name: "Peptides", slug: "peptide", count: 1, uri: "/category/peptide/", description: null },
    ],
    article: null,
    semantic: null,
    layout: {
      templateId: "treatment-guide",
      heroLayout: "editorial",
      spacingPreset: "comfortable",
      sections: [
        {
          section: {
            id: "s1",
            type: "BENEFITS",
            confidence: "high",
            ruleId: "core.benefits",
            title: "Benefits",
            anchorId: "benefits",
            nodes: [],
            listItems: [],
            faqs: [],
            headingLevel: 2,
          },
          variant: "grid",
          background: "none",
          width: "measure",
          spacing: "comfortable",
          imagePlacement: "inline",
          showInlineCta: true,
          separator: "none",
          visualWeight: 3,
        },
      ],
      validationNotes: [],
    },
    contentHtml: "<p>Hello</p>",
    toc: [],
    faqs: [],
    comments: [],
    related: [],
    previous: null,
    next: null,
    popular: [],
    latest: [],
    breadcrumbs: [{ label: "Home", href: "/" }],
    seo: {
      title: null,
      description: "Peptide therapy guide",
      canonicalUrl: null,
      openGraphTitle: null,
      openGraphDescription: null,
      openGraphImage: null,
    },
    config,
    sidebar: DEFAULT_BLOG_SIDEBAR,
    resolved: { heroImage: null, ogImage: null, sectionMedia: {} },
    presentationStatus: "PUBLISHED",
    chrome,
    leadContext: {
      pageUrl: "https://example.com/peptide-therapy/",
      pageTitle: "Peptide Therapy Benefits",
      category: "Peptides",
      specialtySlug: null,
    },
    ...overrides,
  };
}

// --- Migration round-trip ---
const blogConfig = createDefaultBlogPresentationConfig();
const asExperience = blogPresentationConfigToExperienceConfig(blogConfig);
assert(asExperience.experienceKind === "blog", "blog config migrates to experienceKind blog");
assert(Boolean(asExperience.experienceSidebar), "blog sidebar preserved on migrate");
const backToBlog = experienceConfigToBlogPresentationConfig(asExperience);
assert(
  (backToBlog.blogSidebar?.widgets.length ?? 0) > 0,
  "round-trip preserves blogSidebar widgets",
);

const pageConfig = createDefaultPresentationConfig("service");
const pageExp = presentationConfigToExperienceConfig(pageConfig, "service");
assert(pageExp.experienceKind === "service", "page config migrates as service");
assert(pageExp.layoutPreset === "medical-luxury", "service default layout preset");

const landing = createDefaultExperienceConfig("landing");
assert(landing.layoutPreset === "landing", "landing default preset");

// --- Intelligence ---
const intel = scoreExperienceIntelligence(minimalDoc());
assert(intel.conversionScore >= 0 && intel.conversionScore <= 100, "conversion score clamped");
assert(intel.readabilityScore >= 0 && intel.readabilityScore <= 100, "readability score clamped");
assert(Array.isArray(intel.recommendations), "intelligence recommendations array");

// --- Quality ---
const warnings = validateExperienceQuality(minimalDoc());
assert(Array.isArray(warnings), "quality warnings array");
const emptyTitle = validateExperienceQuality(minimalDoc({ title: "   " }));
assert(
  emptyTitle.some((w) => w.code === "empty-title"),
  "empty title yields error warning",
);

// --- Library ---
clearExperienceLibraryForTests();
ensureDefaultExperienceSymbols();
assert(Boolean(getExperienceSymbol("symbol.cta.consultation")), "default CTA symbol registered");
const props = resolveSymbolProps("symbol.cta.consultation", { title: "Custom" });
assert(props?.title === "Custom", "local symbol override wins");

// --- Component registry ---
clearExperienceComponentsForTests();
ensureDefaultExperienceComponents();
assert(Boolean(getExperienceComponent("Hero")), "Hero component registered");
assert(
  listExperienceComponents("conversion").length >= 1,
  "conversion components listed",
);
const hero = getExperienceComponent("Hero");
assert(
  (hero?.inspector.length ?? 0) >= 10,
  "Hero exposes full inspector panel set (Studio parity)",
);

// --- Context ---
const specialty = detectSpecialtyFromDocument(minimalDoc());
assert(specialty === "aesthetic" || specialty === "default", "peptide maps to aesthetic or default");
const cta = getContextAwareCtaCopy(
  minimalDoc({
    leadContext: {
      pageUrl: "/",
      pageTitle: "Hair Transplant in Delhi",
      category: "Hair",
      specialtySlug: "hair",
    },
    uri: "/hair-transplant-in-delhi/",
    title: "Hair Transplant in Delhi",
  }),
);
assert(cta.label.toLowerCase().includes("hair"), "hair specialty CTA messaging");

// --- Review Mode ---
const review = buildExperienceReviewReport(minimalDoc());
assert(review.overallScore >= 0 && review.overallScore <= 100, "review overall score");
assert(["A", "B", "C", "D", "F"].includes(review.grade), "review grade");
assert(review.dimensions.length >= 8, "review has dimension scores");
assert(
  review.dimensions.some((d) => d.id === "composition"),
  "review includes composition dimension (Phase 8.1)",
);
assert(
  review.dimensions.some((d) => d.id === "rhythm"),
  "review includes rhythm dimension (Phase 8.1)",
);

// --- Phase 8.0 Service editorial ---
import {
  scoreServiceSemanticConfidence,
  shouldUseServiceEditorialPath,
} from "@/lib/experience/service/confidence";
import { extractServiceSemanticSlots } from "@/lib/experience/service/semanticSlots";
import { ensureServiceSemanticRules } from "@/lib/experience/service/serviceSemanticRules";
import {
  experienceHasEditorialPipeline,
  serviceDocumentToExperience,
} from "@/lib/experience/unified/adapters";
import type { ServiceDocument } from "@/types/service-document";
import { DEFAULT_SERVICE_SIDEBAR } from "@/types/service-document";
import type { SemanticAnalysisResult } from "@/types/semantic-article";

ensureServiceSemanticRules();

const lowSemantic: SemanticAnalysisResult = {
  version: 1,
  sections: [
    {
      id: "s1",
      type: "GENERIC",
      confidence: "low",
      ruleId: null,
      title: "Intro",
      anchorId: "intro",
      nodes: [],
      listItems: [],
      faqs: [],
      headingLevel: 2,
    },
  ],
  documentFaqs: [],
};
assert(
  scoreServiceSemanticConfidence(lowSemantic) === "low",
  "generic-only sections → low confidence",
);
assert(
  shouldUseServiceEditorialPath("low") === false,
  "low confidence uses legacy PresentationPage",
);
assert(
  shouldUseServiceEditorialPath("medium") === true,
  "medium confidence uses editorial path",
);

const richSemantic: SemanticAnalysisResult = {
  version: 1,
  sections: [
    {
      id: "b",
      type: "BENEFITS",
      confidence: "high",
      ruleId: "core.benefits",
      title: "Benefits",
      anchorId: "benefits",
      nodes: [],
      listItems: ["a", "b", "c"],
      faqs: [],
      headingLevel: 2,
    },
    {
      id: "p",
      type: "PROCEDURE",
      confidence: "high",
      ruleId: "service.treatment-process",
      title: "Procedure",
      anchorId: "procedure",
      nodes: [],
      listItems: [],
      faqs: [],
      headingLevel: 2,
    },
    {
      id: "r",
      type: "RECOVERY",
      confidence: "medium",
      ruleId: "core.recovery",
      title: "Recovery",
      anchorId: "recovery",
      nodes: [],
      listItems: [],
      faqs: [],
      headingLevel: 2,
    },
    {
      id: "t",
      type: "TECHNOLOGY",
      confidence: "high",
      ruleId: "service.technology",
      title: "Technology",
      anchorId: "tech",
      nodes: [],
      listItems: [],
      faqs: [],
      headingLevel: 2,
    },
  ],
  documentFaqs: [],
};
assert(
  scoreServiceSemanticConfidence(richSemantic) === "high" ||
    scoreServiceSemanticConfidence(richSemantic) === "medium",
  "classified treatment sections → medium/high confidence",
);

const slots = extractServiceSemanticSlots(richSemantic);
assert(slots.benefits?.type === "BENEFITS", "slots.benefits extracted");
assert(slots.procedure?.type === "PROCEDURE", "slots.procedure extracted");
assert(slots.technology?.type === "TECHNOLOGY", "slots.technology extracted");
assert(slots.cost === null, "missing slots stay null");

const serviceDoc = {
  kind: "service",
  uri: "/hair-transplant/",
  slug: "hair-transplant",
  title: "Hair Transplant",
  wordpressStatus: "publish",
  pageType: "SERVICE",
  experienceKind: "service",
  hero: {
    title: "Hair Transplant",
    subtitle: "FUE in Delhi",
    featuredImage: null,
    category: "Hair",
    treatmentName: "Hair Transplant",
    durationLabel: null,
    recoveryLabel: null,
    experienceLabel: "20+ years",
    shareUrl: "https://example.com/hair-transplant/",
    readingTimeMinutes: 10,
  },
  article: {
    version: 1,
    content: { version: 1 as const, sourceHash: "test", nodes: [] },
    blockMeta: {},
    toc: [],
    faqs: [],
    readingTimeMinutes: 10,
    wordCount: 100,
    sourceHash: "test",
  },
  semantic: richSemantic,
  slots,
  layout: minimalDoc().layout!,
  contentHtml: "<h2>Benefits</h2><p>…</p>",
  toc: [],
  faqs: [],
  relatedTreatments: [],
  relatedBlogs: [],
  breadcrumbs: [{ label: "Home", href: "/" }],
  seo: {
    title: null,
    description: null,
    canonicalUrl: null,
    openGraphTitle: null,
    openGraphDescription: null,
    openGraphImage: null,
  },
  config: createDefaultExperienceConfig("service"),
  sidebar: DEFAULT_SERVICE_SIDEBAR,
  resolved: { heroImage: null, ogImage: null, sectionMedia: {} },
  presentationStatus: "PUBLISHED",
  chrome: minimalDoc().chrome,
  leadContext: {
    pageUrl: "https://example.com/hair-transplant/",
    pageTitle: "Hair Transplant",
    category: "Hair Transplant",
    specialtySlug: "hair-transplant",
  },
  useLegacyPresentationFallback: false,
  semanticConfidence: "high",
} satisfies ServiceDocument;

const asExp = serviceDocumentToExperience(serviceDoc);
assert(asExp.kind === "service", "serviceDocument maps to experience kind service");
assert(experienceHasEditorialPipeline(asExp), "service experience has editorial pipeline");
assert(asExp.useLegacyPresentationFallback === false, "high confidence skips legacy");
assert(asExp.hero.excerpt === "FUE in Delhi", "service subtitle → hero excerpt");

// --- Phase 8.1 composition polish ---
import { polishComposition } from "@/lib/experience/layout/composition";
import { getSectionContextualCtaCopy } from "@/lib/experience/layout/contextualCta";
import type { ComposedSection } from "@/types/editorial-layout";

const rawSections: ComposedSection[] = [
  {
    section: richSemantic.sections[0]!,
    variant: "grid",
    background: "none",
    width: "measure",
    spacing: "comfortable",
    imagePlacement: "inline",
    showInlineCta: true,
    separator: "none",
    visualWeight: 3,
  },
  {
    section: richSemantic.sections[1]!,
    variant: "timeline",
    background: "none",
    width: "measure",
    spacing: "comfortable",
    imagePlacement: "side-by-side",
    showInlineCta: true,
    separator: "none",
    visualWeight: 4,
  },
  {
    section: richSemantic.sections[2]!,
    variant: "timeline",
    background: "none",
    width: "measure",
    spacing: "comfortable",
    imagePlacement: "inline",
    showInlineCta: false,
    separator: "none",
    visualWeight: 3,
  },
];

const polished = polishComposition(rawSections, {
  preferSoftSurfaces: true,
  tightHeroHandoff: true,
  defaultCardStyle: "medical",
});
assert(
  Boolean(polished[0]?.presentationMode),
  "polish assigns presentationMode",
);
assert(polished[0]?.importance === "primary", "benefits is primary importance");
assert(
  polished[0]?.presentationMode !== polished[1]?.presentationMode ||
    polished[0]?.background !== polished[1]?.background,
  "adjacent sections differ in mode or background",
);
assert(Boolean(polished[0]?.spacingTokens), "neighbor spacing tokens assigned");
assert(Boolean(polished[0]?.ctaCopy?.title), "CTA copy attached when showInlineCta");
assert(
  getSectionContextualCtaCopy("RECOVERY").title.toLowerCase().includes("recovery"),
  "recovery CTA is contextual",
);
assert(
  getSectionContextualCtaCopy("COST").title.toLowerCase().includes("estimate"),
  "cost CTA is contextual",
);

console.log("\nAll experience invariants passed.");

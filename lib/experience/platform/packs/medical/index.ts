/**
 * Medical Pack — first built-in marketplace-ready block pack.
 * Registers manifests + bindings only (UI components resolve via componentKey).
 */

import { z } from "zod";

import { registerBlock } from "@/lib/experience/platform/sdk/registerBlock";

const PACK_ID = "medical";

const passthrough = z.record(z.string(), z.unknown());

export function registerMedicalPack(): void {
  registerBlock({
    id: "section-container",
    name: "Section Container",
    category: "Layout",
    packId: PACK_ID,
    description: "Layout wrapper that accepts nested child blocks.",
    componentKey: "section-container",
    inspectorKey: "section-container-inspector",
    schema: passthrough,
    bindings: {},
    acceptsChildren: true,
    capabilities: {
      resizable: true,
      draggable: true,
      nestable: true,
      responsive: true,
      supportsVariants: true,
      supportsBindings: true,
    },
    allowedChildCategories: [
      "Hero",
      "Trust",
      "Content",
      "Doctor",
      "Gallery",
      "Pricing",
      "Timeline",
      "FAQ",
      "Location",
      "Related",
      "Testimonials",
      "CTA",
      "Layout",
    ],
    defaultProps: {
      spacing: "default",
      background: "none",
    },
    thumbnail: "/blocks/section-container.png",
    version: "1.0.0",
  });

  registerBlock({
    id: "hero-editorial",
    name: "Hero Editorial",
    category: "Hero",
    packId: PACK_ID,
    description: "Editorial hero bound to page title and featured image.",
    componentKey: "hero-editorial",
    inspectorKey: "hero-editorial-inspector",
    schema: passthrough,
    bindings: {
      title: { kind: "field", path: "page.title" },
      imageUrl: { kind: "computed", compute: "featuredImageOrFallback" },
      imageAlt: { kind: "field", path: "page.featuredImage.alt" },
    },
    defaultProps: {
      variant: "editorial",
      showCta: true,
      showTrustBadges: true,
    },
    thumbnail: "/blocks/hero-editorial.png",
    themeCompatibility: { tokens: ["primary", "surface", "typography"] },
    capabilities: {
      resizable: true,
      croppable: true,
      draggable: true,
      editableText: true,
      responsive: true,
      supportsVariants: true,
      supportsBindings: true,
    },
    version: "1.0.0",
  });

  registerBlock({
    id: "hero-premium",
    name: "Hero Premium",
    category: "Hero",
    packId: PACK_ID,
    description: "Premium full-bleed hero for service landing pages.",
    componentKey: "hero-premium",
    inspectorKey: "hero-premium-inspector",
    schema: passthrough,
    bindings: {
      title: { kind: "field", path: "page.title" },
      imageUrl: { kind: "computed", compute: "featuredImageOrFallback" },
      ctaLabel: { kind: "static", value: "Book consultation" },
    },
    defaultProps: {
      variant: "premium",
      height: "tall",
    },
    thumbnail: "/blocks/hero-premium.png",
    supportedTemplates: ["hair-treatment", "plastic-surgery", "skin"],
    version: "1.0.0",
  });

  registerBlock({
    id: "trust-badges",
    name: "Trust Badges",
    category: "Trust",
    packId: PACK_ID,
    description: "Trust strip for credentials and clinic highlights.",
    componentKey: "trust-badges",
    inspectorKey: "trust-badges-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: {
      badges: ["15+ years experience", "South Delhi clinic", "Board-certified care"],
    },
    version: "1.0.0",
  });

  registerBlock({
    id: "content-body",
    name: "Content Body",
    category: "Content",
    packId: PACK_ID,
    description: "Renders WordPress HTML via binding — never edits content.",
    componentKey: "content-body",
    inspectorKey: "content-body-inspector",
    schema: passthrough,
    bindings: {
      html: { kind: "field", path: "page.contentHtml" },
      title: { kind: "field", path: "page.title" },
    },
    defaultProps: {
      readingWidth: "editorial",
    },
    version: "1.0.0",
  });

  registerBlock({
    id: "doctor-card",
    name: "Doctor Card",
    category: "Doctor",
    packId: PACK_ID,
    description: "Doctor presentation card. Shows only when doctor data exists.",
    componentKey: "doctor-card",
    inspectorKey: "doctor-card-inspector",
    schema: passthrough,
    bindings: {
      name: { kind: "field", path: "doctor.name" },
      designation: { kind: "field", path: "doctor.designation" },
      photoUrl: { kind: "field", path: "doctor.photoUrl" },
    },
    defaultProps: {},
    version: "1.0.0",
  });

  registerBlock({
    id: "gallery-grid",
    name: "Gallery Grid",
    category: "Gallery",
    packId: PACK_ID,
    description: "Before/after or clinic gallery grid.",
    componentKey: "gallery-grid",
    inspectorKey: "gallery-grid-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: { style: "grid" },
    version: "1.0.0",
  });

  registerBlock({
    id: "pricing-card",
    name: "Pricing Card",
    category: "Pricing",
    packId: PACK_ID,
    description: "Pricing presentation block.",
    componentKey: "pricing-card",
    inspectorKey: "pricing-card-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: {},
    version: "1.0.0",
  });

  registerBlock({
    id: "procedure-timeline",
    name: "Procedure Timeline",
    category: "Timeline",
    packId: PACK_ID,
    description: "Step timeline for procedures.",
    componentKey: "procedure-timeline",
    inspectorKey: "procedure-timeline-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: { variant: "steps" },
    version: "1.0.0",
  });

  registerBlock({
    id: "faq-accordion",
    name: "FAQ Accordion",
    category: "FAQ",
    packId: PACK_ID,
    description: "FAQ presentation styles for WordPress FAQ content.",
    componentKey: "faq-accordion",
    inspectorKey: "faq-accordion-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: { style: "accordion" },
    version: "1.0.0",
  });

  registerBlock({
    id: "location-map",
    name: "Location Map",
    category: "Location",
    packId: PACK_ID,
    description: "Clinic location presentation.",
    componentKey: "location-map",
    inspectorKey: "location-map-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: {},
    version: "1.0.0",
  });

  registerBlock({
    id: "related-treatments",
    name: "Related Treatments",
    category: "Related",
    packId: PACK_ID,
    description: "Related treatment links.",
    componentKey: "related-treatments",
    inspectorKey: "related-treatments-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: {},
    version: "1.0.0",
  });

  registerBlock({
    id: "related-blogs",
    name: "Related Blogs",
    category: "Related",
    packId: PACK_ID,
    description: "Related blog cards.",
    componentKey: "related-blogs",
    inspectorKey: "related-blogs-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: {},
    version: "1.0.0",
  });

  registerBlock({
    id: "testimonials-quote",
    name: "Testimonials",
    category: "Testimonials",
    packId: PACK_ID,
    description: "Patient testimonials presentation.",
    componentKey: "testimonials-quote",
    inspectorKey: "testimonials-quote-inspector",
    schema: passthrough,
    bindings: {},
    defaultProps: { variant: "quote" },
    version: "1.0.0",
  });

  registerBlock({
    id: "final-cta",
    name: "Final CTA",
    category: "CTA",
    packId: PACK_ID,
    description: "Closing consultation call-to-action.",
    componentKey: "final-cta",
    inspectorKey: "final-cta-inspector",
    schema: passthrough,
    bindings: {
      pageTitle: { kind: "field", path: "page.title" },
    },
    defaultProps: {},
    version: "1.0.0",
  });
}

export const MEDICAL_PACK_ID = PACK_ID;

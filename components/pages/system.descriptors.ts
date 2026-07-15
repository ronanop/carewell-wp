/**
 * Legal + system page section descriptors (ADR-015).
 */

import type { SectionDescriptor } from "@/types/static-page-descriptor";

export const PRIVACY_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "privacy.content",
    displayName: "Policy body",
    type: "content",
    legacyIds: ["privacy-content"],
    editableProps: [],
    supports: { drag: false },
  },
];

export const DISCLAIMER_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "disclaimer.content",
    displayName: "Disclaimer body",
    type: "content",
    legacyIds: ["disclaimer-content"],
    editableProps: [],
    supports: { drag: false },
  },
];

export const TERMS_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "terms.content",
    displayName: "Terms body",
    type: "content",
    legacyIds: ["terms-content"],
    editableProps: [],
    supports: { drag: false },
  },
];

export const NOT_FOUND_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "not-found.message",
    displayName: "Message",
    type: "hero",
    defaultVariant: "minimal",
    legacyIds: ["nf-hero", "not-found-message"],
    editableProps: [],
    supports: { drag: false, animation: true },
  },
  {
    id: "not-found.links",
    displayName: "Helpful links",
    type: "cta",
    legacyIds: ["nf-cta", "not-found-links"],
    editableProps: [],
    supports: { drag: false },
  },
];

export const THANK_YOU_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "thank-you.message",
    displayName: "Confirmation",
    type: "hero",
    defaultVariant: "minimal",
    legacyIds: ["ty-hero", "thank-you-message"],
    editableProps: [],
    supports: { drag: false, animation: true },
  },
  {
    id: "thank-you.cta",
    displayName: "Next steps",
    type: "cta",
    legacyIds: ["ty-cta", "thank-you-cta"],
    editableProps: [],
    supports: { drag: false },
  },
];

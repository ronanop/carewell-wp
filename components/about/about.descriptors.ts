/**
 * About section descriptors (ADR-015 / ADR-016).
 */

import {
  ABOUT_CTA_ELEMENTS,
  ABOUT_HERO_ELEMENTS,
} from "@/components/about/about.elements";
import type { SectionDescriptor } from "@/types/static-page-descriptor";

export const ABOUT_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "about.hero",
    displayName: "Hero",
    type: "hero",
    defaultVariant: "editorial",
    legacyIds: ["about-hero", "about.breadcrumb", "about-breadcrumb"],
    editableProps: [],
    elements: ABOUT_HERO_ELEMENTS,
    supports: { drag: true, animation: true, responsive: true },
  },
  {
    id: "about.stats",
    displayName: "Stats strip",
    type: "content",
    legacyIds: [],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.treatments",
    displayName: "Our story",
    type: "related-treatments",
    legacyIds: ["about-treatments"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.belief",
    displayName: "Belief band",
    type: "content",
    legacyIds: ["about-belief"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.doctor",
    displayName: "Doctor",
    type: "doctor",
    legacyIds: ["about-team", "about-doctor"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.why",
    displayName: "Why choose us",
    type: "faq",
    legacyIds: ["about-why"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.mission",
    displayName: "Vision & mission",
    type: "content",
    legacyIds: ["about-mission"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.values",
    displayName: "Value pillars",
    type: "content",
    legacyIds: ["about-values"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.clinic",
    displayName: "Clinic",
    type: "content",
    legacyIds: ["about-clinic"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
  {
    id: "about.cta",
    displayName: "Visit CTA",
    type: "cta",
    legacyIds: ["about-cta"],
    editableProps: [],
    elements: ABOUT_CTA_ELEMENTS,
    supports: { drag: true, animation: true },
  },
];

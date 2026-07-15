/**
 * Home section descriptors — editable props / supports (ADR-015 / ADR-016).
 */

import { HOME_CTA_ELEMENTS } from "@/components/home/homeCta.elements";
import {
  HOME_BLOG_ELEMENTS,
  HOME_JOURNEY_ELEMENTS,
  HOME_SERVICES_ELEMENTS,
  HOME_WHY_ELEMENTS,
} from "@/components/home/homeContent.elements";
import {
  HOME_ABOUT_HOME_ELEMENTS,
  HOME_AI_ELEMENTS,
  HOME_DOCTOR_ELEMENTS,
  HOME_LOCATION_ELEMENTS,
  HOME_SPECIALTY_ELEMENTS,
} from "@/components/home/homeDoctorsLocation.elements";
import { HOME_HERO_ELEMENTS } from "@/components/home/homeHero.elements";
import { HOME_TRUST_ELEMENTS } from "@/components/home/homeTrust.elements";
import type { SectionDescriptor } from "@/types/static-page-descriptor";

export const homeHeroDescriptor: SectionDescriptor = {
  id: "home.hero",
  displayName: "Hero",
  type: "hero",
  defaultVariant: "premium",
  legacyIds: ["home-hero"],
  editableProps: [],
  elements: HOME_HERO_ELEMENTS,
  supports: {
    drag: true,
    animation: true,
    responsive: true,
    duplicatable: false,
  },
  inspectorPanels: ["content", "media", "layout"],
};

export const homeTrustDescriptor: SectionDescriptor = {
  id: "home.trust",
  displayName: "Trust indicators",
  type: "trust",
  legacyIds: ["home-trust"],
  editableProps: [],
  elements: HOME_TRUST_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeJourneyDescriptor: SectionDescriptor = {
  id: "home.journey",
  displayName: "Treatment journey",
  type: "timeline",
  legacyIds: ["home-journey"],
  editableProps: [],
  elements: HOME_JOURNEY_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeServicesDescriptor: SectionDescriptor = {
  id: "home.services",
  displayName: "Services",
  type: "related-treatments",
  legacyIds: ["home-services"],
  editableProps: [],
  elements: HOME_SERVICES_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeAiSkinDescriptor: SectionDescriptor = {
  id: "home.ai-skin",
  displayName: "AI skin analysis",
  type: "content",
  legacyIds: ["home-ai-skin"],
  editableProps: [],
  elements: HOME_AI_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeDoctorsDescriptor: SectionDescriptor = {
  id: "home.doctors",
  displayName: "Doctors",
  type: "doctor",
  legacyIds: ["home-doctor", "home-doctors"],
  editableProps: [],
  elements: HOME_DOCTOR_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeAboutDescriptor: SectionDescriptor = {
  id: "home.about",
  displayName: "About",
  type: "content",
  legacyIds: ["home-about"],
  editableProps: [],
  elements: HOME_ABOUT_HOME_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeSpecialtiesDescriptor: SectionDescriptor = {
  id: "home.specialties",
  displayName: "Consultation specialties",
  type: "content",
  legacyIds: ["home-specialties"],
  editableProps: [],
  elements: HOME_SPECIALTY_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeWhyDescriptor: SectionDescriptor = {
  id: "home.why",
  displayName: "Why choose us",
  type: "faq",
  defaultVariant: "cards",
  legacyIds: ["home-faq", "home-why"],
  editableProps: [],
  elements: HOME_WHY_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeBlogDescriptor: SectionDescriptor = {
  id: "home.blog",
  displayName: "Blog",
  type: "related-blogs",
  legacyIds: ["home-blog"],
  editableProps: [],
  elements: HOME_BLOG_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeLocationDescriptor: SectionDescriptor = {
  id: "home.location",
  displayName: "Location",
  type: "location",
  legacyIds: ["home-location"],
  editableProps: [],
  elements: HOME_LOCATION_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const homeCtaDescriptor: SectionDescriptor = {
  id: "home.cta",
  displayName: "CTA banner",
  type: "cta",
  legacyIds: ["home-cta"],
  editableProps: [],
  elements: HOME_CTA_ELEMENTS,
  supports: { drag: true, animation: true, responsive: true },
};

export const HOME_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  homeHeroDescriptor,
  homeTrustDescriptor,
  homeJourneyDescriptor,
  homeServicesDescriptor,
  homeAiSkinDescriptor,
  homeDoctorsDescriptor,
  homeAboutDescriptor,
  homeSpecialtiesDescriptor,
  homeWhyDescriptor,
  homeBlogDescriptor,
  homeLocationDescriptor,
  homeCtaDescriptor,
];

/**
 * Global element + repeater descriptor registry (ADR-016 / ADR-017).
 * Auto-discovers by importing section descriptor modules.
 */

import { ABOUT_ELEMENTS } from "@/components/about/about.elements";
import { CONTACT_ELEMENTS } from "@/components/contact/contact.elements";
import {
  HOME_BLOG_ELEMENTS,
  HOME_JOURNEY_ELEMENTS,
  HOME_SERVICES_ELEMENTS,
  HOME_WHY_ELEMENTS,
  homeBlogRepeater,
  homeJourneyRepeater,
  homeServicesRepeater,
  homeWhyRepeater,
} from "@/components/home/homeContent.elements";
import {
  HOME_AI_ELEMENTS,
  HOME_ABOUT_HOME_ELEMENTS,
  HOME_DOCTOR_ELEMENTS,
  HOME_LOCATION_ELEMENTS,
  HOME_SPECIALTY_ELEMENTS,
  homeDoctorHighlightsRepeater,
  homeDoctorStatsRepeater,
  homeSpecialtiesRepeater,
} from "@/components/home/homeDoctorsLocation.elements";
import { HOME_CTA_ELEMENTS } from "@/components/home/homeCta.elements";
import { HOME_HERO_ELEMENTS } from "@/components/home/homeHero.elements";
import { HOME_TRUST_ELEMENTS } from "@/components/home/homeTrust.elements";
import type { ElementDescriptor } from "@/types/element-descriptor";
import type { RepeaterDescriptor } from "@/types/repeater-descriptor";

const elements = new Map<string, ElementDescriptor>();
const repeaters = new Map<string, RepeaterDescriptor>();

export function registerElementDescriptors(
  descriptors: ElementDescriptor[],
): void {
  for (const descriptor of descriptors) {
    elements.set(descriptor.id, descriptor);
  }
}

export function registerRepeaterDescriptor(
  descriptor: RepeaterDescriptor,
): void {
  repeaters.set(descriptor.id, descriptor);
}

export function findElementDescriptor(
  elementId: string,
): ElementDescriptor | undefined {
  return elements.get(elementId);
}

export function findRepeaterDescriptor(
  repeaterId: string,
): RepeaterDescriptor | undefined {
  return repeaters.get(repeaterId);
}

export function listElementDescriptorsForSection(
  sectionId: string,
): ElementDescriptor[] {
  return Array.from(elements.values()).filter(
    (el) => el.sectionId === sectionId,
  );
}

export function listAllElementDescriptors(): ElementDescriptor[] {
  return Array.from(elements.values());
}

export function listAllRepeaterDescriptors(): RepeaterDescriptor[] {
  return Array.from(repeaters.values());
}

/** Seed — importing this module registers everything for Studio discovery. */
const SEED_ELEMENTS: ElementDescriptor[] = [
  ...HOME_HERO_ELEMENTS,
  ...HOME_TRUST_ELEMENTS,
  ...HOME_CTA_ELEMENTS,
  ...HOME_SERVICES_ELEMENTS,
  ...HOME_BLOG_ELEMENTS,
  ...HOME_JOURNEY_ELEMENTS,
  ...HOME_WHY_ELEMENTS,
  ...HOME_DOCTOR_ELEMENTS,
  ...HOME_LOCATION_ELEMENTS,
  ...HOME_AI_ELEMENTS,
  ...HOME_ABOUT_HOME_ELEMENTS,
  ...HOME_SPECIALTY_ELEMENTS,
  ...ABOUT_ELEMENTS,
  ...CONTACT_ELEMENTS,
];

const SEED_REPEATERS: RepeaterDescriptor[] = [
  homeServicesRepeater,
  homeBlogRepeater,
  homeJourneyRepeater,
  homeWhyRepeater,
  homeDoctorStatsRepeater,
  homeDoctorHighlightsRepeater,
  homeSpecialtiesRepeater,
];

registerElementDescriptors(SEED_ELEMENTS);
for (const repeater of SEED_REPEATERS) {
  registerRepeaterDescriptor(repeater);
}

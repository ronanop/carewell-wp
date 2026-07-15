/**
 * Static page descriptor registry (ADR-015).
 * React views resolve on the client via clientRegistry — never pass components RSC→client.
 */

import { ABOUT_SECTION_DESCRIPTORS } from "@/components/about/about.descriptors";
import { CONTACT_SECTION_DESCRIPTORS } from "@/components/contact/contact.descriptors";
import { HOME_SECTION_DESCRIPTORS } from "@/components/home/home.descriptors";
import {
  DISCLAIMER_SECTION_DESCRIPTORS,
  NOT_FOUND_SECTION_DESCRIPTORS,
  PRIVACY_SECTION_DESCRIPTORS,
  TERMS_SECTION_DESCRIPTORS,
  THANK_YOU_SECTION_DESCRIPTORS,
} from "@/components/pages/system.descriptors";
import type {
  SectionDescriptor,
  StaticPageDescriptor,
} from "@/types/static-page-descriptor";
import type {
  StaticPageDefinition,
  StaticPageSlug,
} from "@/types/static-page";

const descriptors = new Map<string, StaticPageDescriptor>();

export function registerStaticPageDescriptor(
  descriptor: StaticPageDescriptor,
): void {
  descriptors.set(descriptor.id, descriptor);
}

export function getStaticPageDescriptor(
  slug: string,
): StaticPageDescriptor | undefined {
  return descriptors.get(slug);
}

export function listStaticPageDescriptors(): StaticPageDescriptor[] {
  return Array.from(descriptors.values());
}

/** @deprecated Prefer getStaticPageDescriptor — module shape without component. */
export type StaticPageModule = {
  descriptor: StaticPageDescriptor;
};

export function getStaticPageModule(
  slug: string,
): StaticPageModule | undefined {
  const descriptor = getStaticPageDescriptor(slug);
  return descriptor ? { descriptor } : undefined;
}

export function listStaticPageModules(): StaticPageModule[] {
  return listStaticPageDescriptors().map((descriptor) => ({ descriptor }));
}

export function registerStaticPageModule(mod: StaticPageModule): void {
  registerStaticPageDescriptor(mod.descriptor);
}

/** Convert descriptor → legacy StaticPageDefinition for bootstrap / list UI. */
export function descriptorToDefinition(
  descriptor: StaticPageDescriptor,
): StaticPageDefinition {
  return {
    slug: descriptor.id,
    title: descriptor.title,
    path: descriptor.route,
    category: descriptor.category,
    description: descriptor.description,
    templateSlug: descriptor.templateSlug,
    sections: descriptor.sections.map((section) => ({
      id: section.id,
      type: section.type,
      label: section.displayName,
      variant: section.defaultVariant,
      enabled: true,
    })),
  };
}

export function findSectionDescriptor(
  pageSlug: string,
  sectionId: string,
): SectionDescriptor | undefined {
  const descriptor = getStaticPageDescriptor(pageSlug);
  if (!descriptor) return undefined;
  return descriptor.sections.find(
    (section) =>
      section.id === sectionId || section.legacyIds?.includes(sectionId),
  );
}

const SEED: StaticPageDescriptor[] = [
  {
    id: "home",
    title: "Homepage",
    route: "/",
    category: "Marketing",
    description: "Primary marketing homepage — hero, services, trust, CTA.",
    templateSlug: "home",
    sections: HOME_SECTION_DESCRIPTORS,
    breakpoints: ["desktop", "tablet", "mobile"],
    constraints: { lockedSectionIds: ["home.hero"] },
  },
  {
    id: "about",
    title: "About Us",
    route: "/about",
    category: "About",
    description: "Clinic story, mission, values, and team.",
    templateSlug: "about",
    sections: ABOUT_SECTION_DESCRIPTORS,
    breakpoints: ["desktop", "tablet", "mobile"],
  },
  {
    id: "contact",
    title: "Contact",
    route: "/contact",
    category: "Contact",
    description: "Map, contact cards, consultation form, hours.",
    templateSlug: "contact",
    sections: CONTACT_SECTION_DESCRIPTORS,
    breakpoints: ["desktop", "tablet", "mobile"],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    route: "/privacy-policy",
    category: "Legal",
    description: "Legal typography, spacing, and section chrome.",
    templateSlug: "legal",
    sections: PRIVACY_SECTION_DESCRIPTORS,
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    route: "/disclaimer",
    category: "Legal",
    description: "Medical disclaimer presentation.",
    templateSlug: "legal",
    sections: DISCLAIMER_SECTION_DESCRIPTORS,
  },
  {
    id: "terms",
    title: "Terms",
    route: "/terms",
    category: "Legal",
    description: "Terms of use presentation.",
    templateSlug: "legal",
    sections: TERMS_SECTION_DESCRIPTORS,
  },
  {
    id: "not-found",
    title: "404 Not Found",
    route: "/404",
    category: "System",
    description: "Editable not-found experience.",
    templateSlug: "system",
    sections: NOT_FOUND_SECTION_DESCRIPTORS,
  },
  {
    id: "thank-you",
    title: "Thank You",
    route: "/thank-you",
    category: "System",
    description: "Post-lead confirmation page.",
    templateSlug: "system",
    sections: THANK_YOU_SECTION_DESCRIPTORS,
  },
];

for (const descriptor of SEED) {
  registerStaticPageDescriptor(descriptor);
}

export function isRegisteredStaticPageSlug(
  value: string,
): value is StaticPageSlug {
  return descriptors.has(value);
}

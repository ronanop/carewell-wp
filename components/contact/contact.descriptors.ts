/**
 * Contact section descriptors (ADR-015 / ADR-016).
 */

import {
  CONTACT_HERO_ELEMENTS,
  CONTACT_REACH_ELEMENTS,
} from "@/components/contact/contact.elements";
import type { SectionDescriptor } from "@/types/static-page-descriptor";

export const CONTACT_SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "contact.breadcrumb",
    displayName: "Breadcrumb",
    type: "content",
    legacyIds: ["contact-breadcrumb"],
    editableProps: [],
    supports: { drag: false, duplicatable: false },
  },
  {
    id: "contact.hero",
    displayName: "Hero",
    type: "hero",
    defaultVariant: "minimal",
    legacyIds: ["contact-hero"],
    editableProps: [],
    elements: CONTACT_HERO_ELEMENTS,
    supports: { drag: true, animation: true, responsive: true },
  },
  {
    id: "contact.reach",
    displayName: "Reach / departments",
    type: "content",
    legacyIds: ["contact-content", "contact-reach"],
    editableProps: [],
    elements: CONTACT_REACH_ELEMENTS,
    supports: { drag: true, animation: true },
  },
  {
    id: "contact.map",
    displayName: "Map & address",
    type: "location",
    legacyIds: ["contact-location", "contact-map"],
    editableProps: [],
    supports: { drag: true, animation: true },
  },
];

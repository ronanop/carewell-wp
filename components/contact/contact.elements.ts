/**
 * Contact page element descriptors (ADR-016).
 */

import type { ElementDescriptor } from "@/types/element-descriptor";

export const CONTACT_HERO_ELEMENTS: ElementDescriptor[] = [
  {
    id: "contact.hero.label",
    displayName: "Label",
    kind: "label",
    sectionId: "contact.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Label", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true, bind: true, responsive: true },
    defaultValues: { text: "Get in Touch" },
  },
  {
    id: "contact.hero.heading",
    displayName: "Heading",
    kind: "heading",
    sectionId: "contact.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Heading", type: "textarea", group: "Content" },
    ],
    supports: {
      inlineEdit: true,
      bind: true,
      responsive: true,
      animation: true,
    },
    defaultValues: { text: "Contact Us" },
    bindingSources: ["wordpress.page.title"],
  },
  {
    id: "contact.hero.body.0",
    displayName: "Supporting line",
    kind: "paragraph",
    sectionId: "contact.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Text", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true, responsive: true },
    defaultValues: { text: "Get in Touch with Us" },
  },
  {
    id: "contact.hero.body.1",
    displayName: "Body",
    kind: "paragraph",
    sectionId: "contact.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Body", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true, responsive: true },
    defaultValues: {
      text: "Have a question or need assistance? The Care Well Medical Centre contact team is here to help! Whether you're looking for expert aesthetic treatments or general inquiries, feel free to reach out to us.",
    },
  },
];

export const CONTACT_REACH_ELEMENTS: ElementDescriptor[] = [
  {
    id: "contact.reach.heading",
    displayName: "Reach heading",
    kind: "heading",
    sectionId: "contact.reach",
    inlineField: "text",
    fields: [
      { key: "text", label: "Heading", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text: "Reach Us" },
  },
  {
    id: "contact.reach.body",
    displayName: "Reach intro",
    kind: "paragraph",
    sectionId: "contact.reach",
    inlineField: "text",
    fields: [
      { key: "text", label: "Intro", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "If you have any general or medical inquiries, feel free to contact us. Our doctors will respond as soon as possible.",
    },
  },
];

export const CONTACT_ELEMENTS: ElementDescriptor[] = [
  ...CONTACT_HERO_ELEMENTS,
  ...CONTACT_REACH_ELEMENTS,
];

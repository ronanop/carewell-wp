/**
 * Home CTA element descriptors (ADR-016).
 */

import type { ElementDescriptor } from "@/types/element-descriptor";

export const HOME_CTA_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.cta.heading",
    displayName: "CTA heading",
    kind: "heading",
    sectionId: "home.cta",
    inlineField: "text",
    fields: [
      { key: "text", label: "Heading", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text: "Ready to begin your journey?" },
  },
  {
    id: "home.cta.subtitle",
    displayName: "CTA subtitle",
    kind: "paragraph",
    sectionId: "home.cta",
    inlineField: "text",
    fields: [
      { key: "text", label: "Subtitle", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Book a consultation with our specialists. We will take time to understand your goals and recommend a personalised plan of care.",
    },
  },
  {
    id: "home.cta.button",
    displayName: "CTA button",
    kind: "button",
    sectionId: "home.cta",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { label: "Book a consultation", href: "/contact" },
  },
];

/**
 * Home CTA element descriptors (ADR-016).
 */

import type { ElementDescriptor } from "@/types/element-descriptor";

export const HOME_CTA_VALUE_DEFAULTS = [
  { title: "Safe & Trusted", subtitle: "Doctor-Led Care" },
  { title: "Personalized", subtitle: "Treatment Plans" },
  { title: "22+ Years", subtitle: "of Experience" },
  { title: "Compassionate", subtitle: "Patient Care" },
] as const;

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
    defaultValues: { text: "Ready to Begin Your Transformation?" },
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
      text: "Book a free consultation with Dr. Bhasin. No obligations.",
    },
  },
  {
    id: "home.cta.button",
    displayName: "Book consultation button",
    kind: "button",
    sectionId: "home.cta",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { label: "Book Free Consultation", href: "/contact" },
  },
  {
    id: "home.cta.callButton",
    displayName: "Call button",
    kind: "button",
    sectionId: "home.cta",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      label: "Call Now",
      href: "tel:+919667977499",
    },
  },
  {
    id: "home.cta.whatsapp",
    displayName: "WhatsApp link",
    kind: "link",
    sectionId: "home.cta",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      label: "WhatsApp",
      href: "https://wa.me/919667977499",
    },
  },
  ...HOME_CTA_VALUE_DEFAULTS.flatMap((item, index) => [
    {
      id: `home.cta.value.${index}.title`,
      displayName: `Value ${index + 1} title`,
      kind: "label" as const,
      sectionId: "home.cta",
      inlineField: "text",
      fields: [
        { key: "text", label: "Title", type: "text" as const, group: "Content" as const },
      ],
      supports: { inlineEdit: true },
      defaultValues: { text: item.title },
    },
    {
      id: `home.cta.value.${index}.subtitle`,
      displayName: `Value ${index + 1} subtitle`,
      kind: "caption" as const,
      sectionId: "home.cta",
      inlineField: "text",
      fields: [
        {
          key: "text",
          label: "Subtitle",
          type: "text" as const,
          group: "Content" as const,
        },
      ],
      supports: { inlineEdit: true },
      defaultValues: { text: item.subtitle },
    },
  ]),
];

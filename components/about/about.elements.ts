/**
 * About page element descriptors (ADR-016).
 */

import type { ElementDescriptor } from "@/types/element-descriptor";

export const ABOUT_HERO_ELEMENTS: ElementDescriptor[] = [
  {
    id: "about.hero.label",
    displayName: "Brand name",
    kind: "label",
    sectionId: "about.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Brand name", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true, bind: true, responsive: true },
    defaultValues: { text: "Care Well Medical Centre" },
  },
  {
    id: "about.hero.heading",
    displayName: "Heading",
    kind: "heading",
    sectionId: "about.hero",
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
    defaultValues: {
      text: "Beauty, restored with clinical care.",
    },
    bindingSources: ["wordpress.page.title"],
  },
  {
    id: "about.hero.body.0",
    displayName: "Supporting line",
    kind: "paragraph",
    sectionId: "about.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Text", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true, responsive: true },
    defaultValues: {
      text: "For over twenty years in South Delhi, we have specialized in hair restoration, cosmetic surgery, and anti-aging — natural results, patient-first ethics.",
    },
  },
  {
    id: "about.hero.body.1",
    displayName: "Secondary body (hidden)",
    kind: "paragraph",
    sectionId: "about.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Body", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true, responsive: true },
    defaultValues: { text: "" },
  },
  {
    id: "about.hero.image",
    displayName: "Hero background",
    kind: "image",
    sectionId: "about.hero",
    fields: [
      { key: "src", label: "Image URL", type: "image", group: "Content" },
      { key: "alt", label: "Alt text", type: "text", group: "Accessibility" },
    ],
    supports: { replaceMedia: true, crop: true, responsive: true },
    defaultValues: {
      src: "/images/service-hero-background.jpg",
      alt: "Care Well Medical Centre — premium aesthetic care in South Delhi",
    },
  },
  {
    id: "about.hero.primaryButton",
    displayName: "Primary CTA",
    kind: "button",
    sectionId: "about.hero",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { label: "Book consultation", href: "/contact" },
  },
  {
    id: "about.hero.secondaryButton",
    displayName: "Secondary CTA",
    kind: "button",
    sectionId: "about.hero",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      label: "Meet Dr. Bhasin",
      href: "/about/dr-sandeep-bhasin",
    },
  },
];

export const ABOUT_CTA_ELEMENTS: ElementDescriptor[] = [
  {
    id: "about.cta.heading",
    displayName: "CTA heading",
    kind: "heading",
    sectionId: "about.cta",
    inlineField: "text",
    fields: [
      { key: "text", label: "Heading", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text: "Begin your transformation" },
  },
  {
    id: "about.cta.button",
    displayName: "Book button",
    kind: "button",
    sectionId: "about.cta",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { label: "Book consultation", href: "/contact" },
  },
];

export const ABOUT_ELEMENTS: ElementDescriptor[] = [
  ...ABOUT_HERO_ELEMENTS,
  ...ABOUT_CTA_ELEMENTS,
];

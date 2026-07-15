/**
 * About page element descriptors (ADR-016).
 */

import type { ElementDescriptor } from "@/types/element-descriptor";

export const ABOUT_HERO_ELEMENTS: ElementDescriptor[] = [
  {
    id: "about.hero.label",
    displayName: "Label",
    kind: "label",
    sectionId: "about.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Label", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true, bind: true, responsive: true },
    defaultValues: { text: "Care Well Medical Centre Clinic" },
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
      text: "About Care Well Medical Centre – Our Vision, Team & Commitment",
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
      text: "Your Trusted Destination for Advanced Cosmetic & Aesthetic Treatments",
    },
  },
  {
    id: "about.hero.body.1",
    displayName: "Body",
    kind: "paragraph",
    sectionId: "about.hero",
    inlineField: "text",
    fields: [
      { key: "text", label: "Body", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true, responsive: true },
    defaultValues: {
      text: "Care Well Medical Centre is a trusted hair transplant and aesthetic clinic in South Delhi, led by Dr. Sandeep Bhasin. For over 20 years, we have specialized in advanced hair restoration, cosmetic surgery, and anti-aging treatments, delivering natural results with a patient-first approach.",
    },
  },
  {
    id: "about.hero.image",
    displayName: "Hero image",
    kind: "image",
    sectionId: "about.hero",
    fields: [
      { key: "src", label: "Image URL", type: "image", group: "Content" },
      { key: "alt", label: "Alt text", type: "text", group: "Accessibility" },
    ],
    supports: { replaceMedia: true, crop: true, responsive: true },
    defaultValues: {
      src: "/images/about-consultation.jpg",
      alt: "Consultation at Care Well Medical Centre",
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
    defaultValues: { text: "Visit Us & Begin Your Transformation" },
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
    defaultValues: { label: "Book Consultation", href: "/contact" },
  },
];

export const ABOUT_ELEMENTS: ElementDescriptor[] = [
  ...ABOUT_HERO_ELEMENTS,
  ...ABOUT_CTA_ELEMENTS,
];

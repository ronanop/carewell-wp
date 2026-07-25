/**
 * Home Google reviews highlights — element descriptors (ADR-016).
 */

import type { ElementDescriptor } from "@/types/element-descriptor";
import type { RepeaterDescriptor } from "@/types/repeater-descriptor";

export const HOME_GOOGLE_REVIEWS_DEFAULTS = [
  {
    name: "Priya S.",
    initial: "P",
    rating: "5",
    text: "Excellent care and clear explanations. Dr. Bhasin took time to understand my concerns and set realistic expectations.",
  },
  {
    name: "Amit K.",
    initial: "A",
    rating: "5",
    text: "Professional clinic in South Delhi. The consultation felt thorough and honest — no pressure, just good medical advice.",
  },
  {
    name: "Neha R.",
    initial: "N",
    rating: "5",
    text: "Very good experience overall. Staff were caring and the results look natural. Happy I chose Care Well.",
  },
  {
    name: "Rahul M.",
    initial: "R",
    rating: "4",
    text: "Clean facility and doctor-led planning. Communication was clear from consultation through follow-up.",
  },
] as const;

export const HOME_GOOGLE_REVIEWS_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.reviews.label",
    displayName: "Overline",
    kind: "label",
    sectionId: "home.reviews",
    inlineField: "text",
    fields: [{ key: "text", label: "Overline", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Consulting" },
  },
  {
    id: "home.reviews.heading",
    displayName: "Heading",
    kind: "heading",
    sectionId: "home.reviews",
    inlineField: "text",
    fields: [
      { key: "text", label: "Heading", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text: "What Our Patients Say" },
  },
  {
    id: "home.reviews.description",
    displayName: "Description",
    kind: "paragraph",
    sectionId: "home.reviews",
    inlineField: "text",
    fields: [
      { key: "text", label: "Description", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Verified patient feedback from Google—focused on care quality, clear communication, and natural results at our South Delhi clinic.",
    },
  },
  {
    id: "home.reviews.rating",
    displayName: "Aggregate rating",
    kind: "statistic",
    sectionId: "home.reviews",
    fields: [
      { key: "value", label: "Rating", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { value: "4.3" },
  },
  {
    id: "home.reviews.ratingLabel",
    displayName: "Rating label",
    kind: "label",
    sectionId: "home.reviews",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "VERY GOOD" },
  },
  {
    id: "home.reviews.count",
    displayName: "Review count line",
    kind: "paragraph",
    sectionId: "home.reviews",
    inlineField: "text",
    fields: [
      { key: "text", label: "Count line", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text: "Based on 605+ verified Google reviews" },
  },
  {
    id: "home.reviews.clinicBadge",
    displayName: "Clinic badge",
    kind: "badge",
    sectionId: "home.reviews",
    inlineField: "text",
    fields: [{ key: "text", label: "Badge", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Care Well Medical Centre, Delhi" },
  },
  {
    id: "home.reviews.cta",
    displayName: "See all reviews CTA",
    kind: "button",
    sectionId: "home.reviews",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      label: "See all reviews on Google",
      href: "https://www.google.com/maps/search/?api=1&query=Care+Well+Medical+Centre+Chittaranjan+Park+New+Delhi",
    },
  },
  {
    id: "home.reviews.disclaimer",
    displayName: "Disclaimer",
    kind: "caption",
    sectionId: "home.reviews",
    inlineField: "text",
    fields: [
      { key: "text", label: "Disclaimer", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Reviews shown as posted on Google • Updated periodically",
    },
  },
];

export const homeGoogleReviewsRepeater: RepeaterDescriptor = {
  id: "home.reviews",
  displayName: "Google review highlights",
  sectionId: "home.reviews",
  itemFields: [
    { key: "name", label: "Name", type: "text", group: "Content" },
    { key: "initial", label: "Initial", type: "text", group: "Content" },
    { key: "rating", label: "Stars (1–5)", type: "text", group: "Content" },
    { key: "text", label: "Review text", type: "textarea", group: "Content" },
  ],
  defaultItems: HOME_GOOGLE_REVIEWS_DEFAULTS.map((item) => ({ ...item })),
  minItems: 2,
  maxItems: 8,
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

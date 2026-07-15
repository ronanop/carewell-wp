/**
 * Homepage section defaults + element/repeater descriptors (ADR-017).
 */

import type { ElementDescriptor } from "@/types/element-descriptor";
import type { RepeaterDescriptor } from "@/types/repeater-descriptor";

function itemFields(
  sectionId: string,
  repeaterId: string,
  count: number,
  fields: Array<{ key: string; label: string; type?: "text" | "textarea" | "image" | "link" }>,
): ElementDescriptor[] {
  const out: ElementDescriptor[] = [];
  for (let index = 0; index < count; index += 1) {
    for (const field of fields) {
      out.push({
        id: `${repeaterId}.item.${index}.${field.key}`,
        displayName: `${field.label} #${index + 1}`,
        kind:
          field.type === "image"
            ? "image"
            : field.key === "href"
              ? "link"
              : "list-item",
        sectionId,
        inlineField: field.type === "image" ? "src" : field.key,
        fields: [
          {
            key: field.key,
            label: field.label,
            type: field.type ?? "text",
            group: "Content",
          },
        ],
        supports: {
          inlineEdit: field.type !== "image",
          replaceMedia: field.type === "image",
          bind: true,
          duplicate: true,
          delete: true,
          reorder: true,
        },
      });
    }
  }
  return out;
}

export const HOME_SERVICES_DEFAULTS = [
  {
    title: "Cosmetic Treatments",
    description:
      "Non-surgical anti-aging treatments including Botox, fillers, and laser rejuvenation at our South Delhi clinic.",
    href: "/services/skin-aesthetic",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Cosmetic and aesthetic skin treatment",
    objectPosition: "center top",
  },
  {
    title: "Plastic Surgery",
    description:
      "Advanced cosmetic surgical procedures including rhinoplasty and body contouring performed safely at our South Delhi clinic.",
    href: "/services/surgical-procedures",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Plastic and cosmetic surgery consultation",
    objectPosition: "center 30%",
  },
  {
    title: "Hair Transplant",
    description:
      "Permanent hair restoration using advanced FUE and FUT techniques, performed by a senior cosmetic surgeon in Delhi.",
    href: "/services/hair-treatments",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Hair transplant and restoration treatment",
    objectPosition: "center 70%",
  },
  {
    title: "Skin Treatments",
    description:
      "Doctor-led care for acne scars, pigmentation, dark circles, and skin rejuvenation tailored to your skin type.",
    href: "/services/skin-aesthetic/acne-scar",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Clinical skin treatment and rejuvenation",
    objectPosition: "center 40%",
  },
  {
    title: "Laser Hair Removal",
    description:
      "Safe, effective laser hair reduction for face and body with protocols designed for Indian skin tones.",
    href: "/services/skin-aesthetic/laser-hair-removal",
    imageSrc: "/images/hero-background.png",
    imageAlt: "Laser hair removal treatment",
    objectPosition: "center center",
  },
  {
    title: "Body Contouring",
    description:
      "Non-surgical fat reduction and body sculpting options to refine your silhouette with minimal downtime.",
    href: "/services/skin-aesthetic/cryolipolysis",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Body contouring and sculpting treatment",
    objectPosition: "left center",
  },
  {
    title: "Anti-Aging",
    description:
      "Personalised anti-aging plans combining injectables, skin boosters, and regenerative therapies for natural results.",
    href: "/services/skin-aesthetic/anti-aging-treatments",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Anti-aging aesthetic treatment",
    objectPosition: "center 20%",
  },
  {
    title: "Beard Transplant",
    description:
      "Natural-looking beard restoration with precise graft placement for fuller facial hair density.",
    href: "/services/hair-treatments/beard-transplant",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Beard transplant and facial hair restoration",
    objectPosition: "right 45%",
  },
] as const;

export const homeServicesRepeater: RepeaterDescriptor = {
  id: "home.services",
  displayName: "Services",
  sectionId: "home.services",
  itemFields: [
    { key: "title", label: "Title", type: "text", group: "Content" },
    { key: "description", label: "Description", type: "textarea", group: "Content" },
    { key: "href", label: "Link", type: "link", group: "Content" },
    { key: "imageSrc", label: "Image", type: "image", group: "Content" },
    { key: "imageAlt", label: "Alt text", type: "text", group: "Accessibility" },
  ],
  defaultItems: HOME_SERVICES_DEFAULTS.map((item) => ({ ...item })),
  bindingSources: ["wordpress.cpt.service"],
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

export const HOME_SERVICES_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.services.label",
    displayName: "Services label",
    kind: "label",
    sectionId: "home.services",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Our services" },
  },
  {
    id: "home.services.heading",
    displayName: "Services heading",
    kind: "heading",
    sectionId: "home.services",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true, bind: true },
    defaultValues: {
      text: "Comprehensive Hair Transplant, Skin & Cosmetic Surgery Services",
    },
    bindingSources: ["wordpress.page.title"],
  },
  {
    id: "home.services.description",
    displayName: "Services description",
    kind: "paragraph",
    sectionId: "home.services",
    inlineField: "text",
    fields: [{ key: "text", label: "Description", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "At Care Well Medical Centre, we provide doctor-led treatments across hair, skin, cosmetic, and surgical care, focused on safety, natural results, and personalised treatment planning.",
    },
  },
  ...itemFields("home.services", "home.services", HOME_SERVICES_DEFAULTS.length, [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "href", label: "Link", type: "link" },
    { key: "imageSrc", label: "Image", type: "image" },
    { key: "imageAlt", label: "Alt" },
  ]),
];

export const HOME_BLOG_DEFAULTS = [
  {
    title: "What to expect at your first dermatology consultation",
    excerpt:
      "A calm, structured visit designed to understand your concerns and outline evidence-based options.",
    category: "Patient guide",
    href: "/blogs/first-dermatology-consultation",
  },
  {
    title: "Understanding laser skin resurfacing",
    excerpt:
      "How the treatment works, who it suits, and what recovery typically involves.",
    category: "Treatments",
    href: "/blogs/laser-skin-resurfacing",
  },
  {
    title: "Building a skincare routine that works",
    excerpt:
      "Practical guidance from our specialists on daily care backed by clinical insight.",
    category: "Wellness",
    href: "/blogs/skincare-routine-guide",
  },
] as const;

export const homeBlogRepeater: RepeaterDescriptor = {
  id: "home.blog",
  displayName: "Blog posts",
  sectionId: "home.blog",
  itemFields: [
    { key: "title", label: "Title", type: "text", group: "Content" },
    { key: "excerpt", label: "Excerpt", type: "textarea", group: "Content" },
    { key: "category", label: "Category", type: "text", group: "Content" },
    { key: "href", label: "Link", type: "link", group: "Content" },
  ],
  defaultItems: HOME_BLOG_DEFAULTS.map((item) => ({ ...item })),
  bindingSources: ["wordpress.latestPosts"],
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

export const HOME_BLOG_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.blog.overline",
    displayName: "Blog overline",
    kind: "label",
    sectionId: "home.blog",
    inlineField: "text",
    fields: [{ key: "text", label: "Overline", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "From our blog" },
  },
  {
    id: "home.blog.heading",
    displayName: "Blog heading",
    kind: "heading",
    sectionId: "home.blog",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "text", group: "Content" }],
    supports: { inlineEdit: true, bind: true },
    defaultValues: { text: "Latest insights" },
    bindingSources: ["wordpress.latestPosts"],
  },
  {
    id: "home.blog.description",
    displayName: "Blog description",
    kind: "paragraph",
    sectionId: "home.blog",
    inlineField: "text",
    fields: [{ key: "text", label: "Description", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Educational articles written to help you make informed decisions about your care.",
    },
  },
  ...itemFields("home.blog", "home.blog", HOME_BLOG_DEFAULTS.length, [
    { key: "title", label: "Title" },
    { key: "excerpt", label: "Excerpt", type: "textarea" },
    { key: "category", label: "Category" },
    { key: "href", label: "Link", type: "link" },
  ]),
];

export const HOME_JOURNEY_DEFAULTS = [
  {
    title: "Step 1: Doctor Consultation",
    description:
      "Personal evaluation to understand your concern and goals. No sales team. Direct doctor interaction.",
  },
  {
    title: "Step 2: Medical Assessment",
    description:
      "Detailed scalp, skin, or body analysis using medical protocols and experience.",
  },
  {
    title: "Step 3: Personalised Treatment Plan",
    description:
      "Only treatments you medically need. Clear explanation of procedure, recovery, and cost.",
  },
  {
    title: "Step 4: Safe Procedure & Follow-up",
    description:
      "Advanced technology, strict hygiene, and proper post-treatment care.",
  },
] as const;

export const homeJourneyRepeater: RepeaterDescriptor = {
  id: "home.journey",
  displayName: "Journey steps",
  sectionId: "home.journey",
  itemFields: [
    { key: "title", label: "Title", type: "text", group: "Content" },
    { key: "description", label: "Description", type: "textarea", group: "Content" },
  ],
  defaultItems: HOME_JOURNEY_DEFAULTS.map((item) => ({ ...item })),
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

export const HOME_JOURNEY_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.journey.label",
    displayName: "Journey label",
    kind: "label",
    sectionId: "home.journey",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Fast, Safe & Doctor-Led Solutions" },
  },
  {
    id: "home.journey.heading",
    displayName: "Journey heading",
    kind: "heading",
    sectionId: "home.journey",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Your Treatment Journey at Care Well Medical Centre",
    },
  },
  {
    id: "home.journey.description",
    displayName: "Journey description",
    kind: "paragraph",
    sectionId: "home.journey",
    inlineField: "text",
    fields: [{ key: "text", label: "Description", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "A clear, doctor-led process focused on safety, results, and personalised care.",
    },
  },
  ...itemFields("home.journey", "home.journey", HOME_JOURNEY_DEFAULTS.length, [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", type: "textarea" },
  ]),
];

export const HOME_WHY_DEFAULTS = [
  {
    title: "Expert Care",
    description:
      "All major treatments personally supervised by Dr. Sandeep Bhasin, senior cosmetic surgeon in Delhi.",
  },
  {
    title: "Patient-Focused Approach",
    description:
      "Seamless care with customized treatment plans and dedicated support at every step.",
  },
  {
    title: "Latest Technology",
    description:
      "Advanced FUE systems, medical-grade lasers, and modern surgical infrastructure in South Delhi.",
  },
  {
    title: "Efficient & Professional",
    description:
      "Smooth appointment scheduling, timely follow-ups, and a stress-free experience.",
  },
] as const;

export const homeWhyRepeater: RepeaterDescriptor = {
  id: "home.why",
  displayName: "Why choose cards",
  sectionId: "home.why",
  itemFields: [
    { key: "title", label: "Title", type: "text", group: "Content" },
    { key: "description", label: "Description", type: "textarea", group: "Content" },
  ],
  defaultItems: HOME_WHY_DEFAULTS.map((item) => ({ ...item })),
  bindingSources: ["wordpress.cpt.faq"],
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

export const HOME_WHY_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.why.label",
    displayName: "Why label",
    kind: "label",
    sectionId: "home.why",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "We Stand Out" },
  },
  {
    id: "home.why.heading",
    displayName: "Why heading",
    kind: "heading",
    sectionId: "home.why",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Why Choose Care Well Medical Centre?" },
  },
  {
    id: "home.why.footerHeading",
    displayName: "Why footer heading",
    kind: "heading",
    sectionId: "home.why",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Serving South Delhi & Delhi NCR with Doctor-Led Cosmetic Care",
    },
  },
  {
    id: "home.why.footerBody",
    displayName: "Why footer body",
    kind: "paragraph",
    sectionId: "home.why",
    inlineField: "text",
    fields: [{ key: "text", label: "Body", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Care Well Medical Centre is located at House No. 1, NRI Complex, Chittaranjan Park (CR Park), New Delhi 110019, and serves patients from Greater Kailash, Kalkaji, Nehru Place, Alaknanda, Saket, and across Delhi NCR. Under the supervision of Dr. Sandeep Bhasin, senior cosmetic and hair transplant surgeon, we provide advanced cosmetic surgery, hair restoration, and skin treatments in a safe medical setting.",
    },
  },
  {
    id: "home.why.doctorImage",
    displayName: "Why doctor image",
    kind: "image",
    sectionId: "home.why",
    fields: [
      { key: "src", label: "Image", type: "image", group: "Content" },
      { key: "alt", label: "Alt", type: "text", group: "Accessibility" },
    ],
    supports: { replaceMedia: true },
    defaultValues: {
      src: "/images/dr-sandeep-bhasin.jpg",
      alt: "Dr. Sandeep Bhasin",
    },
  },
  ...itemFields("home.why", "home.why", HOME_WHY_DEFAULTS.length, [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", type: "textarea" },
  ]),
];

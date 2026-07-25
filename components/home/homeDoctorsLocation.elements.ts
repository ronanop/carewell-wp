/**
 * Doctors / location / AI / about / specialties element descriptors.
 */

import type { ElementDescriptor } from "@/types/element-descriptor";
import type { RepeaterDescriptor } from "@/types/repeater-descriptor";

export const HOME_DOCTOR_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.doctors.photo",
    displayName: "Doctor photo",
    kind: "image",
    sectionId: "home.doctors",
    fields: [
      { key: "src", label: "Photo", type: "image", group: "Content" },
      { key: "alt", label: "Alt text", type: "text", group: "Accessibility" },
    ],
    supports: { replaceMedia: true, bind: true },
    defaultValues: {
      src: "/images/dr-sandeep-bhasin-cutout.png",
      alt: "Dr. Sandeep Bhasin",
    },
    bindingSources: ["wordpress.cpt.doctor"],
  },
  {
    id: "home.doctors.label",
    displayName: "Eyebrow",
    kind: "label",
    sectionId: "home.doctors",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Meet Your Surgeon" },
  },
  {
    id: "home.doctors.heading",
    displayName: "Heading",
    kind: "heading",
    sectionId: "home.doctors",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "text", group: "Content" }],
    supports: { inlineEdit: true, bind: true },
    defaultValues: { text: "Meet Your Cosmetic Surgeon" },
    bindingSources: ["wordpress.cpt.doctor"],
  },
  {
    id: "home.doctors.name",
    displayName: "Doctor name",
    kind: "heading",
    sectionId: "home.doctors",
    inlineField: "text",
    fields: [{ key: "text", label: "Name", type: "text", group: "Content" }],
    supports: { inlineEdit: true, bind: true },
    defaultValues: { text: "Dr. Sandeep Bhasin" },
    bindingSources: ["wordpress.cpt.doctor"],
  },
  {
    id: "home.doctors.description",
    displayName: "Description",
    kind: "paragraph",
    sectionId: "home.doctors",
    inlineField: "text",
    fields: [{ key: "text", label: "Description", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Senior cosmetic and hair transplant surgeon with 22+ years of clinical experience, and founder of Care Well Medical Centre. Every consultation is doctor-led — focused on safety, honest guidance, and natural-looking results you can trust.",
    },
  },
  {
    id: "home.doctors.note",
    displayName: "Trust statement",
    kind: "paragraph",
    sectionId: "home.doctors",
    inlineField: "text",
    fields: [
      { key: "text", label: "Trust statement", type: "textarea", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Performed 10,000+ cosmetic and hair procedures for patients across South Delhi and Delhi NCR.",
    },
  },
  {
    id: "home.doctors.primaryButton",
    displayName: "Primary CTA",
    kind: "button",
    sectionId: "home.doctors",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: {
      label: "View Full Doctor Profile",
      href: "/about/dr-sandeep-bhasin",
    },
  },
  {
    id: "home.doctors.secondaryButton",
    displayName: "Secondary CTA",
    kind: "button",
    sectionId: "home.doctors",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { label: "Book Consultation", href: "/contact" },
  },
];

export const HOME_DOCTOR_STAT_DEFAULTS = [
  { value: "22+", label: "Years of Clinical Experience" },
  { value: "10,000+", label: "Procedures Performed" },
  { value: "1", label: "Senior Doctor Supervision" },
] as const;

export const HOME_DOCTOR_HIGHLIGHT_DEFAULTS = [
  "Founder & Lead Surgeon",
  "Doctor-Performed Procedures",
  "Expertise Across Hair & Skin",
  "Trusted Across Delhi NCR",
  "Recognized Medical Associations",
  "Evidence-Based Protocols",
] as const;

export const homeDoctorStatsRepeater: RepeaterDescriptor = {
  id: "home.doctors.stats",
  displayName: "Doctor stats",
  sectionId: "home.doctors",
  itemFields: [
    { key: "value", label: "Value", type: "text", group: "Content" },
    { key: "label", label: "Label", type: "text", group: "Content" },
  ],
  defaultItems: HOME_DOCTOR_STAT_DEFAULTS.map((item) => ({ ...item })),
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

export const homeDoctorHighlightsRepeater: RepeaterDescriptor = {
  id: "home.doctors.highlights",
  displayName: "Doctor highlights",
  sectionId: "home.doctors",
  itemFields: [{ key: "text", label: "Text", type: "text", group: "Content" }],
  defaultItems: HOME_DOCTOR_HIGHLIGHT_DEFAULTS.map((text) => ({ text })),
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

for (let i = 0; i < HOME_DOCTOR_STAT_DEFAULTS.length; i += 1) {
  HOME_DOCTOR_ELEMENTS.push(
    {
      id: `home.doctors.stats.item.${i}.value`,
      displayName: `Stat ${i + 1} value`,
      kind: "statistic",
      sectionId: "home.doctors",
      inlineField: "value",
      fields: [{ key: "value", label: "Value", type: "text", group: "Content" }],
      supports: { inlineEdit: true, duplicate: true, delete: true },
      defaultValues: { value: HOME_DOCTOR_STAT_DEFAULTS[i].value },
    },
    {
      id: `home.doctors.stats.item.${i}.label`,
      displayName: `Stat ${i + 1} label`,
      kind: "label",
      sectionId: "home.doctors",
      inlineField: "label",
      fields: [{ key: "label", label: "Label", type: "text", group: "Content" }],
      supports: { inlineEdit: true },
      defaultValues: { label: HOME_DOCTOR_STAT_DEFAULTS[i].label },
    },
  );
}

for (let i = 0; i < HOME_DOCTOR_HIGHLIGHT_DEFAULTS.length; i += 1) {
  HOME_DOCTOR_ELEMENTS.push({
    id: `home.doctors.highlights.item.${i}.text`,
    displayName: `Highlight ${i + 1}`,
    kind: "list-item",
    sectionId: "home.doctors",
    inlineField: "text",
    fields: [{ key: "text", label: "Text", type: "text", group: "Content" }],
    supports: { inlineEdit: true, duplicate: true, delete: true },
    defaultValues: { text: HOME_DOCTOR_HIGHLIGHT_DEFAULTS[i] },
  });
}

export const HOME_LOCATION_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.location.heading",
    displayName: "Location heading",
    kind: "heading",
    sectionId: "home.location",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Conveniently Located in South Delhi" },
  },
  {
    id: "home.location.address",
    displayName: "Address / hours",
    kind: "paragraph",
    sectionId: "home.location",
    inlineField: "text",
    fields: [{ key: "text", label: "Address", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Chittaranjan Park, near market area. Mon–Sun 10:00 AM to 7:00 PM.",
    },
  },
  {
    id: "home.location.map",
    displayName: "Map",
    kind: "map",
    sectionId: "home.location",
    fields: [
      { key: "query", label: "Map query", type: "text", group: "Content" },
      { key: "zoom", label: "Zoom", type: "number", group: "Layout", min: 1, max: 20 },
      { key: "height", label: "Height px", type: "number", group: "Layout" },
    ],
    supports: { bind: true },
    defaultValues: {
      query: "Chittaranjan Park, New Delhi, Delhi",
      zoom: 15,
      height: 320,
    },
  },
  {
    id: "home.location.form.heading",
    displayName: "Form heading (implicit)",
    kind: "label",
    sectionId: "home.location",
    inlineField: "text",
    fields: [{ key: "text", label: "Name label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Name" },
  },
  {
    id: "home.location.form.nameLabel",
    displayName: "Name label",
    kind: "form-field",
    sectionId: "home.location",
    inlineField: "text",
    fields: [
      { key: "text", label: "Label", type: "text", group: "Content" },
      { key: "placeholder", label: "Placeholder", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text: "Name", placeholder: "Your full name" },
  },
  {
    id: "home.location.form.mobileLabel",
    displayName: "Mobile label",
    kind: "form-field",
    sectionId: "home.location",
    inlineField: "text",
    fields: [
      { key: "text", label: "Label", type: "text", group: "Content" },
      { key: "placeholder", label: "Placeholder", type: "text", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text: "Mobile", placeholder: "10-digit mobile number" },
  },
  {
    id: "home.location.form.treatmentLabel",
    displayName: "Treatment label",
    kind: "form-field",
    sectionId: "home.location",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Treatment interest" },
  },
  {
    id: "home.location.form.button",
    displayName: "Submit button",
    kind: "button",
    sectionId: "home.location",
    inlineField: "label",
    fields: [{ key: "label", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { label: "Claim My Free Slot" },
  },
  {
    id: "home.location.form.success",
    displayName: "Success message",
    kind: "paragraph",
    sectionId: "home.location",
    inlineField: "text",
    fields: [{ key: "text", label: "Message", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Thank you — we'll be in touch shortly." },
  },
  {
    id: "home.location.form.privacy",
    displayName: "Privacy note",
    kind: "caption",
    sectionId: "home.location",
    inlineField: "text",
    fields: [{ key: "text", label: "Note", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "100% Private | Response within 2 hours | No spam",
    },
  },
];

export const HOME_AI_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.ai-skin.label",
    displayName: "AI label",
    kind: "label",
    sectionId: "home.ai-skin",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "AI Skin Analysis" },
  },
  {
    id: "home.ai-skin.heading",
    displayName: "AI heading",
    kind: "heading",
    sectionId: "home.ai-skin",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Analyze My Skin" },
  },
  {
    id: "home.ai-skin.description",
    displayName: "AI description",
    kind: "paragraph",
    sectionId: "home.ai-skin",
    inlineField: "text",
    fields: [{ key: "text", label: "Description", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "AI-powered analysis to identify your skin concerns and recommend the right treatment —guided by our clinical team in Delhi.",
    },
  },
  {
    id: "home.ai-skin.button",
    displayName: "AI CTA",
    kind: "button",
    sectionId: "home.ai-skin",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { label: "Scan My Skin →", href: "/contact" },
  },
];

/** 2×3 feature grid — left column (rows 1–3). */
export const HOME_ABOUT_FEATURE_LEFT_DEFAULTS = [
  "Advanced Skin & Anti-Aging",
  "Laser & Surgical Procedures",
  "Scar & Acne Treatment",
] as const;

/** 2×3 feature grid — right column (rows 1–3). */
export const HOME_ABOUT_FEATURE_RIGHT_DEFAULTS = [
  "Body Contouring & Fat Reduction",
  "Hair Restoration & Transplant",
  "Cosmetic Surgeries",
] as const;

export const HOME_ABOUT_VALUE_DEFAULTS = [
  {
    title: "Patient First Philosophy",
    description:
      "At Care Well Medical Centre: We believe aesthetic care is not about changing who you are, but enhancing natural features safely and responsibly.",
    href: "/about",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Patient-focused aesthetic care at Care Well Medical Centre",
  },
  {
    title: "Personalised Consultations",
    description:
      "Every treatment is planned with a personalised, doctor-led approach, combining advanced technology, medical expertise, and your goals.",
    href: "/about",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Personalised doctor-led consultation",
  },
  {
    title: "Advanced Technology",
    description:
      "Every treatment is planned with a personalised, doctor-led approach, combining advanced technology and medical-grade equipment.",
    href: "/about",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Advanced aesthetic treatment technology",
  },
  {
    title: "Ethical & Transparent Care",
    description:
      "Cosmetic care goes beyond appearance. It impacts self-confidence, wellness, and long-term satisfaction through honest guidance.",
    href: "/about",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Ethical doctor-led cosmetic care",
  },
] as const;

export const homeAboutValuesRepeater: RepeaterDescriptor = {
  id: "home.about.values",
  displayName: "About value cards",
  sectionId: "home.about",
  itemFields: [
    { key: "title", label: "Title", type: "text", group: "Content" },
    { key: "description", label: "Description", type: "textarea", group: "Content" },
    { key: "href", label: "Link", type: "link", group: "Content" },
    { key: "imageSrc", label: "Image", type: "image", group: "Content" },
    { key: "imageAlt", label: "Alt text", type: "text", group: "Accessibility" },
  ],
  defaultItems: HOME_ABOUT_VALUE_DEFAULTS.map((item) => ({ ...item })),
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
  minItems: 2,
  maxItems: 6,
};

export const HOME_ABOUT_HOME_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.about.label",
    displayName: "About label",
    kind: "label",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "ABOUT US" },
  },
  {
    id: "home.about.heading",
    displayName: "About heading",
    kind: "heading",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Redefining Aesthetic & Cosmetic Care." },
  },
  {
    id: "home.about.body.1",
    displayName: "About body",
    kind: "paragraph",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Body", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Care Well Medical Centre: We believe in enhancing your natural features safely, responsibly, and ethically.",
    },
  },
  {
    id: "home.about.featuresHeading",
    displayName: "Features heading",
    kind: "heading",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Our Special Features." },
  },
  {
    id: "home.about.button",
    displayName: "About CTA",
    kind: "button",
    sectionId: "home.about",
    inlineField: "label",
    fields: [
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
    ],
    supports: { inlineEdit: true },
    defaultValues: { label: "Discover Our Full Story", href: "/about" },
  },
  ...HOME_ABOUT_FEATURE_LEFT_DEFAULTS.map((text, index) => ({
    id: `home.about.feature.left.${index}`,
    displayName: `Feature L${index + 1}`,
    kind: "list-item" as const,
    sectionId: "home.about",
    inlineField: "text",
    fields: [
      { key: "text", label: "Text", type: "text" as const, group: "Content" as const },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text },
  })),
  ...HOME_ABOUT_FEATURE_RIGHT_DEFAULTS.map((text, index) => ({
    id: `home.about.feature.right.${index}`,
    displayName: `Feature R${index + 1}`,
    kind: "list-item" as const,
    sectionId: "home.about",
    inlineField: "text",
    fields: [
      { key: "text", label: "Text", type: "text" as const, group: "Content" as const },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text },
  })),
  ...HOME_ABOUT_VALUE_DEFAULTS.flatMap((item, index) => [
    {
      id: `home.about.values.item.${index}.title`,
      displayName: `Value title ${index + 1}`,
      kind: "heading" as const,
      sectionId: "home.about",
      inlineField: "text",
      fields: [
        { key: "text", label: "Title", type: "text" as const, group: "Content" as const },
      ],
      supports: { inlineEdit: true },
      defaultValues: { text: item.title },
    },
    {
      id: `home.about.values.item.${index}.description`,
      displayName: `Value body ${index + 1}`,
      kind: "paragraph" as const,
      sectionId: "home.about",
      inlineField: "text",
      fields: [
        {
          key: "text",
          label: "Description",
          type: "textarea" as const,
          group: "Content" as const,
        },
      ],
      supports: { inlineEdit: true },
      defaultValues: { text: item.description },
    },
    {
      id: `home.about.values.item.${index}.imageSrc`,
      displayName: `Value image ${index + 1}`,
      kind: "image" as const,
      sectionId: "home.about",
      fields: [
        { key: "src", label: "Image", type: "image" as const, group: "Content" as const },
        { key: "alt", label: "Alt", type: "text" as const, group: "Accessibility" as const },
      ],
      supports: { replaceMedia: true },
      defaultValues: { src: item.imageSrc, alt: item.imageAlt },
    },
  ]),
];

export const HOME_SPECIALTY_DEFAULTS = [
  { code: "HAI", name: "Hair Transplant" },
  { code: "LAS", name: "Laser Hair Removal" },
  { code: "ACN", name: "Acne & Scar Treatment" },
  { code: "CRY", name: "Cryolipolysis (Fat Freezing)" },
  { code: "ANT", name: "Anti-Aging Treatments" },
  { code: "BOT", name: "Botox" },
  { code: "RHI", name: "Rhinoplasty" },
  { code: "BEA", name: "Beard Transplant" },
  { code: "HYD", name: "Hydrafacial" },
  { code: "LIP", name: "Liposuction" },
  { code: "BRE", name: "Breast Augmentation" },
  { code: "HYM", name: "Hymenoplasty" },
] as const;

export const homeSpecialtiesRepeater: RepeaterDescriptor = {
  id: "home.specialties",
  displayName: "Specialties",
  sectionId: "home.specialties",
  itemFields: [
    { key: "code", label: "Code", type: "text", group: "Content" },
    { key: "name", label: "Name", type: "text", group: "Content" },
  ],
  defaultItems: HOME_SPECIALTY_DEFAULTS.map((item) => ({ ...item })),
  allowAdd: true,
  allowDelete: true,
  allowDuplicate: true,
  allowReorder: true,
};

export const HOME_SPECIALTY_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.specialties.label",
    displayName: "Specialties label",
    kind: "label",
    sectionId: "home.specialties",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Consultation & Expertise" },
  },
  {
    id: "home.specialties.heading",
    displayName: "Specialties heading",
    kind: "heading",
    sectionId: "home.specialties",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Our Aesthetic Consultation Specialties" },
  },
  {
    id: "home.specialties.description",
    displayName: "Specialties description",
    kind: "paragraph",
    sectionId: "home.specialties",
    inlineField: "text",
    fields: [{ key: "text", label: "Description", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "At Care Well Medical Centre, every treatment begins with a personalised, doctor-led consultation. We focus on understanding your concern first, then recommending the safest and most effective option.",
    },
  },
  ...HOME_SPECIALTY_DEFAULTS.flatMap((item, index) => [
    {
      id: `home.specialties.item.${index}.name`,
      displayName: `Specialty ${index + 1}`,
      kind: "list-item" as const,
      sectionId: "home.specialties",
      inlineField: "name",
      fields: [
        { key: "name", label: "Name", type: "text" as const, group: "Content" as const },
        { key: "code", label: "Code", type: "text" as const, group: "Content" as const },
      ],
      supports: { inlineEdit: true, duplicate: true, delete: true },
      defaultValues: { name: item.name, code: item.code },
    },
  ]),
];

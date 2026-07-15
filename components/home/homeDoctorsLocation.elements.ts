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
      src: "/images/dr-sandeep-bhasin.jpg",
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
      text: "Senior cosmetic and hair transplant surgeon with 18+ years of clinical experience, and founder of Care Well Medical Centre. Every consultation is doctor-led — focused on safety, honest guidance, and natural-looking results you can trust.",
    },
  },
  {
    id: "home.doctors.note",
    displayName: "Supporting note",
    kind: "paragraph",
    sectionId: "home.doctors",
    inlineField: "text",
    fields: [{ key: "text", label: "Note", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Performed 10,000+ cosmetic and hair procedures with a commitment to careful planning and patient-first care.",
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
  { value: "18+", label: "Years of Clinical Experience" },
  { value: "10,000+", label: "Procedures Performed" },
  { value: "1", label: "Founder-Led Care" },
] as const;

export const HOME_DOCTOR_HIGHLIGHT_DEFAULTS = [
  "Founder, Care Well Medical Centre",
  "18+ years clinical experience",
  "Hair transplant & cosmetic surgery specialist",
  "Doctor-led consultations (no sales team)",
  "Focus on natural, safe results",
  "South Delhi practice",
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

export const HOME_ABOUT_FEATURE_LEFT_DEFAULTS = [
  "Advanced Skin & Anti-Aging Treatments",
  "Hair Restoration & Transplant",
  "Laser & Non-Surgical Procedures",
] as const;

export const HOME_ABOUT_FEATURE_RIGHT_DEFAULTS = [
  "Body Contouring & Fat Reduction",
  "Scar & Acne Treatment",
  "Cosmetic Surgeries",
] as const;

export const HOME_ABOUT_HOME_ELEMENTS: ElementDescriptor[] = [
  {
    id: "home.about.label",
    displayName: "About label",
    kind: "label",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Label", type: "text", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "About Us" },
  },
  {
    id: "home.about.heading",
    displayName: "About heading",
    kind: "heading",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Heading", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: { text: "Redefining Aesthetic & Cosmetic Care" },
  },
  {
    id: "home.about.body.1",
    displayName: "About body 1",
    kind: "paragraph",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Body", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "At Care Well Medical Centre, we believe aesthetic care should enhance what is already yours — never overpower it. Our approach centres on natural-looking results that feel like you, only refined with care and precision.",
    },
  },
  {
    id: "home.about.body.2",
    displayName: "About body 2",
    kind: "paragraph",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Body", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "Every treatment plan begins with a doctor-led consultation. We take time to understand your goals, assess your unique needs, and guide you through options that are clinically sound and personally right for you.",
    },
  },
  {
    id: "home.about.body.3",
    displayName: "About body 3",
    kind: "paragraph",
    sectionId: "home.about",
    inlineField: "text",
    fields: [{ key: "text", label: "Body", type: "textarea", group: "Content" }],
    supports: { inlineEdit: true },
    defaultValues: {
      text: "We recommend only what is appropriate — prioritising safety, honesty, and long-term wellbeing over unnecessary procedures. Your trust is the foundation of everything we do.",
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
    defaultValues: { text: "Our special Features" },
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
    defaultValues: { label: "More About Us", href: "/about" },
  },
  {
    id: "home.about.image",
    displayName: "About image",
    kind: "image",
    sectionId: "home.about",
    fields: [
      { key: "src", label: "Image", type: "image", group: "Content" },
      { key: "alt", label: "Alt", type: "text", group: "Accessibility" },
    ],
    supports: { replaceMedia: true },
    defaultValues: {
      src: "/images/about-consultation.jpg",
      alt: "Doctor consultation at Care Well Medical Centre",
    },
  },
  ...HOME_ABOUT_FEATURE_LEFT_DEFAULTS.map((text, index) => ({
    id: `home.about.feature.left.${index}`,
    displayName: `Left feature ${index + 1}`,
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
    displayName: `Right feature ${index + 1}`,
    kind: "list-item" as const,
    sectionId: "home.about",
    inlineField: "text",
    fields: [
      { key: "text", label: "Text", type: "text" as const, group: "Content" as const },
    ],
    supports: { inlineEdit: true },
    defaultValues: { text },
  })),
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

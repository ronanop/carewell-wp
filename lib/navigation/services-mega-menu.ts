export type MegaServiceLink = {
  label: string;
  href: string;
};

export type MegaServiceGroup = {
  title?: string;
  links: MegaServiceLink[];
};

export type MegaServiceCategory = {
  id: string;
  title: string;
  href: string;
  description: string;
  /** Soft gradient used until category photos are provided */
  accent: string;
  groups: MegaServiceGroup[];
};

function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function link(label: string, base: string): MegaServiceLink {
  return { label, href: `${base}/${slugify(label)}` };
}

export const MEGA_SERVICE_CATEGORIES: MegaServiceCategory[] = [
  {
    id: "hair",
    title: "Hair Treatments",
    href: "/services/hair-treatments",
    description: "Personalized plans for healthier hair and confidence.",
    accent: "from-primary/20 via-primary/5 to-secondary",
    groups: [
      {
        title: "Hair Loss Treatment",
        links: [
          link("PRP Hair Treatment", "/services/hair-treatments"),
          link("Growth Factor Concentrate", "/services/hair-treatments"),
        ],
      },
      {
        title: "Hair Transplant",
        links: [
          link("Beard Transplant", "/services/hair-treatments"),
          link("Eyebrow Transplant", "/services/hair-treatments"),
          link("Female Hair Transplant", "/services/hair-treatments"),
          link("Cost of Hair Transplant", "/services/hair-treatments"),
          link("Before and After Results", "/services/hair-treatments"),
        ],
      },
    ],
  },
  {
    id: "skin",
    title: "Skin & Aesthetic",
    href: "/services/skin-aesthetic",
    description: "Refined skin and aesthetic care tailored to your goals.",
    accent: "from-accent-gold-200 via-secondary to-primary/10",
    groups: [
      {
        title: "Skin Treatments",
        links: [
          link("Acne Scar", "/services/skin-aesthetic"),
          link("Skin Whitening", "/services/skin-aesthetic"),
          link("Dark Circles", "/services/skin-aesthetic"),
          link("Vitiligo Treatment", "/services/skin-aesthetic"),
        ],
      },
      {
        title: "Cosmetic Treatments",
        links: [
          link("Botox Treatment", "/services/skin-aesthetic"),
          link("Dermal Fillers", "/services/skin-aesthetic"),
          link("Anti Aging Treatments", "/services/skin-aesthetic"),
          link("Lip Augmentation", "/services/skin-aesthetic"),
        ],
      },
      {
        title: "Body Contouring",
        links: [link("Cryolipolysis", "/services/skin-aesthetic")],
      },
      {
        links: [link("Laser Hair Removal", "/services/skin-aesthetic")],
      },
    ],
  },
  {
    id: "surgical",
    title: "Surgical Procedures",
    href: "/services/surgical-procedures",
    description: "Specialist-led surgical care with precision and discretion.",
    accent: "from-neutral-200 via-secondary to-primary/15",
    groups: [
      {
        links: [
          link("Liposuction", "/services/surgical-procedures"),
          link("Rhinoplasty", "/services/surgical-procedures"),
          link("Breast Augmentation", "/services/surgical-procedures"),
          link("Gynecomastia", "/services/surgical-procedures"),
          link("Facelift", "/services/surgical-procedures"),
          link("Tummy Tuck", "/services/surgical-procedures"),
        ],
      },
      {
        title: "Intimate Surgery",
        links: [
          link("Hymenoplasty", "/services/surgical-procedures"),
          link("Labiaplasty", "/services/surgical-procedures"),
          link("Vaginoplasty", "/services/surgical-procedures"),
        ],
      },
      {
        links: [link("Male to Female Surgery", "/services/surgical-procedures")],
      },
    ],
  },
  {
    id: "wellness",
    title: "Wellness",
    href: "/services/wellness",
    description: "Holistic therapies that support recovery and vitality.",
    accent: "from-success-50 via-primary/10 to-secondary",
    groups: [
      {
        title: "Holistic Wellness",
        links: [
          link("Ozone Therapy", "/services/wellness"),
          link("HBOT", "/services/wellness"),
          link("Peptide Therapy", "/services/wellness"),
        ],
      },
      {
        links: [link("IV Therapy", "/services/wellness")],
      },
    ],
  },
];

export type MegaServiceLink = {
  label: string;
  href: string;
};

export type MegaServiceGroup = {
  title?: string;
  /** Hub or first-child URL — required when `title` is set so subheadings are links */
  href?: string;
  links: MegaServiceLink[];
};

export type MegaServiceCategory = {
  id: string;
  title: string;
  href: string;
  description: string;
  /** Soft gradient used when no category image is set */
  accent: string;
  /** Side panel photo for this category (public path or absolute URL) */
  imageSrc?: string;
  groups: MegaServiceGroup[];
};

/**
 * Services mega menu — hrefs match legacy WordPress permalinks
 * (carewellmedicalcentre.com) so catch-all `[...uri]` resolves them.
 */
export const MEGA_SERVICE_CATEGORIES: MegaServiceCategory[] = [
  {
    id: "hair",
    title: "Hair Treatments",
    href: "/hair-loss-treatment-in-delhi/",
    description: "Personalized plans for healthier hair and confidence.",
    accent: "from-primary/20 via-primary/5 to-secondary",
    imageSrc: "/images/hero-model.png",
    groups: [
      {
        title: "Hair Loss Treatment",
        href: "/hair-loss-treatment-in-delhi/",
        links: [
          {
            label: "PRP Hair Treatment",
            href: "/hair-loss-treatment-in-delhi/prp/",
          },
          {
            label: "Growth Factor Concentrate",
            href: "/hair-loss-treatment-in-delhi/gfc-hair-treatment/",
          },
        ],
      },
      {
        title: "Hair Transplant",
        href: "/hair-transplant-in-delhi/",
        links: [
          {
            label: "Beard Transplant",
            href: "/hair-transplant-in-delhi/beard/",
          },
          {
            label: "Eyebrow Transplant",
            href: "/hair-transplant-in-delhi/eyebrow/",
          },
          {
            label: "Female Hair Transplant",
            href: "/hair-transplant-in-delhi/female/",
          },
          {
            label: "Cost of Hair Transplant",
            href: "/hair-transplant-in-delhi/cost/",
          },
          {
            label: "Before and After Results",
            href: "/hair-transplant-in-delhi/before-and-after/",
          },
        ],
      },
    ],
  },
  {
    id: "skin",
    title: "Skin & Aesthetic",
    href: "/skin-treatments-in-delhi/",
    description: "Refined skin and aesthetic care tailored to your goals.",
    accent: "from-accent-gold-200 via-secondary to-primary/10",
    imageSrc: "/images/hero-model.png",
    groups: [
      {
        title: "Skin Treatments",
        href: "/skin-treatments-in-delhi/",
        links: [
          {
            label: "Acne Scar",
            href: "/skin-treatments-in-delhi/acne-scar/",
          },
          {
            label: "Skin Whitening",
            href: "/skin-treatments-in-delhi/skin-whitening/",
          },
          {
            label: "Dark Circles",
            href: "/skin-treatments-in-delhi/dark-circles/",
          },
          {
            label: "Vitiligo Treatment",
            href: "/skin-treatments-in-delhi/vitiligo/",
          },
        ],
      },
      {
        title: "Cosmetic Treatments",
        href: "/cosmetic-treatments-in-delhi/",
        links: [
          {
            label: "Botox Treatment",
            href: "/cosmetic-treatments-in-delhi/botox/",
          },
          {
            label: "Dermal Fillers",
            href: "/cosmetic-treatments-in-delhi/dermal-fillers/",
          },
          {
            label: "Anti Aging Treatments",
            href: "/cosmetic-treatments-in-delhi/anti-aging/",
          },
          {
            label: "Lip Augmentation",
            href: "/cosmetic-treatments-in-delhi/lip-augmentation/",
          },
        ],
      },
      {
        title: "Body Contouring",
        href: "/body-contouring-in-delhi/",
        links: [
          {
            label: "Cryolipolysis",
            href: "/body-contouring-in-delhi/cryolipolysis/",
          },
        ],
      },
      {
        links: [
          {
            label: "Laser Hair Removal",
            href: "/cosmetic-treatments-in-delhi/laser-hair-removal/",
          },
        ],
      },
    ],
  },
  {
    id: "surgical",
    title: "Surgical Procedures",
    href: "/plastic-surgery-in-delhi/",
    description: "Specialist-led surgical care with precision and discretion.",
    accent: "from-neutral-200 via-secondary to-primary/15",
    imageSrc: "/images/hero-model.png",
    groups: [
      {
        links: [
          {
            label: "Liposuction",
            href: "/plastic-surgery-in-delhi/liposuction/",
          },
          {
            label: "Rhinoplasty",
            href: "/plastic-surgery-in-delhi/rhinoplasty/",
          },
          {
            label: "Breast Augmentation",
            href: "/plastic-surgery-in-delhi/breast-augmentation/",
          },
          {
            label: "Gynecomastia",
            href: "/plastic-surgery-in-delhi/gynecomastia/",
          },
          {
            label: "Facelift",
            href: "/plastic-surgery-in-delhi/facelift/",
          },
          {
            label: "Tummy Tuck",
            href: "/plastic-surgery-in-delhi/tummy-tuck/",
          },
        ],
      },
      {
        title: "Intimate Surgery",
        href: "/intimate-surgery-in-delhi/",
        links: [
          {
            label: "Hymenoplasty",
            href: "/intimate-surgery-in-delhi/hymenoplasty/",
          },
          {
            label: "Labiaplasty",
            href: "/intimate-surgery-in-delhi/labiaplasty/",
          },
          {
            label: "Vaginoplasty",
            href: "/intimate-surgery-in-delhi/vaginoplasty/",
          },
          {
            label: "Male to Female Surgery",
            href: "/plastic-surgery-in-delhi/male-to-female-surgery/",
          },
        ],
      },
    ],
  },
  {
    id: "wellness",
    title: "Wellness",
    href: "/holistic-wellness-treatments-in-delhi/",
    description: "Holistic therapies that support recovery and vitality.",
    accent: "from-success-50 via-primary/10 to-secondary",
    imageSrc: "/images/hero-background.png",
    groups: [
      {
        title: "Holistic Wellness",
        href: "/holistic-wellness-treatments-in-delhi/",
        links: [
          {
            label: "Ozone Therapy",
            href: "/holistic-wellness-treatments-in-delhi/ozone-therapy/",
          },
          {
            label: "HBOT",
            href: "/hyperbaric-oxygen-therapy-in-delhi/",
          },
          {
            label: "Peptide Therapy",
            href: "/holistic-wellness-treatments-in-delhi/peptide-therapy/",
          },
          {
            label: "IV Therapy",
            href: "/iv-therapy-in-delhi/",
          },
        ],
      },
    ],
  },
];

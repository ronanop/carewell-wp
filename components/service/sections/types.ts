/**
 * Shared props for Sanity-driven service section templates.
 */

export type SanityImage = {
  alt?: string;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width?: number; height?: number };
    };
  };
};

export type QuickFact = { label?: string; value?: string };
export type ProcessStep = { title?: string; description?: string };
export type FaqItem = { question?: string; answer?: string };
export type RelatedService = {
  _id: string;
  title?: string;
  slug?: string;
  uri?: string;
  excerpt?: string;
};
export type BeforeAfterPair = {
  before?: SanityImage;
  after?: SanityImage;
  patientInitials?: string;
  age?: number;
  gender?: string;
  monthsPost?: number;
  subtype?: string;
};
/** CMS: myths.pairs[] */
export type MythFactPair = { myth?: string; fact?: string };
/** CMS: comparison.columns[] */
export type ComparisonColumn = {
  /** CMS: comparison.columns[].title */
  title?: string;
  /** CMS: comparison.columns[].items */
  items?: string[];
};
/** CMS: technology.techniques[] */
export type TechniqueCard = {
  title?: string;
  description?: string;
  bullets?: string[];
};
/** CMS: costSnapshot.cards[] */
export type CostCard = {
  /** CMS: costSnapshot.cards[].label */
  label?: string;
  /** CMS: costSnapshot.cards[].value */
  value?: string;
  /** CMS: costSnapshot.cards[].sublabel */
  sublabel?: string;
};
export type TestimonialItem = {
  quote?: string;
  patientName?: string;
  treatment?: string;
  rating?: number;
  photo?: SanityImage;
  /** Legacy / document field — quote cards ignore this; use VideoTestimonial for the strip */
  youtubeId?: string;
};

/** CMS: testimonialsSection.videos[] */
export type VideoTestimonial = {
  title?: string;
  youtubeId?: string;
  /** Full YouTube URL — used when youtubeId is absent */
  url?: string;
  /** Optional thumbnail override (defaults to YouTube hqdefault) */
  thumbnail?: SanityImage;
};
export type DoctorProfile = {
  /** CMS: doctor.eyebrow */
  eyebrow?: string;
  /** CMS: doctor.heading */
  heading?: string;
  name?: string;
  role?: string;
  photo?: SanityImage;
  bio?: string[];
  credentials?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type SectionBaseProps = {
  id?: string;
  className?: string;
};

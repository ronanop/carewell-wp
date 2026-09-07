import type {
  BeforeAfterPair,
  ComparisonColumn,
  CostCard,
  DoctorProfile,
  FaqItem,
  MythFactPair,
  ProcessStep,
  QuickFact,
  RelatedService,
  SanityImage,
  TechniqueCard,
  TestimonialItem,
  VideoTestimonial,
} from "@/components/service/sections/types";
import type { PageBuilderSlot } from "@/lib/service/pageBuilder";

/** Sanity `service` document shape for the React service template. */
export type SanityServiceDoc = {
  _id: string;
  title: string;
  slug: string;
  uri?: string;
  category?: string;
  excerpt?: string;
  /** Editor-controlled main-column order. Unset → default layout. */
  pageBuilder?: PageBuilderSlot[] | null;
  seo?: { title?: string; description?: string; noIndex?: boolean };
  hero?: {
    heading?: string;
    tagline?: string;
    image?: SanityImage;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    quickFacts?: QuickFact[];
    quickFactsNote?: string;
  };
  overview?: {
    eyebrow?: string;
    heading?: string;
    body?: unknown[];
    insights?: string[];
    insightsTitle?: string;
    insightsEyebrow?: string;
  };
  howItWorks?: {
    eyebrow?: string;
    heading?: string;
    stepLabel?: string;
    youtubeId?: string;
    youtubeEyebrow?: string;
    youtubeTitle?: string;
    steps?: ProcessStep[];
  };
  beforeAfter?: {
    eyebrow?: string;
    heading?: string;
    consentNotice?: string;
    pairs?: BeforeAfterPair[];
  };
  candidacy?: {
    eyebrow?: string;
    heading?: string;
    goodFitLabel?: string;
    goodFit?: string[] | null;
    notIdealLabel?: string;
    notIdeal?: string[] | null;
    quizCtaLabel?: string;
    quizCtaHref?: string;
  };
  symptoms?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  causes?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  diagnosis?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  benefits?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  preparation?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  recovery?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  risks?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  untreatedRisks?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  expectations?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  whenRecommended?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  whyChooseUs?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  mistakesToAvoid?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  evidence?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  myths?: {
    eyebrow?: string;
    heading?: string;
    mythLabel?: string;
    factLabel?: string;
    pairs?: MythFactPair[];
  };
  comparison?: {
    eyebrow?: string;
    heading?: string;
    columns?: ComparisonColumn[];
    tableHtml?: string;
  };
  technology?: {
    eyebrow?: string;
    heading?: string;
    techniques?: TechniqueCard[];
  };
  treatmentOptions?: {
    eyebrow?: string;
    heading?: string;
    options?: TechniqueCard[];
  };
  pricing?: {
    eyebrow?: string;
    heading?: string;
    startingFromLabel?: string;
    startingFrom?: string;
    factorsHeading?: string;
    factors?: string[];
    includedHeading?: string;
    whatsIncluded?: string[];
    emiNote?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  costSnapshot?: {
    eyebrow?: string;
    heading?: string;
    cards?: CostCard[];
  };
  emi?: {
    eyebrow?: string;
    title?: string;
    amountLabel?: string;
    tenureLabel?: string;
    resultLabel?: string;
    disclaimer?: string;
    ctaLabel?: string;
    ctaHref?: string;
    defaultAmount?: number;
    defaultMonths?: number;
    annualRatePct?: number;
  };
  doctor?: DoctorProfile & {
    eyebrow?: string;
    heading?: string;
  };
  testimonialsSection?: {
    eyebrow?: string;
    heading?: string;
    videoEnabled?: boolean;
    videoEyebrow?: string;
    videoHeading?: string;
    items?: TestimonialItem[];
    videos?: VideoTestimonial[];
  };
  faqs?: FaqItem[];
  faqEyebrow?: string;
  faqHeading?: string;
  faqEmitJsonLd?: boolean;
  related?: {
    eyebrow?: string;
    heading?: string;
    services?: RelatedService[];
  };
  location?: {
    eyebrow?: string;
    heading?: string;
    address?: string;
    hours?: string;
    phone?: string;
    mapHref?: string;
    mapEmbedUrl?: string;
  };
  finalCta?: {
    eyebrow?: string;
    headline?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  booking?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    submitLabel?: string;
    nameLabel?: string;
    namePlaceholder?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    trustItems?: string[];
    successTitle?: string;
    successBody?: string;
    bandEyebrow?: string;
    bandHeadline?: string;
    bandBody?: string;
  };
};

/** Re-export image type for callers that previously inferred from the doc. */
export type { SanityImage };

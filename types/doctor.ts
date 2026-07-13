/** Doctor content model — ready for WordPress CPT mapping. */

export interface FeaturedImage {
  sourceUrl: string;
  altText: string;
  width: number;
  height: number;
}

export interface DoctorSeo {
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string | null;
  canonicalUrl: string;
}

export interface DoctorQuickFact {
  label: string;
  value: string;
}

export interface DoctorExpertiseItem {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface DoctorTimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface DoctorAchievement {
  value: string;
  label: string;
}

export interface DoctorWhyChooseItem {
  title: string;
  description: string;
  icon: string;
}

export interface DoctorGalleryItem {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  treatment: string;
  altBefore: string;
  altAfter: string;
}

export interface DoctorTestimonial {
  id: string;
  name: string;
  treatment: string;
  rating: number;
  review: string;
}

export interface DoctorFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface DoctorRelatedTreatment {
  title: string;
  description: string;
  href: string;
}

export interface DoctorProfile {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  title: string;
  role: string;
  experienceLabel: string;
  specialties: string[];
  trustBadges: string[];
  heroSummary: string;
  portrait: FeaturedImage | null;
  floatingAchievement: {
    value: string;
    label: string;
  };
  quickFacts: DoctorQuickFact[];
  biography: {
    overline: string;
    title: string;
    paragraphs: string[];
  };
  expertise: DoctorExpertiseItem[];
  qualifications: DoctorTimelineItem[];
  experience: DoctorTimelineItem[];
  achievements: DoctorAchievement[];
  philosophy: {
    overline: string;
    title: string;
    lead: string;
    pillars: { title: string; description: string }[];
  };
  whyChoose: DoctorWhyChooseItem[];
  gallery: DoctorGalleryItem[];
  videoConsultation: {
    overline: string;
    title: string;
    description: string;
    youtubeId: string;
    previewImage: string;
  };
  testimonials: DoctorTestimonial[];
  faqs: DoctorFaqItem[];
  relatedTreatments: DoctorRelatedTreatment[];
  clinic: {
    name: string;
    address: string;
    phone: string;
    phoneHref: string;
    whatsappHref: string;
    timings: string;
  };
  seo: DoctorSeo;
}

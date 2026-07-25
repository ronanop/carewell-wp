export const aboutStats = [
  { value: "20+", label: "Years of clinical excellence" },
  { value: "10k+", label: "Procedures performed" },
  { value: "South Delhi", label: "Chittaranjan Park clinic" },
  { value: "Patient-first", label: "Ethical, natural results" },
] as const;

export const treatmentSpecialties = [
  {
    title: "Body Contouring",
    description: "Liposuction, tummy tuck & breast procedures",
  },
  {
    title: "Hair Restoration",
    description: "Transplant & laser resurfacing treatments",
  },
  {
    title: "Facial Aesthetics",
    description: "Rhinoplasty, injectables & rejuvenation",
  },
  {
    title: "Skin & Anti-Aging",
    description: "Hydrafacial, peels & laser therapies",
  },
] as const;

export const whyChoosePillars = [
  {
    number: "01",
    title: "Expertise & Experience",
    paragraphs: [
      "Led by Dr. Sandeep Bhasin, a highly experienced cosmetic and plastic surgeon with a passion for excellence.",
      "A team of skilled dermatologists, plastic surgeons, and medical professionals dedicated to safe, effective, customized care.",
    ],
  },
  {
    number: "02",
    title: "State-of-the-Art Technology",
    paragraphs: [
      "We use FDA-approved, advanced medical technologies to deliver safe and high-quality treatments.",
      "Our clinic is equipped with the latest laser systems, surgical equipment, and diagnostic tools for precision.",
    ],
  },
  {
    number: "03",
    title: "Comprehensive Range of Treatments",
    paragraphs: [
      "From hair restoration and anti-aging to body contouring and reconstructive surgery — one clinic, continuum of care.",
    ],
    categories: [
      {
        title: "Hair Transplant & Restoration",
        items: "FUE, FUT, PRP Therapy, Scalp Micropigmentation",
      },
      {
        title: "Skin & Anti-Aging",
        items: "Laser treatments, Hydrafacial, Chemical Peels, PRP for Skin",
      },
      {
        title: "Weight Loss & Body Contouring",
        items: "Liposuction, Cryolipolysis, RF Therapy, Tummy Tuck",
      },
      {
        title: "Plastic & Reconstructive Surgery",
        items: "Rhinoplasty, Gynecomastia Surgery, Breast Augmentation",
      },
      {
        title: "Cosmetic Injectables",
        items: "Botox, Dermal Fillers, Thread Lift, Non-Surgical Face Lifts",
      },
    ],
  },
  {
    number: "04",
    title: "Personalized & Holistic Approach",
    paragraphs: [
      "Every patient receives a customized treatment plan based on their unique concerns, goals, and medical history.",
      "We combine aesthetic treatments with medical expertise for long-lasting, natural-looking results.",
    ],
  },
  {
    number: "05",
    title: "Patient Safety & Satisfaction",
    paragraphs: [
      "Strict adherence to international safety protocols to ensure patient well-being.",
      "High satisfaction with thousands of successful treatments in a warm, professional environment.",
    ],
  },
] as const;

export const doctorSpecialties = [
  "Specialized in hair restoration, skin rejuvenation, weight loss, and plastic surgery.",
  "Passionate about delivering natural-looking results with cutting-edge techniques.",
  "A trusted name in cosmetic and aesthetic medicine in India.",
] as const;

export const visionPoints = [
  {
    title: "Ethical & Transparent Consultations",
    description: "Honest advice with realistic expectations — never pressure, always clarity.",
  },
  {
    title: "Safe & Effective Treatments",
    description: "Proven medical techniques and technology, guided by clinical judgment.",
  },
  {
    title: "Exceptional Patient Care",
    description: "A caring, professional, patient-centric experience from consult to recovery.",
  },
] as const;

export const valuePillars = [
  {
    title: "Surgical Excellence",
    description:
      "Precision techniques and non-invasive innovations that prioritize safety and natural outcomes.",
  },
  {
    title: "Thoughtful Recovery",
    description:
      "Clear aftercare, attentive follow-up, and support designed around your healing journey.",
  },
  {
    title: "Patient Dedication",
    description:
      "Every plan is personal — your goals, medical history, and comfort come first.",
  },
  {
    title: "Quiet Confidence",
    description:
      "Results that feel like you — refined, balanced, and built to last.",
  },
] as const;

export const clinicDetails = {
  name: "Care Well Medical Centre",
  address:
    "House No. 1, NRI Complex, Chittaranjan Park, New Delhi, Delhi 110019",
  phone: "+91-9667977499",
  phoneHref: "tel:+919667977499",
  timings: "Tuesday to Sunday — 10:00 AM to 8:00 PM",
} as const;

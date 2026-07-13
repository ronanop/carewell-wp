export const treatmentSpecialties = [
  "Liposuction, Tummy Tuck, & Breast Augmentation",
  "Scarless & Classic Breast Reduction",
  "Scarless Gynecomastia Surgery (Male Breast Reduction)",
  "Cosmetic & Reconstructive Surgery for Male & Female Genitals",
  "Hair Transplant & Laser Resurfacing Treatment",
] as const;

export const whyChoosePillars = [
  {
    number: "01",
    title: "Expertise & Experience",
    paragraphs: [
      "Led by Dr. Sandeep Bhasin, a highly experienced cosmetic and plastic surgeon with a passion for excellence.",
      "A team of skilled dermatologists, plastic surgeons, and medical professionals dedicated to providing safe, effective, and customized treatments.",
    ],
  },
  {
    number: "02",
    title: "State-of-the-Art Technology",
    paragraphs: [
      "We use FDA-approved, advanced medical technologies to deliver safe and high-quality treatments.",
      "Our clinic is equipped with the latest laser systems, surgical equipment, and diagnostic tools for precision and effectiveness.",
    ],
  },
  {
    number: "03",
    title: "Comprehensive Range of Treatments",
    paragraphs: [
      "We specialize in a wide variety of cosmetic, aesthetic, and reconstructive treatments, including:",
    ],
    categories: [
      {
        title: "Hair Transplant & Hair Restoration",
        items: "FUE, FUT, PRP Therapy, Scalp Micropigmentation",
      },
      {
        title: "Skin & Anti-Aging Treatments",
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
      "We emphasize holistic wellness, combining aesthetic treatments with medical expertise to ensure long-lasting and natural results.",
    ],
  },
  {
    number: "05",
    title: "Patient Safety & Satisfaction",
    paragraphs: [
      "Strict adherence to international safety protocols to ensure patient well-being.",
      "High patient satisfaction rates with thousands of successful treatments performed.",
      "A warm and professional environment where patients feel comfortable and confident in their treatment journey.",
    ],
  },
] as const;

export const doctorSpecialties = [
  "Specialized in hair restoration, skin rejuvenation, weight loss, and plastic surgery.",
  "Passionate about delivering natural-looking results with cutting-edge techniques.",
  "A trusted name in the field of cosmetic and aesthetic medicine in India.",
] as const;

export const visionPoints = [
  {
    title: "Ethical & Transparent Consultations",
    description: "Honest advice with realistic expectations.",
  },
  {
    title: "Safe & Effective Treatments",
    description: "Using proven medical techniques and technology.",
  },
  {
    title: "Exceptional Patient Care",
    description: "A caring, professional, and patient-centric approach.",
  },
] as const;

export const valuePillars = [
  {
    title: "Surgery Success",
    description:
      "Transforming lives through surgical excellence and non-invasive innovations at Care Well Medical Centre.",
  },
  {
    title: "Recovery Success",
    description:
      "Transforming Lives: Remarkable Recovery Stories in Cosmetic and Non-Invasive Procedures.",
  },
  {
    title: "Patient Dedication",
    description:
      "Patient-Centric Excellence in Cosmetic Surgery at Care Well Medical Centre.",
  },
  {
    title: "Care Expressed",
    description:
      "Elevate Your Beauty: Premier Cosmetic Surgery at Care Well Medical Centre.",
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

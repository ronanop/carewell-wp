import type { DoctorProfile } from "@/types/doctor";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carewellmedical.com";

/**
 * Static doctor profile content.
 * Structured for a future WordPress CPT → mapper swap without layout changes.
 */
export const drSandeepBhasin: DoctorProfile = {
  id: "dr-sandeep-bhasin",
  slug: "dr-sandeep-bhasin",
  name: "Dr. Sandeep Bhasin",
  shortName: "Dr. Bhasin",
  title: "Founder & Senior Cosmetic Surgeon",
  role: "Medical Director, Care Well Medical Centre",
  experienceLabel: "20+ Years Experience",
  specialties: [
    "Hair Transplant Specialist",
    "Cosmetic Surgeon",
    "Anti Aging Expert",
  ],
  trustBadges: [
    "20+ Years Experience",
    "10,000+ Procedures",
    "Thousands of Happy Patients",
    "South Delhi",
  ],
  heroSummary:
    "Founder-led cosmetic and hair restoration care in South Delhi — focused on natural results, honest guidance, and doctor-supervised treatment planning.",
  portrait: {
    sourceUrl: "/images/dr-sandeep-bhasin.jpg",
    altText:
      "Dr. Sandeep Bhasin, Founder and Senior Cosmetic Surgeon at Care Well Medical Centre",
    width: 800,
    height: 1000,
  },
  floatingAchievement: {
    value: "10,000+",
    label: "Procedures Performed",
  },
  quickFacts: [
    { label: "Experience", value: "20+ years in cosmetic & aesthetic surgery" },
    {
      label: "Education",
      value: "MBBS, MS — advanced cosmetic surgery training",
    },
    {
      label: "Specializations",
      value: "Hair transplant, injectables, body contouring",
    },
    { label: "Languages", value: "English, Hindi" },
    { label: "Consultation", value: "In-clinic & video consultation" },
    {
      label: "Clinic",
      value: "Care Well Medical Centre, Chittaranjan Park",
    },
    { label: "Availability", value: "Tue–Sun, 10:00 AM – 8:00 PM" },
  ],
  biography: {
    overline: "Biography",
    title: "A career built on precision, empathy, and natural results",
    paragraphs: [
      "Dr. Sandeep Bhasin’s journey in medicine began with a clear purpose: to combine surgical skill with a deeply patient-centred approach. After completing his medical training, he focused on cosmetic and aesthetic surgery — fields where technical precision and aesthetic judgment must work together.",
      "Over more than two decades, he has performed thousands of hair restoration and cosmetic procedures for patients across Delhi NCR and beyond. As Founder of Care Well Medical Centre in Chittaranjan Park, South Delhi, he has built a practice where consultations are doctor-led, expectations are set honestly, and treatment plans are tailored to each individual’s goals and medical profile.",
      "His clinical approach balances evidence-based techniques with an eye for natural proportion. Whether planning a hairline, refining facial contours with injectables, or guiding a patient through body contouring, Dr. Bhasin prioritises safety, clarity, and results that look like the patient — only more confident.",
      "Patients often describe his philosophy as calm and thorough: time is taken to understand concerns, discuss options, and explain recovery. The goal is not a dramatic change for its own sake, but a thoughtful transformation that supports long-term wellbeing and self-assurance.",
      "Looking ahead, Dr. Bhasin’s vision for Care Well remains consistent — advance clinical standards in South Delhi, adopt proven technology responsibly, and keep every treatment plan rooted in ethics, transparency, and lasting patient relationships.",
    ],
  },
  expertise: [
    {
      slug: "hair-transplant",
      title: "Hair Transplant",
      description:
        "FUE and advanced restoration techniques planned for density, hairline design, and natural growth patterns.",
      href: "/services/hair-treatments/beard-transplant",
      icon: "Scissors",
    },
    {
      slug: "prp-therapy",
      title: "PRP Therapy",
      description:
        "Platelet-rich plasma protocols to support hair health and skin rejuvenation as part of a wider plan.",
      href: "/services/hair-treatments/prp-hair-treatment",
      icon: "Droplets",
    },
    {
      slug: "beard-transplant",
      title: "Beard Transplant",
      description:
        "Precise follicular placement for fuller, balanced facial hair with natural direction and density.",
      href: "/services/hair-treatments/beard-transplant",
      icon: "User",
    },
    {
      slug: "hairline-design",
      title: "Hairline Design",
      description:
        "Age-appropriate, face-framed hairlines designed for soft transitions and long-term aesthetics.",
      href: "/services/hair-treatments",
      icon: "PenTool",
    },
    {
      slug: "botox",
      title: "Botox",
      description:
        "Targeted neuromodulator treatments for expression lines with a refined, natural finish.",
      href: "/services/skin-aesthetic/botox-treatment",
      icon: "Sparkles",
    },
    {
      slug: "fillers",
      title: "Fillers",
      description:
        "Dermal fillers for volume, contour, and subtle facial balance — never overfilled.",
      href: "/services/skin-aesthetic/dermal-fillers",
      icon: "Heart",
    },
    {
      slug: "rhinoplasty",
      title: "Rhinoplasty",
      description:
        "Surgical and aesthetic nasal refinement focused on harmony with facial proportions.",
      href: "/services/plastic-surgery",
      icon: "ScanFace",
    },
    {
      slug: "liposuction",
      title: "Liposuction",
      description:
        "Body contouring with careful planning for smoother silhouette and safer recovery.",
      href: "/services/weight-loss",
      icon: "Activity",
    },
    {
      slug: "gynecomastia",
      title: "Gynecomastia",
      description:
        "Male chest reduction with discreet technique and attention to natural chest contour.",
      href: "/services/plastic-surgery",
      icon: "Shield",
    },
    {
      slug: "skin-treatments",
      title: "Skin Treatments",
      description:
        "Medical-grade peels, lasers, and rejuvenation protocols for clearer, healthier skin.",
      href: "/services/skin-aesthetic",
      icon: "Sun",
    },
    {
      slug: "acne-scar-revision",
      title: "Acne Scar Revision",
      description:
        "Combination approaches to soften scar texture and improve skin uniformity over time.",
      href: "/services/skin-aesthetic/acne-scar",
      icon: "Layers",
    },
    {
      slug: "anti-aging",
      title: "Anti Aging",
      description:
        "Personalised anti-aging plans combining injectables, skin therapy, and lifestyle guidance.",
      href: "/services/skin-aesthetic",
      icon: "Clock",
    },
  ],
  qualifications: [
    {
      year: "MBBS",
      title: "Bachelor of Medicine & Bachelor of Surgery",
      description:
        "Foundational medical degree with clinical training across core specialties.",
    },
    {
      year: "MS",
      title: "Master of Surgery",
      description:
        "Postgraduate surgical training focused on operative skill and patient safety.",
    },
    {
      year: "Training",
      title: "Advanced Cosmetic Surgery Training",
      description:
        "Specialised training in aesthetic procedures, hair restoration, and facial rejuvenation.",
    },
    {
      year: "Fellowships",
      title: "Clinical Fellowships & Observerships",
      description:
        "Continued learning through fellowships and focused observerships in cosmetic practice.",
    },
    {
      year: "Certifications",
      title: "Advanced Certifications",
      description:
        "Certifications in contemporary techniques including FUE hair transplant and injectables.",
    },
    {
      year: "Workshops",
      title: "Workshops & Hands-on Programs",
      description:
        "Regular participation in clinical workshops to refine technique and adopt proven methods.",
    },
    {
      year: "Memberships",
      title: "Professional Memberships",
      description:
        "Active engagement with professional medical and aesthetic surgery communities.",
    },
  ],
  experience: [
    {
      year: "Founder",
      title: "Care Well Medical Centre, South Delhi",
      description:
        "Established and leads a doctor-supervised clinic for hair, skin, and cosmetic surgery in Chittaranjan Park.",
    },
    {
      year: "20+ yrs",
      title: "Senior Cosmetic & Hair Transplant Surgeon",
      description:
        "Extensive clinical experience across hair restoration, injectables, and body contouring procedures.",
    },
    {
      year: "Leadership",
      title: "Medical Director & Clinical Lead",
      description:
        "Oversees treatment standards, consultation quality, and patient safety protocols at the centre.",
    },
    {
      year: "Hospitals",
      title: "Hospital & Surgical Collaborations",
      description:
        "Experience working within hospital and clinic settings for surgical and aesthetic care pathways.",
    },
  ],
  achievements: [
    { value: "20+", label: "Years Experience" },
    { value: "10000+", label: "Successful Procedures" },
    { value: "Thousands", label: "Satisfied Patients" },
    { value: "National", label: "Recognition" },
  ],
  philosophy: {
    overline: "Treatment Philosophy",
    title: "Care that respects your face, your goals, and your timeline",
    lead: "Every recommendation starts with listening. Dr. Bhasin believes lasting results come from personalised planning, evidence-based technique, and a relationship built on trust — not rushed decisions.",
    pillars: [
      {
        title: "Personalized care",
        description:
          "Treatment plans are shaped around your anatomy, lifestyle, and realistic goals — never a one-size template.",
      },
      {
        title: "Natural results",
        description:
          "The aim is refinement that looks like you on your best day, with proportion and subtlety at the centre.",
      },
      {
        title: "Evidence-based treatment",
        description:
          "Techniques and technologies are chosen for proven safety and outcomes, explained in clear language.",
      },
      {
        title: "Patient-first approach",
        description:
          "Consultations are doctor-led. You receive honest advice — including when a procedure is not the right fit.",
      },
      {
        title: "Long-term relationship",
        description:
          "Follow-up and aftercare matter. Support continues beyond the procedure day for confidence and recovery.",
      },
    ],
  },
  whyChoose: [
    {
      title: "Natural Results",
      description:
        "Hairlines, contours, and injectables planned for balance — not an overdone look.",
      icon: "Sparkles",
    },
    {
      title: "Personalised Treatment",
      description:
        "Every plan is tailored after a detailed consultation and clinical assessment.",
      icon: "UserRound",
    },
    {
      title: "Advanced Technology",
      description:
        "Modern FUE systems, medical-grade devices, and carefully selected protocols.",
      icon: "Monitor",
    },
    {
      title: "Transparent Consultation",
      description:
        "Clear discussion of options, timelines, risks, and expected outcomes.",
      icon: "MessageCircle",
    },
    {
      title: "Ethical Practice",
      description:
        "No pressure sales. Recommendations are guided by medical judgement and your wellbeing.",
      icon: "ShieldCheck",
    },
    {
      title: "Long-Term Support",
      description:
        "Structured follow-ups and guidance so results settle safely and confidently.",
      icon: "HeartHandshake",
    },
  ],
  gallery: [
    {
      id: "1",
      beforeSrc: "/images/placeholders/before-1.jpg",
      afterSrc: "/images/placeholders/after-1.jpg",
      treatment: "Hair Transplant",
      altBefore: "Hair transplant before treatment — placeholder",
      altAfter: "Hair transplant after treatment — placeholder",
    },
    {
      id: "2",
      beforeSrc: "/images/placeholders/before-2.jpg",
      afterSrc: "/images/placeholders/after-2.jpg",
      treatment: "Beard Transplant",
      altBefore: "Beard transplant before treatment — placeholder",
      altAfter: "Beard transplant after treatment — placeholder",
    },
    {
      id: "3",
      beforeSrc: "/images/placeholders/before-3.jpg",
      afterSrc: "/images/placeholders/after-3.jpg",
      treatment: "Gynecomastia",
      altBefore: "Gynecomastia before treatment — placeholder",
      altAfter: "Gynecomastia after treatment — placeholder",
    },
    {
      id: "4",
      beforeSrc: "/images/placeholders/before-4.jpg",
      afterSrc: "/images/placeholders/after-4.jpg",
      treatment: "Acne Scar Revision",
      altBefore: "Acne scar revision before treatment — placeholder",
      altAfter: "Acne scar revision after treatment — placeholder",
    },
  ],
  videoConsultation: {
    overline: "Remote Care",
    title: "Prefer to start with a video consultation?",
    description:
      "Discuss your concerns with Dr. Bhasin’s team from home. A structured video consult helps you understand suitability, next steps, and whether an in-clinic visit is recommended.",
    /** Replace with a real YouTube video ID when available from WordPress. */
    youtubeId: "",
    previewImage: "/images/dr-sandeep-bhasin.jpg",
  },
  testimonials: [
    {
      id: "1",
      name: "Rahul M.",
      treatment: "Hair Transplant",
      rating: 5,
      review:
        "Dr. Bhasin explained every step clearly and set realistic expectations. My hairline looks natural, and the follow-up care was excellent.",
    },
    {
      id: "2",
      name: "Ananya S.",
      treatment: "Botox & Skin Rejuvenation",
      rating: 5,
      review:
        "The consultation felt thorough and unhurried. Results are subtle — exactly what I wanted — and the clinic environment is calm and professional.",
    },
    {
      id: "3",
      name: "Vikram K.",
      treatment: "Gynecomastia Surgery",
      rating: 5,
      review:
        "I appreciated the honest advice and careful planning. Recovery guidance was clear, and I’m very satisfied with the outcome.",
    },
  ],
  faqs: [
    {
      id: "experience",
      question: "How many years of experience does Dr. Sandeep Bhasin have?",
      answer:
        "Dr. Sandeep Bhasin has over 20 years of clinical experience in cosmetic surgery, hair restoration, and aesthetic medicine, and has performed 10,000+ procedures.",
    },
    {
      id: "treatments",
      question: "Which treatments are offered?",
      answer:
        "Core offerings include hair transplant and PRP, beard transplant, hairline design, Botox and fillers, rhinoplasty, liposuction, gynecomastia, skin treatments, acne scar revision, and anti-aging plans. Suitability is confirmed during consultation.",
    },
    {
      id: "clinic",
      question: "Where is the clinic located?",
      answer:
        "Care Well Medical Centre is at House No. 1, NRI Complex, Chittaranjan Park, New Delhi 110019 — serving South Delhi and Delhi NCR.",
    },
    {
      id: "consultation-length",
      question: "How long is a consultation?",
      answer:
        "Most first consultations last 30–45 minutes, allowing time for assessment, discussion of options, and a clear outline of next steps. Complex cases may take longer.",
    },
    {
      id: "booking",
      question: "How do I book an appointment?",
      answer:
        "You can book via the contact page, call the clinic on +91-9667977499, or message on WhatsApp. The team will help you choose an in-clinic or video consultation slot.",
    },
  ],
  relatedTreatments: [
    {
      title: "Hair Transplant",
      description: "Natural hair restoration with careful hairline planning.",
      href: "/services/hair-treatments",
    },
    {
      title: "PRP",
      description: "Supportive therapy for hair and skin rejuvenation.",
      href: "/services/hair-treatments/prp-hair-treatment",
    },
    {
      title: "Botox",
      description: "Refined treatment for expression lines and prevention.",
      href: "/services/skin-aesthetic/botox-treatment",
    },
    {
      title: "Skin Tightening",
      description: "Non-surgical options to improve firmness and texture.",
      href: "/services/skin-aesthetic",
    },
    {
      title: "Hair Loss",
      description: "Diagnosis-led plans for thinning and pattern hair loss.",
      href: "/services/hair-treatments",
    },
    {
      title: "Cosmetic Surgery",
      description: "Surgical aesthetic procedures with safety-first planning.",
      href: "/services/plastic-surgery",
    },
  ],
  clinic: {
    name: "Care Well Medical Centre",
    address:
      "House No. 1, NRI Complex, Chittaranjan Park, New Delhi, Delhi 110019",
    phone: "+91-9667977499",
    phoneHref: "tel:+919667977499",
    whatsappHref: "https://wa.me/919667977499",
    timings: "Tuesday to Sunday — 10:00 AM to 8:00 PM",
  },
  seo: {
    title: "Dr. Sandeep Bhasin | Senior Cosmetic Surgeon | Care Well Medical Centre",
    description:
      "Meet Dr. Sandeep Bhasin — Founder & Senior Cosmetic Surgeon at Care Well Medical Centre, South Delhi. 20+ years experience in hair transplant, cosmetic surgery, and anti-aging care.",
    openGraphTitle: "Dr. Sandeep Bhasin | Care Well Medical Centre",
    openGraphDescription:
      "Founder-led cosmetic and hair restoration care in Chittaranjan Park, South Delhi. Book a consultation with Dr. Sandeep Bhasin.",
    openGraphImage: "/images/dr-sandeep-bhasin.jpg",
    canonicalUrl: `${SITE_URL}/about/dr-sandeep-bhasin`,
  },
};

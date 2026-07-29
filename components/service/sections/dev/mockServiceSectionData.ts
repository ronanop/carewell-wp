/**
 * Dev-only fixture data for the service section gallery.
 * Keeps every section visible with realistic sample content.
 */

function pt(text: string, key = "b1") {
  return [
    {
      _type: "block" as const,
      _key: key,
      style: "normal" as const,
      markDefs: [],
      children: [{ _type: "span" as const, _key: `${key}s`, text, marks: [] }],
    },
  ];
}

export const galleryMock = {
  hero: {
    /** Mirrors WordPress page title → hero H1 */
    heading:
      "Best Gynecomastia Surgery in Delhi – Regain a Confident, Masculine Chest",
    /** Service hero tagline only — leave empty to hide the subtitle. */
    tagline: "",
    category: "body",
    /** Exact WordPress page URI — breadcrumbs come from these path segments. */
    uri: "/plastic-surgery-in-delhi/gynecomastia/",
    primaryCtaLabel: "Book Free Consultation",
    secondaryCtaLabel: "WhatsApp",
    quickFacts: [
      { label: "Procedure time", value: "60–90 min" },
      { label: "Anesthesia", value: "Local / GA" },
      { label: "Downtime", value: "3–7 days" },
      { label: "Results", value: "Permanent*" },
    ],
    quickFactsNote:
      "Typical ranges — your plan is confirmed after consultation.",
  },
  booking: {
    eyebrow: "Free consult",
    title: "Book FREE consultation",
    subtitle: "Speak with our team about Gynecomastia Surgery.",
    submitLabel: "Book Free Consultation",
    nameLabel: "Patient name",
    namePlaceholder: "Full name",
    phoneLabel: "Mobile number",
    phonePlaceholder: "10-digit mobile",
    trustItems: ["100% private", "Reply in ~2 hrs", "No spam"],
    successTitle: "Request received",
    successBody: "We’ll call you shortly on the number you shared.",
    bandEyebrow: "Next step",
    bandHeadline: "Ready to discuss your treatment plan?",
    bandBody:
      "Share your details — a Care Well coordinator will call you to schedule a free, private consultation.",
  },
  overview: {
    eyebrow: "Overview",
    title: "What is gynecomastia surgery?",
    body: pt(
      "Gynecomastia surgery removes excess male breast tissue and fat to create a flatter, more masculine chest contour. Care Well focuses on natural proportions, scar placement, and a structured recovery plan.",
    ),
    insightsEyebrow: "Good to know",
    insightsTitle: "Key insights",
    insights: [
      "Often combined liposuction + gland excision",
      "Most patients return to desk work in a few days",
      "Compression garment typically worn 3–4 weeks",
    ],
  },
  howItWorks: {
    eyebrow: "Process",
    title: "How the procedure works",
    stepLabel: "Step",
    // Demo id for standalone YoutubeEmbedSection only — HowItWorks gallery is steps-only
    youtubeId: "dQw4w9WgXcQ",
    youtubeEyebrow: "Video",
    youtubeTitle: "Watch how the procedure works",
    steps: [
      { title: "Consult", description: "Exam, photos, and grade assessment." },
      { title: "Plan", description: "Choose lipo, excision, or both." },
      { title: "Surgery", description: "Day-care procedure under anesthesia." },
      { title: "Recover", description: "Garment, rest, follow-ups." },
      { title: "Results", description: "Contour settles over weeks." },
    ],
  },
  beforeAfter: {
    eyebrow: "Results",
    title: "Before & after",
    consentNotice:
      "Results vary. Images used with patient consent for educational purposes.",
    pairs: [
      {
        patientInitials: "R.K.",
        monthsPost: 3,
        subtype: "Grade II",
      },
      {
        patientInitials: "A.S.",
        monthsPost: 6,
        subtype: "Grade III",
      },
      {
        patientInitials: "M.P.",
        monthsPost: 4,
        subtype: "Grade I",
      },
      {
        patientInitials: "V.N.",
        monthsPost: 8,
        subtype: "Grade II–III",
      },
    ],
  },
  candidacy: {
    eyebrow: "Eligibility",
    title: "Am I a candidate?",
    goodFitLabel: "Good fit",
    goodFit: [
      "Stable weight for 3+ months",
      "Persistent glandular tissue after lifestyle changes",
      "Good general health, non-smoker or willing to pause",
    ],
    notIdealLabel: "Not ideal",
    notIdeal: [
      "Uncontrolled medical conditions",
      "Active steroid use without medical review",
      "Unrealistic expectation of zero scarring",
    ],
    quizCtaLabel: "Take the candidacy quiz",
    quizCtaHref: "#quiz",
  },
  pricing: {
    eyebrow: "Investment",
    title: "Transparent pricing guidance",
    startingFromLabel: "Starting from",
    startingFrom: "₹45,000*",
    factorsHeading: "What affects cost",
    factors: [
      "Grade / amount of tissue",
      "Liposuction vs excision",
      "Anesthesia type",
      "Facility & aftercare package",
    ],
    includedHeading: "What's included",
    whatsIncluded: [
      "Surgeon fees",
      "OT charges (package dependent)",
      "Compression garment guidance",
      "Follow-up visits",
    ],
    emiNote: "EMI options available from ~₹4,000/month (subject to approval).",
    ctaLabel: "Get Personalized Quote",
    ctaHref: "#book",
  },
  emi: {
    eyebrow: "Financing",
    title: "Plan treatment with easy EMI",
    amountLabel: "Treatment amount",
    tenureLabel: "Tenure (months)",
    resultLabel: "Estimated monthly EMI",
    disclaimer:
      "Indicative only at 12% p.a. Final EMI depends on partner approval and your credit profile.",
    ctaLabel: "Discuss EMI options with Carewell team",
    ctaHref: "#book",
    defaultAmount: 80000,
    defaultMonths: 12,
    annualRatePct: 12,
  },
  faqEyebrow: "Questions",
  faqHeading: "Frequently asked questions",
  faqs: [
    {
      question: "Is gynecomastia surgery permanent?",
      answer:
        "Gland removal is lasting. Significant weight gain or hormonal changes can affect remaining fat.",
    },
    {
      question: "Will there be scars?",
      answer:
        "Incisions are typically small and placed around the areola or in natural creases. Scars fade over months.",
    },
    {
      question: "When can I exercise again?",
      answer:
        "Light walking soon after; upper-body workouts usually after clearance (often 3–4 weeks).",
    },
    {
      question: "How long before I see final results?",
      answer:
        "Swelling settles over weeks; most patients see a clear contour within 1–3 months as healing progresses.",
    },
    {
      question: "Is the consultation free?",
      answer:
        "Yes — your first consult with the Carewell team is complimentary and obligation-free.",
    },
  ],
  related: {
    eyebrow: "Explore",
    heading: "Related services you may consider",
    services: [
      {
        _id: "rel-1",
        title: "Liposuction",
        slug: "liposuction",
        excerpt: "Body contouring for stubborn fat pockets.",
      },
      {
        _id: "rel-2",
        title: "Hair Transplant",
        slug: "hair-transplant",
        excerpt: "FUE / FUT restoration with natural hairline design.",
      },
      {
        _id: "rel-3",
        title: "Rhinoplasty",
        slug: "rhinoplasty",
        excerpt: "Functional and aesthetic nose surgery.",
      },
      {
        _id: "rel-4",
        title: "Blepharoplasty",
        slug: "blepharoplasty",
        excerpt: "Eyelid surgery for a refreshed, natural look.",
      },
    ],
  },
  doctor: {
    eyebrow: "Surgeon",
    heading: "Meet your surgeon",
    name: "Dr. Sandeep Bhasin",
    role: "Cosmetic & Plastic Surgeon",
    bio: [
      "Experienced surgeon at Care Well Medical Centre, Chittaranjan Park, South Delhi.",
      "Focus on patient education, safety, and natural-looking outcomes.",
    ],
    credentials: ["MBBS", "Cosmetic Surgery", "15+ years"],
    ctaLabel: "Book with Dr. Bhasin",
    ctaHref: "#book",
  },
  testimonials: {
    eyebrow: "Patient stories",
    heading: "What patients say",
    items: [
      {
        quote:
          "The team explained every step. My chest looks natural and the recovery was smoother than I expected.",
        patientName: "Rohan M.",
        treatment: "Gynecomastia Grade II",
        rating: 5,
      },
      {
        quote:
          "Discreet consultation and clear pricing. Happy with the contour after 3 months.",
        patientName: "Amit K.",
        treatment: "Gynecomastia + Lipo",
        rating: 5,
      },
      {
        quote:
          "I was nervous about scars — the surgeon walked me through incision placement and aftercare in detail.",
        patientName: "Vikram S.",
        treatment: "Gynecomastia Grade III",
        rating: 4,
      },
    ],
    videoEnabled: true,
    videoEyebrow: "Watch",
    videoHeading: "Patient video stories",
    videos: [
      {
        title: "Gynecomastia recovery journey",
        youtubeId: "dQw4w9WgXcQ",
      },
      {
        title: "Why I chose Care Well",
        youtubeId: "jNQXAC9IVRw",
      },
      {
        title: "3 months after surgery",
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      },
      {
        title: "Consultation experience",
        youtubeId: "kJQP7kiw5Fk",
      },
    ],
  },
  symptoms: {
    eyebrow: "Symptoms",
    title: "Common signs to watch for",
    intro: "Common signs patients notice before seeking consult.",
    items: [
      "Chest fullness or firm gland under the nipple",
      "Asymmetry between left and right sides",
      "Self-consciousness in fitted clothing",
      "Tenderness in some hormonal cases",
    ],
  },
  causes: {
    eyebrow: "Causes",
    title: "Causes & risk factors",
    intro: "Hormonal, medication, and lifestyle factors can contribute.",
    items: [
      "Hormonal imbalance (estrogen/androgen)",
      "Certain medications or steroids",
      "Residual tissue after weight loss",
      "Pubertal persistence into adulthood",
    ],
  },
  diagnosis: {
    eyebrow: "Diagnosis",
    title: "How we evaluate",
    intro: "Clinical exam is primary; imaging or labs when indicated.",
    items: [
      "Physical exam & grade assessment",
      "Medical / drug history review",
      "Optional ultrasound if asymmetric or suspicious",
      "Bloodwork when hormonal cause suspected",
    ],
  },
  benefits: {
    eyebrow: "Benefits",
    title: "What patients typically gain",
    intro: "What patients typically gain after successful treatment.",
    items: [
      "Flatter, more masculine chest contour",
      "Clothes fit with more confidence",
      "Relief from firm glandular fullness",
      "Structured aftercare plan",
    ],
  },
  expectations: {
    eyebrow: "Outcomes",
    title: "Results & expectations",
    intro: "Set expectations early for a calmer recovery.",
    items: [
      "Immediate flatter look under garment",
      "Final contour clarifies as swelling drops",
      "Scars fade over months with care",
      "Maintain stable weight for lasting shape",
    ],
  },
  preparation: {
    eyebrow: "Preparation",
    title: "How to prepare",
    intro: "Simple steps that make surgery day smoother.",
    items: [
      "Stop smoking as advised",
      "Share full medication list",
      "Arrange a ride home",
      "Wear loose front-opening clothes",
    ],
  },
  recovery: {
    eyebrow: "Recovery",
    title: "Recovery & aftercare",
    intro: "Typical recovery milestones — your plan may differ.",
    items: [
      "Day 1–3: rest, garment, short walks",
      "Week 1: desk work for many patients",
      "Weeks 2–4: gradual activity as cleared",
      "Months 1–3: swelling settles, scars mature",
    ],
  },
  whenRecommended: {
    eyebrow: "Clinical guidance",
    title: "When doctors recommend this",
    intro:
      "Surgery is usually considered when lifestyle measures and medical review are not enough — and anatomy favors a predictable result.",
    items: [
      "Tissue persists after lifestyle / medical review",
      "Pain or tenderness affects daily life",
      "Psychological distress is significant",
      "Grade and anatomy favor a predictable result",
    ],
  },
  risks: {
    eyebrow: "Safety",
    title: "Risks & side effects",
    intro:
      "Every procedure has trade-offs. We discuss these openly in consult so you can decide with clear eyes.",
    items: [
      "Bruising, swelling, temporary numbness",
      "Asymmetry or contour irregularity",
      "Infection or hematoma (uncommon)",
      "Need for revision in select cases",
    ],
  },
  evidence: {
    eyebrow: "Research",
    title: "Medical evidence",
    intro:
      "Clinical principles we use to frame consults — not a substitute for personalised medical advice.",
    items: [
      "True gynecomastia includes glandular tissue diet alone cannot remove",
      "Excision addresses persistent gland when imaging and exam confirm it",
      "Careful patient selection lowers revision and contour risk",
      "Compression garments support early contouring in the first weeks",
    ],
  },
  untreatedRisks: {
    eyebrow: "Awareness",
    title: "What if left untreated",
    intro:
      "Leaving persistent gynecomastia untreated may mean ongoing discomfort or missed chances to rule out uncommon causes — a consult helps you decide calmly.",
    items: [
      "Ongoing self-consciousness in fitted clothing or at the beach",
      "Avoidance of sports, swimming, or locker rooms",
      "Progression in some hormonal or medication-related cases",
      "Missed chance to rule out uncommon underlying causes",
    ],
  },
  mistakesToAvoid: {
    eyebrow: "Guidance",
    title: "Mistakes to avoid",
    intro:
      "Small missteps can slow recovery. We coach patients to skip these common pitfalls.",
    items: [
      "Stopping the garment too early",
      "Returning to heavy lifting before clearance",
      "Comparing day-3 photos to final results",
      "Hiding medication or steroid history",
    ],
  },
  whyChooseUs: {
    eyebrow: "Why Care Well",
    title: "Why patients choose Care Well",
    intro: "Why patients choose Care Well for male chest surgery.",
    items: [
      "Experienced cosmetic surgeon",
      "Clear grade-based planning",
      "Discreet South Delhi clinic",
      "Transparent packages & follow-ups",
    ],
  },
  /** Shared list fixture for Wave 2 sections still on generic props */
  listItems: [
    "Chest fullness or firm gland under the nipple",
    "Asymmetry between left and right sides",
    "Self-consciousness in fitted clothing",
    "Tenderness in some hormonal cases",
  ],
  myths: {
    eyebrow: "Clarity",
    title: "Myth vs fact",
    mythLabel: "Myth",
    factLabel: "Fact",
    pairs: [
      {
        myth: "Only overweight men get gynecomastia.",
        fact: "Lean patients can have true glandular tissue that does not respond to diet alone.",
      },
      {
        myth: "Exercise always fixes it.",
        fact: "Gym work can help fat, but gland usually needs surgical excision when persistent.",
      },
      {
        myth: "Surgery always leaves large, obvious scars.",
        fact: "Incisions are typically small and placed along the areola border for discreet healing.",
      },
    ],
  },
  comparison: {
    eyebrow: "Compare",
    title: "Surgery vs non-surgical",
    columns: [
      {
        title: "Surgery",
        items: ["Removes gland", "Faster contour change", "Short downtime"],
      },
      {
        title: "Meds / observation",
        items: ["Limited for long-standing cases", "Needs medical supervision"],
      },
      {
        title: "Lifestyle only",
        items: ["Helps fat component", "Won’t remove firm gland"],
      },
    ],
  },
  techniques: [
    {
      title: "Liposuction-assisted",
      description: "Best when fatty tissue dominates.",
      bullets: ["Small incisions", "Smooth contouring"],
    },
    {
      title: "Gland excision",
      description: "For firm subareolar gland.",
      bullets: ["Direct removal", "Precise shaping"],
    },
  ],
  /** CMS: technology.* — TechnologySection gallery fixture */
  technology: {
    eyebrow: "Technology",
    title: "Techniques & technology",
    techniques: [
      {
        title: "Liposuction-assisted",
        description: "Best when fatty tissue dominates.",
        bullets: ["Small incisions", "Smooth contouring", "Minimal scarring"],
      },
      {
        title: "Gland excision",
        description: "For firm subareolar gland.",
        bullets: ["Direct removal", "Precise shaping", "Natural contour"],
      },
      {
        title: "Combined approach",
        description: "When both fat and gland are present.",
        bullets: ["Tailored plan", "Single session when suitable"],
      },
    ],
  },
  /** CMS: treatmentOptions.* — separate from technology */
  treatmentOptions: {
    eyebrow: "Options",
    title: "Treatment options",
    options: [
      {
        title: "Surgical gynecomastia correction",
        description: "Gland excision with or without liposuction, matched to grade.",
        bullets: ["Permanent contour change", "Day-care / short stay"],
      },
      {
        title: "Observation / medical review",
        description: "When tissue is recent, hormonal, or still evolving.",
        bullets: ["Drug / hormone history", "Follow-up reassessment"],
      },
    ],
  },
  costSnapshot: {
    eyebrow: "Cost",
    title: "Cost at a glance",
    cards: [
      { label: "Starting from", value: "₹45k*", sublabel: "Grade dependent" },
      { label: "EMI from", value: "₹4k/mo", sublabel: "Subject to approval" },
      { label: "Consult", value: "Free*", sublabel: "Assessment first" },
      { label: "Follow-ups", value: "Included", sublabel: "Package based" },
    ],
  },
  location: {
    eyebrow: "Location",
    heading: "Visit the clinic",
    address:
      "House No. 1, NRI Complex, Chittaranjan Park (CR Park), New Delhi 110019",
    hours: "Mon–Sun · 10:00 AM – 7:00 PM · by appointment",
    phone: "+91 98101 53580",
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=Care+Well+Medical+Centre+Chittaranjan+Park+New+Delhi",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Care+Well+Medical+Centre+Chittaranjan+Park+New+Delhi&z=15&output=embed",
  },
  /** CMS: contactCard.* — ContactCard gallery fixture */
  contactCard: {
    title: "Talk to Care Well",
    address:
      "House No. 1, NRI Complex, Chittaranjan Park (CR Park), New Delhi 110019",
    hours: "Mon–Sun · 10:00 AM – 7:00 PM · by appointment",
    phone: "+91 98101 53580",
    whatsapp: "919810153580",
    callLabel: "Call",
    whatsappLabel: "WhatsApp",
  },
  finalCta: {
    eyebrow: "Next step",
    headline: "Ready to discuss gynecomastia treatment?",
    primaryLabel: "Book Free Consultation",
    primaryHref: "#book",
    secondaryLabel: "Call Now",
    secondaryHref: "tel:+919810153580",
  },
};

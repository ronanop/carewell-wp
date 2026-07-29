/**
 * Populate a full CMS-driven Sanity `service` for hair-transplant-in-delhi
 * using the imported page body + WP structured export copy + all page images.
 *
 * Usage:
 *   node scripts/populate-hair-transplant-service.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const SLUG = "hair-transplant-in-delhi";
const STRUCTURED_PATH =
  "C:/Users/risha/Downloads/carewell-backup-2026-07-28/structured/pages/hair-transplant-in-delhi.json";

function loadEnv() {
  const env = {};
  const p = path.resolve(".env.local");
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function imgRef(assetId, alt, crop) {
  if (!assetId) return undefined;
  const image = {
    _type: "image",
    alt: (alt || "").trim(),
    asset: { _type: "reference", _ref: assetId },
  };
  if (crop) image.crop = crop;
  return image;
}

/** Sanity crop: fraction removed from each edge (0–1). */
const CROP_LEFT_HALF = { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0.5 };
const CROP_RIGHT_HALF = { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0.5, right: 0 };

function blocksFromParagraphs(paragraphs = []) {
  return paragraphs.filter(Boolean).map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

function extractFaqsFromStructured(body = []) {
  const faqs = [];
  let inFaq = false;
  let question = null;
  for (const b of body) {
    if (b.type === "heading" && /faq/i.test(b.text || "")) {
      inFaq = true;
      question = null;
      continue;
    }
    if (inFaq && b.type === "heading") break;
    if (!inFaq || b.type !== "paragraph") continue;
    const text = (b.text || "").trim();
    if (!text) continue;
    if (/\?$/.test(text) && text.length < 200) {
      question = text;
    } else if (question) {
      faqs.push({ _key: key(), question, answer: text });
      question = null;
    }
  }
  return faqs;
}

function sectionByHeading(body, predicate) {
  const paras = [];
  const lists = [];
  let capture = false;
  for (const b of body) {
    if (b.type === "heading") {
      if (capture) break;
      capture = predicate(b.text || "");
      continue;
    }
    if (!capture) continue;
    if (b.type === "paragraph") paras.push(b.text);
    if (b.type === "list") lists.push(...(b.items || []));
  }
  return { paras, lists };
}

function stepDescriptions(body) {
  const map = {};
  let cur = null;
  for (const b of body) {
    if (b.type === "heading" && /^Step\s+\d/i.test(b.text || "")) {
      cur = b.text;
      map[cur] = [];
      continue;
    }
    if (b.type === "heading") {
      cur = null;
      continue;
    }
    if (cur && b.type === "paragraph") map[cur].push(b.text);
  }
  return map;
}

async function main() {
  const env = loadEnv();
  const client = createClient({
    projectId: env.SANITY_PROJECT_ID || "ndeeiwkw",
    dataset: env.SANITY_DATASET || "production",
    token: env.SANITY_API_TOKEN,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  if (!env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN missing in .env.local");
  }

  const structured = JSON.parse(fs.readFileSync(STRUCTURED_PATH, "utf8"));
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, slug, uri, excerpt, legacyId, seo, mainImage, body,
      "bodyImages": body[_type == "bodyImage"]{
        _key, alt,
        "assetId": asset._ref
      }
    }`,
    { slug: SLUG },
  );
  if (!page) throw new Error(`Sanity page not found for slug=${SLUG}`);

  const assetsBySource = Object.fromEntries(
    (
      await client.fetch(
        `*[_type == "sanity.imageAsset" && source.id in $ids]{
          _id, "sourceId": source.id, originalFilename
        }`,
        { ids: structured.assetsUsed || [] },
      )
    ).map((a) => [a.sourceId, a]),
  );

  const asset = (wpId) => assetsBySource[wpId]?._id;
  const nishant = asset("wp-12687");
  const ashwani = asset("wp-14309");
  const baldness = asset("wp-16911");
  const processImg = asset("wp-16915");
  const costImg = asset("wp-16920");
  const doctorPhoto = asset("wp-16800");
  const clinicExterior = asset("wp-16879");

  // Extra BA composites from media library (same page theme)
  const extraBa = await client.fetch(
    `*[_type == "sanity.imageAsset" && (
      originalFilename match "FUE-hair-transplant-before-and-after*" ||
      originalFilename match "*ashwani*before*" ||
      originalFilename match "*nishant*before*"
    )] | order(originalFilename asc) {_id, originalFilename}`,
  );

  const body = structured.body || [];
  const intro = [];
  for (const b of body) {
    if (b.type === "heading") break;
    if (b.type === "paragraph") intro.push(b.text);
  }

  const rightForYou = sectionByHeading(body, (t) => /Is Hair Transplant Right/i.test(t));
  const costSnap = sectionByHeading(body, (t) => /Cost in Delhi \(Quick Snapshot\)/i.test(t));
  const whyChoose = sectionByHeading(body, (t) => /Why Choose Hair Transplant/i.test(t));
  const whenRec = sectionByHeading(body, (t) => /When Doctors Recommend/i.test(t));
  const resultsRep = sectionByHeading(body, (t) => /What These Results Represent/i.test(t));
  const trustOutcomes = sectionByHeading(body, (t) => /Why Patients Trust These Outcomes/i.test(t));
  const fue = sectionByHeading(body, (t) => /FUE Hair Transplant/i.test(t));
  const fut = sectionByHeading(body, (t) => /FUT Hair Transplant/i.test(t));
  const doctorWhy = sectionByHeading(body, (t) => /Why Patients Trust Dr Sandeep/i.test(t));
  const steps = stepDescriptions(body);
  const faqs = extractFaqsFromStructured(body);

  const youtubeIds = [];
  const html = structured.rawHtml || "";
  for (const m of html.matchAll(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/gi,
  )) {
    if (!youtubeIds.includes(m[1])) youtubeIds.push(m[1]);
  }

  const baSources = [
    { id: nishant, initials: "N.K.", alt: "Nishant hair transplant before and after" },
    { id: ashwani, initials: "A.S.", alt: "Ashwani FUT hair transplant before and after" },
    ...extraBa
      .filter((a) => a._id !== nishant && a._id !== ashwani)
      .slice(0, 4)
      .map((a, i) => ({
        id: a._id,
        initials: `P${i + 1}`,
        alt: a.originalFilename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      })),
  ].filter((p) => p.id);

  const existing = await client.fetch(
    `*[_type == "service" && (slug.current == $slug || legacyId == $legacyId)][0]._id`,
    { slug: SLUG, legacyId: page.legacyId },
  );

  const otherServices = await client.fetch(
    `*[_type == "service" && slug.current != $slug] | order(title asc)[0...4]{ _id }`,
    { slug: SLUG },
  );

  const seoTitle =
    page.seo?.title?.replace(/\s*%%sep%%\s*%%sitename%%/gi, "").trim() ||
    "Hair Transplant in Delhi";
  const seoDesc =
    page.seo?.description ||
    page.seo?.metaDesc ||
    structured.seo?.metaDesc ||
    "";

  const overviewBody = [
    ...blocksFromParagraphs(intro),
    ...(baldness
      ? [
          {
            _type: "bodyImage",
            _key: key(),
            alt: "Baldness grades and donor hair availability for hair transplant",
            asset: { _type: "reference", _ref: baldness },
          },
        ]
      : []),
    ...blocksFromParagraphs(whyChoose.paras.slice(0, 3)),
    ...(processImg
      ? [
          {
            _type: "bodyImage",
            _key: key(),
            alt: "Step by step hair transplant process infographic",
            asset: { _type: "reference", _ref: processImg },
          },
        ]
      : []),
    ...(costImg
      ? [
          {
            _type: "bodyImage",
            _key: key(),
            alt: "Hair transplant graft requirement and cost factors explained",
            asset: { _type: "reference", _ref: costImg },
          },
        ]
      : []),
    ...(clinicExterior
      ? [
          {
            _type: "bodyImage",
            _key: key(),
            alt: "Care Well Medical Centre Delhi clinic exterior",
            asset: { _type: "reference", _ref: clinicExterior },
          },
        ]
      : []),
  ];

  const doc = {
    _type: "service",
    title: page.title,
    slug: { _type: "slug", current: page.slug?.current || SLUG },
    uri: page.uri || "/hair-transplant-in-delhi/",
    legacyId: page.legacyId,
    category: "hair",
    excerpt:
      page.excerpt ||
      seoDesc ||
      "Hair transplant in Delhi by Dr Sandeep Bhasin — FUE & FUT at Care Well Medical Centre.",
    seo: {
      title: seoTitle,
      description: seoDesc,
      focusKeyword: structured.seo?.focusKeyword || "Hair Transplant in Delhi",
      breadcrumbsTitle: structured.seo?.breadcrumbsTitle || "Hair Transplant in Delhi",
      noIndex: false,
      ogTitle: structured.seo?.openGraph?.title
        ?.replace(/\s*%%sep%%\s*%%sitename%%/gi, "")
        .trim(),
      ogDescription: structured.seo?.openGraph?.description,
      ogImage: imgRef(
        nishant,
        structured.featuredImage?.alt || "Hair transplant before and after in Delhi",
      ),
      twitterTitle: structured.seo?.twitter?.title
        ?.replace(/\s*%%sep%%\s*%%sitename%%/gi, "")
        .trim(),
      twitterDescription: structured.seo?.twitter?.description,
      twitterImage: imgRef(
        nishant,
        structured.featuredImage?.alt || "Hair transplant before and after in Delhi",
      ),
    },
    hero: {
      heading: "Hair Transplant in Delhi",
      tagline:
        "Advanced FUE & FUT under Dr Sandeep Bhasin — natural hairlines, transparent pricing, and real patient results.",
      image: imgRef(
        nishant || page.mainImage?.asset?._ref,
        page.mainImage?.alt ||
          structured.featuredImage?.alt ||
          "Hair transplant before and after result in Delhi",
      ),
      primaryCtaLabel: "Book Free Consultation",
      secondaryCtaLabel: "WhatsApp",
      quickFacts: [
        { _key: key(), label: "Procedure time", value: "4–8 hours (single day)" },
        { _key: key(), label: "Techniques", value: "FUE · FUT · DHI" },
        { _key: key(), label: "Anaesthesia", value: "Local anaesthesia" },
        { _key: key(), label: "Results timeline", value: "3–12 months growth" },
        { _key: key(), label: "Typical cost", value: "₹40,000 – ₹2,00,000" },
        { _key: key(), label: "Per graft", value: "₹25 – ₹50" },
      ],
      quickFactsNote:
        "Indicative ranges — your graft plan and quote are confirmed after scalp analysis.",
    },
    booking: {
      eyebrow: "Free consult",
      title: "Book FREE hair transplant consultation",
      subtitle:
        "Speak with Care Well about graft estimate, technique, and realistic density for your scalp.",
      submitLabel: "Book Free Consultation",
      nameLabel: "Patient name",
      namePlaceholder: "Full name",
      phoneLabel: "Mobile number",
      phonePlaceholder: "10-digit mobile",
      trustItems: ["100% private", "Reply in ~2 hrs", "No spam"],
      successTitle: "Request received",
      successBody: "We’ll call you shortly on the number you shared.",
      bandEyebrow: "Next step",
      bandHeadline: "Ready for a personalised graft plan?",
      bandBody:
        "Share your details — a Care Well coordinator will schedule a free, private consultation in South Delhi.",
    },
    overview: {
      eyebrow: "Overview",
      heading: "What is hair transplant in Delhi?",
      insightsTitle: "Key insights",
      insightsEyebrow: "Good to know",
      body: overviewBody.length ? overviewBody : (page.body || []).slice(0, 40),
      insights: [
        "Dr Sandeep Bhasin personally plans and supervises every procedure",
        "Custom FUE / FUT / DHI plan after clinical scalp analysis",
        "Transparent counselling on grafts, cost, and natural density",
        "99% success focus with permanent donor follicles",
      ],
      illustration: imgRef(
        baldness || processImg,
        "Baldness grades and donor hair availability for hair transplant",
      ),
    },
    howItWorks: {
      eyebrow: "Process",
      heading: "How hair transplant in Delhi works",
      stepLabel: "Step",
      youtubeId: youtubeIds[0] || "",
      youtubeEyebrow: "Watch",
      youtubeTitle: "Hair transplant explained by Dr Sandeep Bhasin",
      steps: [
        {
          _key: key(),
          title: "Graft extraction",
          description:
            steps["Step 1: Graft Extraction"]?.[0] ||
            "Healthy follicles are taken from the donor zone (usually the back or sides of the scalp) using the planned technique.",
        },
        {
          _key: key(),
          title: "Hairline design",
          description:
            steps["Step 2: Hairline Design"]?.[0] ||
            "The surgeon designs a natural hairline matched to your face shape, age, and long-term baldness pattern.",
        },
        {
          _key: key(),
          title: "Graft implantation",
          description:
            steps["Step 3: Graft Implantation"]?.[0] ||
            "Follicles are placed at the correct angle and density so growth looks natural, not plugged.",
        },
        {
          _key: key(),
          title: "Healing and growth",
          description:
            steps["Step 4: Healing and Growth"]?.[0] ||
            "Initial shedding is normal. New growth typically starts around 3–4 months, with fuller results by 9–12 months.",
        },
      ],
    },
    beforeAfter: {
      eyebrow: "Results",
      heading: "Real hair transplant results in Delhi",
      consentNotice:
        "Images shared with patient consent. Individual results vary based on grafts, hair texture, and healing.",
      pairs: baSources.map((p) => ({
        _key: key(),
        patientInitials: p.initials,
        subtype: "Hair transplant",
        monthsPost: 12,
        before: imgRef(p.id, `${p.alt} — before`, CROP_LEFT_HALF),
        after: imgRef(p.id, `${p.alt} — after`, CROP_RIGHT_HALF),
      })),
    },
    candidacy: {
      eyebrow: "Eligibility",
      heading: "Is hair transplant right for you?",
      goodFitLabel: "Good fit",
      notIdealLabel: "Not ideal yet",
      goodFit: rightForYou.lists.length
        ? rightForYou.lists
        : [
            "Suitable for Grade 2–6 baldness",
            "Permanent hair restoration goals",
            "Customised natural hairline design",
            "Adequate donor hair available",
          ],
      notIdeal: [
        "Unstable / rapidly progressing hair loss without medical review",
        "Insufficient donor supply for the desired coverage",
        "Unrealistic expectations about density or instant results",
        "Uncontrolled medical conditions until cleared by the surgeon",
      ],
      quizCtaLabel: "Book a scalp assessment",
      quizCtaHref: "#book",
    },
    whenRecommended: {
      eyebrow: "Clinical fit",
      heading: "When doctors recommend hair transplant",
      intro:
        "A transplant is recommended when baldness pattern, donor supply, and expectations align — not as a first reflex for every hair-fall case.",
      items: whenRec.lists.length
        ? whenRec.lists
        : [
            "Grade 2–6 baldness with visible thinning or bald patches",
            "Adequate donor hair available for transplantation",
            "Realistic expectations regarding density and growth timeline",
          ],
    },
    whyChooseUs: {
      eyebrow: "Why Care Well",
      heading: "Why choose hair transplant in Delhi at Care Well",
      intro: whyChoose.paras[0] || undefined,
      items: [
        "Surgeon-led planning — not technician-only sessions",
        "Transparent graft estimate before you decide",
        "FUE, FUT and DHI options matched to your scalp",
        "South Delhi clinic with easy Delhi NCR access",
        "Focus on natural hairline, not artificial density",
      ],
    },
    expectations: {
      eyebrow: "Outcomes",
      heading: "What these results represent",
      intro: "Patient transformations at Care Well Medical Centre reflect careful planning — not stock imagery.",
      items: resultsRep.lists.length
        ? resultsRep.lists
        : [
            "Natural hairline reconstruction",
            "Gradual growth over several months",
            "Doctor-performed procedures, not technician-led",
          ],
    },
    evidence: {
      eyebrow: "Evidence",
      heading: "Why patients trust these outcomes",
      items: trustOutcomes.lists.length
        ? trustOutcomes.lists
        : [
            "No stock images or exaggerated promises",
            "Results vary based on graft number, hair texture, and healing response",
            "Focus on natural appearance, not artificial density",
          ],
    },
    benefits: {
      eyebrow: "Benefits",
      heading: "Benefits of a planned hair transplant",
      items: [
        "Permanent follicles from genetically resistant donor zones",
        "Natural-looking hairline when angle and density are planned correctly",
        "Single-day procedure under local anaesthesia for most cases",
        "Option to combine with PRP for graft support where appropriate",
      ],
    },
    preparation: {
      eyebrow: "Before surgery",
      heading: "How to prepare for hair transplant",
      items: [
        "Complete consultation and scalp analysis for graft estimate",
        "Share medical history, medications, and prior hair treatments",
        "Follow pre-op instructions on alcohol, smoking, and blood thinners as advised",
        "Plan rest for the day of surgery and early recovery",
      ],
    },
    recovery: {
      eyebrow: "Recovery",
      heading: "Healing and growth timeline",
      items: [
        "Mild discomfort for a few days — usually managed with prescribed medication",
        "Initial shedding of transplanted hair is normal",
        "New growth typically begins around 3–4 months",
        "Visible improvement by ~6 months; final density often by 9–12 months",
      ],
    },
    risks: {
      eyebrow: "Safety",
      heading: "Risks and realistic limitations",
      items: [
        "Temporary redness, swelling, or scabbing in donor/recipient areas",
        "Density depends on available grafts — not every scalp can be fully covered in one session",
        "Shock loss of existing hair can occur temporarily",
        "Infection or poor growth is uncommon when aftercare is followed",
      ],
    },
    treatmentOptions: {
      eyebrow: "Techniques",
      heading: "Which technique is best? FUE vs FUT",
      options: [
        {
          _key: key(),
          title: "FUE hair transplant",
          description:
            fue.paras.filter((p) => !p.startsWith("👉"))[0] ||
            "Stitch-free extraction with micro-punches from the donor area — shorter recovery for many patients.",
          bullets: [
            "Minimal linear scarring",
            "Often faster return to routine",
            "Micro-punch donor extraction",
          ],
        },
        {
          _key: key(),
          title: "FUT hair transplant",
          description:
            fut.paras.filter((p) => !p.startsWith("👉"))[0] ||
            "Strip-based graft harvest when a higher graft count is needed in selected cases.",
          bullets: [
            "Higher graft yields in selected cases",
            "Useful for larger coverage plans",
            "Surgeon decides based on donor supply",
          ],
        },
      ],
    },
    technology: {
      eyebrow: "Technology",
      heading: "Techniques used at Care Well",
      techniques: [
        {
          _key: key(),
          title: "FUE",
          description:
            "Follicular Unit Extraction with micro-punch tools under local anaesthesia.",
        },
        {
          _key: key(),
          title: "FUT",
          description:
            "Follicular Unit Transplantation for higher graft yields when clinically indicated.",
        },
        {
          _key: key(),
          title: "DHI",
          description:
            "Direct implantation approach discussed when it suits density and hairline goals.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      heading: "Hair transplant cost in Delhi",
      startingFromLabel: "Typical range",
      startingFrom: "₹40,000 – ₹2,00,000",
      factorsHeading: "What affects cost",
      factors: costSnap.lists.length
        ? costSnap.lists
        : [
            "Per graft cost: ₹25 – ₹50",
            "Typical total cost: ₹40,000 – ₹2,00,000 (approx.)",
            "5000 grafts: roughly ₹1,25,000 – ₹2,00,000",
            "Technique, density planning, and graft quality",
          ],
      includedHeading: "Discussed before surgery",
      whatsIncluded: [
        "Surgeon consultation and scalp analysis",
        "Transparent graft estimate",
        "Procedure plan for FUE / FUT / DHI as advised",
        "Aftercare guidance and follow-ups",
      ],
      emiNote: "EMI options may be available — ask during consultation.",
      ctaLabel: "Get Personalized Quote",
      ctaHref: "#book",
    },
    costSnapshot: {
      eyebrow: "Cost snapshot",
      heading: "Indicative hair transplant cost in Delhi",
      cards: [
        {
          _key: key(),
          label: "Per graft",
          value: "₹25 – ₹50",
          sublabel: "Depends on planning complexity",
        },
        {
          _key: key(),
          label: "Typical total",
          value: "₹40K – ₹2L",
          sublabel: "Most patients fall in this band",
        },
        {
          _key: key(),
          label: "~5000 grafts",
          value: "₹1.25L – ₹2L",
          sublabel: "Approx. for larger sessions",
        },
      ],
    },
    emi: {
      eyebrow: "EMI",
      title: "Plan treatment with EMI",
      amountLabel: "Treatment amount (₹)",
      tenureLabel: "Tenure (months)",
      resultLabel: "Estimated monthly EMI",
      disclaimer:
        "Illustrative only. Final EMI terms depend on financing partner approval at consultation.",
      ctaLabel: "Discuss EMI options with Carewell team",
      ctaHref: "#book",
      defaultAmount: 100000,
      defaultMonths: 12,
      annualRatePct: 12,
    },
    doctor: {
      eyebrow: "Surgeon",
      heading: "Meet Dr Sandeep Bhasin",
      name: "Dr Sandeep Bhasin",
      role: "Senior cosmetic & aesthetic surgeon · Care Well Medical Centre, Delhi",
      credentials: ["Cosmetic surgery", "Hair transplant", "Aesthetic medicine"],
      bio: (
        doctorWhy.paras.filter((p) => !p.startsWith("👉")).length
          ? doctorWhy.paras.filter((p) => !p.startsWith("👉"))
          : [
              "Dr Sandeep Bhasin personally plans and supervises every hair transplant for safe, natural outcomes.",
            ]
      ).slice(0, 4),
      photo: imgRef(
        doctorPhoto,
        "Dr Sandeep Bhasin, senior cosmetic and aesthetic surgeon at Care Well Medical Centre in Delhi",
      ),
      ctaLabel: "Book with Dr Bhasin",
      ctaHref: "#book",
    },
    testimonialsSection: {
      eyebrow: "Patients",
      heading: "Hair transplant videos & patient stories",
      videoEnabled: youtubeIds.length > 0,
      videoEyebrow: "Watch",
      videoHeading: "Explained by Dr Sandeep Bhasin",
      items: [],
      videos: youtubeIds.slice(0, 4).map((id, i) => ({
        _key: key(),
        youtubeId: id,
        title: i === 0 ? "Hair transplant explained" : `Patient video ${i + 1}`,
      })),
    },
    faqs,
    faqEyebrow: "FAQs",
    faqHeading: "FAQs about hair transplant in Delhi",
    faqEmitJsonLd: true,
    related: {
      eyebrow: "Explore",
      heading: "Related services",
      services: otherServices.map((s) => ({
        _type: "reference",
        _key: key(),
        _ref: s._id,
      })),
    },
    location: {
      eyebrow: "Visit us",
      heading: "Hair transplant clinic in South Delhi",
      address: "Care Well Medical Centre, Chittaranjan Park, South Delhi",
      hours: "Mon–Sat · by appointment",
      phone: "+91 98101 53580",
      mapHref: "https://maps.google.com/?q=Care+Well+Medical+Centre+Chittaranjan+Park",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5!2d77.25!3d28.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCare%20Well%20Medical%20Centre!5e0!3m2!1sen!2sin!4v1",
    },
    contactCard: {
      title: "Care Well Medical Centre",
      address: "Chittaranjan Park, South Delhi",
      hours: "Mon–Sat · by appointment",
      phone: "+91 98101 53580",
      whatsapp: "919810153580",
      callLabel: "Call clinic",
      whatsappLabel: "WhatsApp",
    },
    finalCta: {
      eyebrow: "Next step",
      headline: "Book a hair transplant consultation in Delhi",
      primaryLabel: "Book Free Consultation",
      primaryHref: "#book",
      secondaryLabel: "Call Now",
      secondaryHref: "tel:+919810153580",
    },
    // Keep full portable text body for editors / future blocks
    body: page.body || [],
  };

  // Attach clinic exterior into location isn't a field — store as unused? 
  // Put exterior on overview if baldness missing, else keep gallery via body images already included.
  if (clinicExterior && !doc.overview.illustration) {
    doc.overview.illustration = imgRef(
      clinicExterior,
      "Care Well Medical Centre Delhi clinic exterior",
    );
  }

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Care Well Medical Centre",
    phone: "+91 98101 53580",
    whatsapp: "919810153580",
    helloBarText: "Free hair transplant consultation — Limited slots.",
    address: "Chittaranjan Park, South Delhi",
  });

  let id;
  if (existing) {
    await client.patch(existing).set(doc).commit();
    id = existing;
    console.log("Updated service", id);
  } else {
    const created = await client.create(doc);
    id = created._id;
    console.log("Created service", id);
  }

  const imageReport = {
    hero: !!nishant,
    baldness: !!baldness,
    process: !!processImg,
    cost: !!costImg,
    doctor: !!doctorPhoto,
    clinic: !!clinicExterior,
    ashwani: !!ashwani,
    baPairs: doc.beforeAfter.pairs.length,
    faqs: faqs.length,
    youtubeIds,
    assetsUsed: structured.assetsUsed,
  };
  console.log("Images / content:", JSON.stringify(imageReport, null, 2));
  console.log(`Preview: http://localhost:3001${page.uri || `/${SLUG}/`}`);
  console.log(`(legacy redirect) http://localhost:3001/sanity/service/${SLUG}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

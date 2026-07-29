/**
 * Rich-populate Sanity `service` for gynecomastia (same quality as hair-transplant).
 *
 * Usage:
 *   node scripts/populate-gynecomastia-service.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const SLUG = "gynecomastia";
const STRUCTURED_PATH =
  "C:/Users/risha/Downloads/carewell-backup-2026-07-28/structured/pages/gynecomastia.json";

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

function stripEmoji(s = "") {
  return s
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu,
      "",
    )
    .replace(/^[❌🔹🧠📝🔍📞👨‍⚕️🎥💬📌🕒⏳🥗🏋️🚭🧘💡💰✅🚫]+\s*/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function imgRef(assetId, alt, crop) {
  if (!assetId) return undefined;
  const image = {
    _type: "image",
    alt: stripEmoji(alt || ""),
    asset: { _type: "reference", _ref: assetId },
  };
  if (crop) image.crop = crop;
  return image;
}

const CROP_LEFT_HALF = {
  _type: "sanity.imageCrop",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0.5,
};
const CROP_RIGHT_HALF = {
  _type: "sanity.imageCrop",
  top: 0,
  bottom: 0,
  left: 0.5,
  right: 0,
};

function blocksFromParagraphs(paragraphs = []) {
  return paragraphs
    .map((t) => stripEmoji(t))
    .filter(Boolean)
    .map((text) => ({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text, marks: [] }],
    }));
}

function sectionByHeading(body, predicate) {
  const paras = [];
  const lists = [];
  let capture = false;
  for (const b of body) {
    if (b.type === "heading") {
      if (capture) break;
      capture = predicate(stripEmoji(b.text || ""));
      continue;
    }
    if (!capture) continue;
    if (b.type === "paragraph") paras.push(stripEmoji(b.text));
    if (b.type === "list")
      lists.push(...(b.items || []).map((i) => stripEmoji(i)));
  }
  return { paras, lists };
}

function extractFaqs(body = []) {
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
    const text = stripEmoji(b.text || "");
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

function extractMythPairs(body = []) {
  const pairs = [];
  let myth = null;
  let inMyths = false;
  for (const b of body) {
    if (b.type === "heading" && /myths?\s+vs\s+facts/i.test(b.text || "")) {
      inMyths = true;
      continue;
    }
    if (inMyths && b.type === "heading" && /need help|trust care well|exploring the benefits/i.test(b.text || "")) {
      break;
    }
    if (!inMyths) continue;
    if (b.type === "heading" && /myth/i.test(b.text || "")) {
      myth = stripEmoji(b.text || "").replace(/^Myth\s*\d*:?\s*/i, "");
      continue;
    }
    if (myth && b.type === "paragraph") {
      const fact = stripEmoji(b.text || "");
      if (fact) {
        pairs.push({ _key: key(), myth, fact });
        myth = null;
      }
    }
  }
  return pairs.slice(0, 8);
}

function extractMistakes(body = []) {
  const items = [];
  let capture = false;
  for (const b of body) {
    if (b.type === "heading" && /don.?t commit these mistakes/i.test(b.text || "")) {
      capture = true;
      continue;
    }
    if (capture && b.type === "heading" && /what if i leave|best treatment/i.test(b.text || "")) {
      break;
    }
    if (!capture) continue;
    if (b.type === "heading" && /mistake/i.test(b.text || "")) {
      items.push(stripEmoji(b.text || "").replace(/^Mistake\s*\d*:?\s*/i, ""));
    }
  }
  return items;
}

async function main() {
  const env = loadEnv();
  if (!env.SANITY_API_TOKEN) throw new Error("SANITY_API_TOKEN missing");

  const client = createClient({
    projectId: env.SANITY_PROJECT_ID || "ndeeiwkw",
    dataset: env.SANITY_DATASET || "production",
    token: env.SANITY_API_TOKEN,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  const structured = JSON.parse(fs.readFileSync(STRUCTURED_PATH, "utf8"));
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, slug, uri, excerpt, legacyId, seo, mainImage, body,
      "bodyImages": body[_type == "bodyImage"]{ _key, alt, "assetId": asset._ref }
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
  const grade3 = asset("wp-12369");
  const baPhoto = asset("wp-5476");
  const clinic = asset("wp-4352");
  const doctorPhoto = asset("wp-4321");

  // Extra BA images from library
  const extraBa = await client.fetch(
    `*[_type == "sanity.imageAsset" && (
      originalFilename match "*gynecomastia*before*" ||
      originalFilename match "*gynecomastia*after*" ||
      originalFilename match "*Gynecomastia*Before*"
    )] | order(originalFilename asc)[0...6]{_id, originalFilename}`,
  );

  const body = structured.body || [];
  const intro = [];
  for (const b of body) {
    if (b.type === "heading") break;
    if (b.type === "paragraph") intro.push(stripEmoji(b.text));
  }

  const whatIs = sectionByHeading(body, (t) => /^What is Gynecomastia/i.test(t));
  const causes = sectionByHeading(body, (t) => /What Causes Gynecomastia/i.test(t));
  const diagnosis = sectionByHeading(body, (t) => /Diagnosis Process/i.test(t));
  const benefits = sectionByHeading(body, (t) => /Exploring the Benefits/i.test(t));
  const recommended = sectionByHeading(body, (t) => /Patients Who are Recommended/i.test(t));
  const untreated = sectionByHeading(body, (t) => /Leave Gynecomastia Untreated/i.test(t));
  const whyTrust = sectionByHeading(body, (t) => /Why Trust Our Gynecomastia/i.test(t));
  const whyChoose = sectionByHeading(body, (t) => /Why Choose Care Well Medical Centre for Gynecomastia/i.test(t));
  const lipo = sectionByHeading(body, (t) => /Liposuction Surgery/i.test(t));
  const excision = sectionByHeading(body, (t) => /Excisional Surgery/i.test(t));
  const combined = sectionByHeading(body, (t) => /Combined Surgery/i.test(t));
  const prep = sectionByHeading(body, (t) => /Pre-Surgery Checklist/i.test(t));
  const recovery = sectionByHeading(body, (t) => /Step-by-Step Recovery/i.test(t));
  const risks = sectionByHeading(body, (t) => /Potential Risks/i.test(t));
  const cost = sectionByHeading(body, (t) => /Gynecomastia Surgery Price|Cost of Gynecomastia/i.test(t));
  const procedure = sectionByHeading(body, (t) => /Gynecomastia Surgery Procedure at Care Well/i.test(t));

  const faqs = extractFaqs(body);
  const myths = extractMythPairs(body);
  const mistakes = extractMistakes(body);

  const youtubeIds = [];
  const html = structured.rawHtml || "";
  for (const m of html.matchAll(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/gi,
  )) {
    if (!youtubeIds.includes(m[1])) youtubeIds.push(m[1]);
  }

  const baSources = [
    {
      id: grade3,
      initials: "G3",
      alt: "Gynecomastia grade 3 before and after result in Delhi",
    },
    {
      id: baPhoto,
      initials: "P1",
      alt: "Gynecomastia before and after at Care Well Medical Centre",
    },
    ...extraBa
      .filter((a) => a._id !== grade3 && a._id !== baPhoto)
      .slice(0, 4)
      .map((a, i) => ({
        id: a._id,
        initials: `P${i + 2}`,
        alt: a.originalFilename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      })),
  ].filter((p) => p.id);

  const existing = await client.fetch(
    `*[_type == "service" && (slug.current == $slug || legacyId == $legacyId)][0]._id`,
    { slug: SLUG, legacyId: page.legacyId },
  );

  const otherServices = await client.fetch(
    `*[_type == "service" && slug.current != $slug] | order(title asc)[0...4]{_id}`,
    { slug: SLUG },
  );

  const seoTitle =
    page.seo?.title?.replace(/\s*%%sep%%\s*%%sitename%%/gi, "").trim() ||
    "Gynecomastia Surgery in Delhi";
  const seoDesc =
    page.seo?.description ||
    structured.seo?.metaDesc ||
    "Gynecomastia surgery in Delhi by Dr Sandeep Bhasin — male chest reduction with natural masculine results at Care Well Medical Centre.";

  const overviewBody = [
    ...blocksFromParagraphs(intro.slice(0, 3)),
    ...blocksFromParagraphs(whatIs.paras.slice(0, 3)),
    ...(grade3
      ? [
          {
            _type: "bodyImage",
            _key: key(),
            alt: "Gynecomastia Surgery in Delhi Grade 3 Before and after Result",
            asset: { _type: "reference", _ref: grade3 },
          },
        ]
      : []),
    ...blocksFromParagraphs(whyTrust.paras.slice(0, 2)),
    ...(clinic
      ? [
          {
            _type: "bodyImage",
            _key: key(),
            alt: "Care Well Medical Centre Clinic",
            asset: { _type: "reference", _ref: clinic },
          },
        ]
      : []),
  ];

  const doc = {
    _type: "service",
    title: page.title,
    slug: { _type: "slug", current: page.slug?.current || SLUG },
    uri: page.uri || "/plastic-surgery-in-delhi/gynecomastia/",
    legacyId: page.legacyId,
    category: "body",
    excerpt:
      page.excerpt ||
      seoDesc ||
      "Male breast reduction (gynecomastia surgery) in Delhi by Dr Sandeep Bhasin.",
    seo: {
      title: seoTitle,
      description: seoDesc,
      focusKeyword: structured.seo?.focusKeyword || "Gynecomastia Surgery in Delhi",
      breadcrumbsTitle: structured.seo?.breadcrumbsTitle || "Gynecomastia",
      noIndex: false,
      ogTitle: structured.seo?.openGraph?.title
        ?.replace(/\s*%%sep%%\s*%%sitename%%/gi, "")
        .trim(),
      ogDescription: structured.seo?.openGraph?.description,
      ogImage: imgRef(
        grade3 || baPhoto,
        "Gynecomastia before and after results in Delhi",
      ),
    },
    hero: {
      heading: "Gynecomastia Surgery in Delhi",
      tagline:
        "Male chest reduction under Dr Sandeep Bhasin — flatter, natural contours with discreet scars and structured recovery.",
      image: imgRef(
        grade3 || baPhoto,
        "Gynecomastia Surgery in Delhi Grade 3 Before and after Result",
      ),
      primaryCtaLabel: "Book Free Consultation",
      secondaryCtaLabel: "WhatsApp",
      quickFacts: [
        { _key: key(), label: "Procedure time", value: "1–3 hours (typical)" },
        { _key: key(), label: "Anaesthesia", value: "Local / as advised" },
        { _key: key(), label: "Techniques", value: "Lipo · Excision · Combined" },
        { _key: key(), label: "Recovery", value: "Days to weeks (graded)" },
        { _key: key(), label: "Scars", value: "Minimal, discreet placement" },
        { _key: key(), label: "Results", value: "Flatter masculine chest" },
      ],
      quickFactsNote:
        "Typical ranges — your grade, technique, and plan are confirmed after consultation.",
    },
    booking: {
      eyebrow: "Free consult",
      title: "Book FREE gynecomastia consultation",
      subtitle:
        "Speak with Care Well about grade assessment, technique, and a realistic recovery plan.",
      submitLabel: "Book Free Consultation",
      nameLabel: "Patient name",
      namePlaceholder: "Full name",
      phoneLabel: "Mobile number",
      phonePlaceholder: "10-digit mobile",
      trustItems: ["100% private", "Reply in ~2 hrs", "No spam"],
      successTitle: "Request received",
      successBody: "We'll call you shortly on the number you shared.",
      bandEyebrow: "Next step",
      bandHeadline: "Ready for a flatter, masculine chest plan?",
      bandBody:
        "Share your details — a Care Well coordinator will schedule a free, private consultation in South Delhi.",
    },
    overview: {
      eyebrow: "Overview",
      heading: "What is gynecomastia?",
      insightsTitle: "Key insights",
      insightsEyebrow: "Good to know",
      body: overviewBody.length ? overviewBody : (page.body || []).slice(0, 40),
      insights: [
        "Dr Sandeep Bhasin personally plans male chest reduction",
        "Liposuction, excision, or combined — matched to your grade",
        "Focus on natural masculine contour and discreet scars",
        "South Delhi clinic with transparent counselling",
      ],
    },
    howItWorks: {
      eyebrow: "Process",
      heading: "Gynecomastia surgery process at Care Well",
      stepLabel: "Step",
      youtubeId: youtubeIds[0] || "",
      youtubeEyebrow: "Watch",
      youtubeTitle: "Gynecomastia surgery explained",
      steps: [
        {
          _key: key(),
          title: "Consultation & exam",
          description:
            procedure.paras[0] ||
            "Clinical assessment to confirm gland vs fat (pseudo-gynecomastia) and grade your case.",
        },
        {
          _key: key(),
          title: "Surgical plan",
          description:
            "Technique selection — liposuction, excision, or combined — based on tissue type and skin quality.",
        },
        {
          _key: key(),
          title: "Procedure day",
          description:
            "Daycare surgery under appropriate anaesthesia with discreet incision planning.",
        },
        {
          _key: key(),
          title: "Recovery & aftercare",
          description:
            recovery.paras[0] ||
            "Compression, activity guidance, and follow-ups until the chest contour settles.",
        },
      ],
    },
    beforeAfter: {
      eyebrow: "Results",
      heading: "Gynecomastia before & after results",
      consentNotice:
        "Images shared with patient consent. Individual results vary by grade, technique, and healing.",
      pairs: baSources.map((p) => ({
        _key: key(),
        patientInitials: p.initials,
        subtype: "Gynecomastia",
        monthsPost: 3,
        before: imgRef(p.id, `${p.alt} — before`, CROP_LEFT_HALF),
        after: imgRef(p.id, `${p.alt} — after`, CROP_RIGHT_HALF),
      })),
    },
    candidacy: {
      eyebrow: "Eligibility",
      heading: "Am I a candidate for male chest reduction?",
      goodFitLabel: "Good fit",
      notIdealLabel: "Not ideal yet",
      goodFit: recommended.lists.length
        ? recommended.lists.slice(0, 6)
        : [
            "Persistent chest fullness after diet and exercise",
            "Confirmed glandular and/or fatty tissue on exam",
            "Realistic expectations about contour and scars",
            "Ready to follow compression and recovery guidance",
          ],
      notIdeal: [
        "Unstable medical conditions until cleared",
        "Expectation of zero recovery downtime",
        "Active untreated hormonal issue without workup",
        "Unwilling to wear compression garment as advised",
      ],
      quizCtaLabel: "Book a chest assessment",
      quizCtaHref: "#book",
    },
    causes: {
      eyebrow: "Causes",
      heading: "What causes gynecomastia in men?",
      intro: causes.paras[0],
      items: causes.lists.length
        ? causes.lists.slice(0, 8)
        : [
            "Hormonal imbalance (estrogen–androgen)",
            "Puberty-related changes that don't settle",
            "Medications or substances that affect hormones",
            "Obesity-related fat with or without gland",
            "Genetics and idiopathic cases",
          ],
    },
    diagnosis: {
      eyebrow: "Diagnosis",
      heading: "How gynecomastia is diagnosed",
      intro: diagnosis.paras[0],
      items: [
        "Consultation and physical examination",
        "Blood tests / imaging when indicated",
        "Additional tests only if clinically needed",
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      heading: "Benefits of gynecomastia surgery",
      intro: benefits.paras[0],
      items: benefits.lists.length
        ? benefits.lists.slice(0, 8)
        : [
            "Flatter, more masculine chest contour",
            "Better fit in clothing and swimwear",
            "Improved confidence in social and gym settings",
            "Addresses gland that exercise alone cannot remove",
          ],
    },
    preparation: {
      eyebrow: "Before surgery",
      heading: "Pre-surgery checklist",
      intro: prep.paras[0],
      items: prep.lists.length
        ? prep.lists.slice(0, 8)
        : [
            "Complete medical history and medications review",
            "Follow advice on smoking, alcohol, and blood thinners",
            "Arrange compression garment and rest support at home",
            "Clarify grade, technique, and scar expectations",
          ],
    },
    recovery: {
      eyebrow: "Recovery",
      heading: "Recovery after male breast reduction",
      intro: recovery.paras[0],
      items: recovery.lists.length
        ? recovery.lists.slice(0, 8)
        : [
            "First 1–2 days: rest, compression, mild discomfort control",
            "Days 3–14: short-term healing and gradual activity",
            "Weeks 3–8: contour settles; return to exercise as cleared",
            "Follow surgeon guidance on gym and heavy lifting",
          ],
    },
    risks: {
      eyebrow: "Safety",
      heading: "Potential risks of gynecomastia surgery",
      intro: risks.paras[0],
      items: risks.lists.length
        ? risks.lists.slice(0, 8)
        : [
            "Temporary swelling, bruising, or numbness",
            "Asymmetry or contour irregularity (uncommon with planning)",
            "Fluid collection or delayed healing",
            "Visible scarring if skin resection is required in severe grades",
          ],
    },
    untreatedRisks: {
      eyebrow: "If untreated",
      heading: "What if I leave gynecomastia untreated?",
      intro: untreated.paras[0],
      items: untreated.lists.length
        ? untreated.lists.slice(0, 6)
        : [
            "Condition can worsen or persist with time",
            "Confidence and clothing comfort may suffer",
            "Exercise alone often does not fix true glandular tissue",
            "Underlying causes may need medical review",
          ],
    },
    mistakesToAvoid: {
      eyebrow: "Avoid",
      heading: "Mistakes to avoid with gynecomastia",
      items: mistakes.length
        ? mistakes
        : [
            "Waiting too long hoping swelling will vanish",
            "Trying only to burn it off at the gym",
            "Choosing the cheapest clinic without research",
            "Feeling too ashamed to seek a proper consult",
          ],
    },
    whenRecommended: {
      eyebrow: "Clinical fit",
      heading: "When doctors recommend surgery",
      items: recommended.lists.length
        ? recommended.lists.slice(0, 6)
        : [
            "Persistent enlargement after observation period",
            "Confirmed glandular tissue on exam",
            "Distress about chest appearance affecting daily life",
          ],
    },
    whyChooseUs: {
      eyebrow: "Why Care Well",
      heading: "Why choose Care Well for gynecomastia in Delhi",
      intro: whyChoose.paras[0] || whyTrust.paras[0],
      items: [
        "Surgeon-led male chest reduction — not technician-only",
        "Grade-based technique planning (lipo / excision / combined)",
        "Focus on masculine contour and discreet scars",
        "Transparent counselling on cost and recovery",
        "South Delhi clinic with easy Delhi NCR access",
      ],
    },
    myths: {
      eyebrow: "Myths vs facts",
      heading: "Understanding myths vs facts",
      mythLabel: "Myth",
      factLabel: "Fact",
      pairs: myths,
    },
    treatmentOptions: {
      eyebrow: "Options",
      heading: "Best treatment options for male breast reduction",
      options: [
        {
          _key: key(),
          title: "Liposuction",
          description:
            lipo.paras.filter((p) => p && !p.startsWith("http"))[0] ||
            "Removes excess fatty tissue when the chest fullness is mainly fat.",
          bullets: ["Often preferred for fatty predominance", "Smaller entry points", "Shorter recovery for many patients"],
        },
        {
          _key: key(),
          title: "Excisional surgery",
          description:
            excision.paras[0] ||
            "Removes firm glandular tissue that liposuction alone cannot clear.",
          bullets: ["Targets true breast gland", "Precise contouring around the areola", "Used when gland is dominant"],
        },
        {
          _key: key(),
          title: "Combined approach",
          description:
            combined.paras[0] ||
            "Liposuction plus excision for mixed fat and gland — common in real-world grades.",
          bullets: ["Addresses mixed tissue types", "Balanced masculine contour", "Plan matched after exam"],
        },
      ],
    },
    technology: {
      eyebrow: "Techniques",
      heading: "Surgical techniques used",
      techniques: [
        {
          _key: key(),
          title: "Webster / intra-areolar incision",
          description: "Discreet approach around the areola for gland removal in selected cases.",
        },
        {
          _key: key(),
          title: "Minimally invasive pull-through",
          description: "Reduced incision strategy when tissue and skin quality allow.",
        },
        {
          _key: key(),
          title: "Ultrasonic liposuction",
          description: "Assists fat emulsification for smoother contouring when indicated.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      heading: "Gynecomastia surgery cost in Delhi",
      startingFromLabel: "Typical range",
      startingFrom: "Custom quote after grade assessment",
      factorsHeading: "What affects cost",
      factors: cost.lists.length
        ? cost.lists.slice(0, 6)
        : [
            "Grade and amount of gland vs fat",
            "Technique (lipo / excision / combined)",
            "Anaesthesia and facility needs",
            "Whether skin tightening is required",
          ],
      includedHeading: "Discussed before surgery",
      whatsIncluded: [
        "Surgeon consultation and chest exam",
        "Transparent technique recommendation",
        "Procedure plan and aftercare guidance",
        "Follow-up support during recovery",
      ],
      emiNote: "EMI options may be available — ask during consultation.",
      ctaLabel: "Get Personalized Quote",
      ctaHref: "#book",
    },
    costSnapshot: {
      eyebrow: "Cost snapshot",
      heading: "Cost at a glance",
      cards: [
        {
          _key: key(),
          label: "Assessment",
          value: "Free consult",
          sublabel: "Grade & technique discussion",
        },
        {
          _key: key(),
          label: "Quote",
          value: "Personalized",
          sublabel: "Based on your clinical plan",
        },
        {
          _key: key(),
          label: "EMI",
          value: "Available*",
          sublabel: "Ask at consultation",
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
      defaultAmount: 80000,
      defaultMonths: 12,
      annualRatePct: 12,
    },
    doctor: {
      eyebrow: "Surgeon",
      heading: "Meet Dr Sandeep Bhasin",
      name: "Dr Sandeep Bhasin",
      role: "Senior cosmetic & aesthetic surgeon · Care Well Medical Centre, Delhi",
      credentials: ["Cosmetic surgery", "Male chest reduction", "Aesthetic medicine"],
      bio: [
        "Dr Sandeep Bhasin leads gynecomastia care at Care Well with a focus on safe technique selection and natural masculine contour.",
        ...(whyChoose.paras.filter((p) => p && !/^book|^call/i.test(p)).slice(0, 2)),
      ].slice(0, 4),
      photo: imgRef(
        doctorPhoto,
        "Dr Sandeep Bhasin, gynecomastia surgeon in Delhi",
      ),
      ctaLabel: "Book with Dr Bhasin",
      ctaHref: "#book",
    },
    testimonialsSection: {
      eyebrow: "Patients",
      heading: "Patient stories & videos",
      videoEnabled: youtubeIds.length > 0,
      videoEyebrow: "Watch",
      videoHeading: "Gynecomastia video testimonials",
      items: [],
      videos: youtubeIds.slice(0, 6).map((id, i) => ({
        _key: key(),
        youtubeId: id,
        title: i === 0 ? "Gynecomastia patient story" : `Patient video ${i + 1}`,
      })),
    },
    faqs,
    faqEyebrow: "FAQs",
    faqHeading: "Gynecomastia FAQs",
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
      heading: "Gynecomastia clinic in South Delhi",
      address: "Care Well Medical Centre, Chittaranjan Park, South Delhi",
      hours: "Mon–Sat · by appointment",
      phone: "+91 98101 53580",
      mapHref: "https://maps.google.com/?q=Care+Well+Medical+Centre+Chittaranjan+Park",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5!2d77.25!3d28.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCare%20Well%20Medical%20Centre!5e0!3m2!1sen!2sin!4v1",
    },
    finalCta: {
      eyebrow: "Next step",
      headline: "Book a gynecomastia consultation in Delhi",
      primaryLabel: "Book Free Consultation",
      primaryHref: "#book",
      secondaryLabel: "Call Now",
      secondaryHref: "tel:+919810153580",
    },
    body: page.body || [],
  };

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Care Well Medical Centre",
    phone: "+91 98101 53580",
    whatsapp: "919810153580",
    helloBarText: "Free gynecomastia consultation — Limited slots.",
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

  console.log(
    JSON.stringify(
      {
        hero: !!doc.hero.image,
        baPairs: doc.beforeAfter.pairs.length,
        faqs: faqs.length,
        myths: myths.length,
        mistakes: doc.mistakesToAvoid.items.length,
        videos: youtubeIds.length,
        doctor: !!doctorPhoto,
        assets: structured.assetsUsed,
      },
      null,
      2,
    ),
  );
  console.log(`Preview: http://localhost:3001${doc.uri}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Rich-populate Sanity `service` docs from WP backup + Sanity page/assets.
 * Same quality bar as hair-transplant / gynecomastia populate scripts.
 *
 * Usage:
 *   node scripts/populate-service-from-backup.mjs --slug rhinoplasty
 *   node scripts/populate-service-from-backup.mjs --batch 1
 *   node scripts/populate-service-from-backup.mjs --all --limit 5
 *   node scripts/populate-service-from-backup.mjs --uri /plastic-surgery-in-delhi/rhinoplasty/
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const BACKUP_DIR =
  "C:/Users/risha/Downloads/carewell-backup-2026-07-28/structured/pages";
const LIST_PATH = path.resolve("scripts/data/service-pages-remaining.json");

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
  return String(s)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function imgRef(assetId, alt, crop) {
  if (!assetId) return undefined;
  const image = {
    _type: "image",
    alt: stripEmoji(alt || "Care Well Medical Centre"),
    asset: { _type: "reference", _ref: assetId },
  };
  if (crop) image.crop = crop;
  return image;
}

const CROP_LEFT = {
  _type: "sanity.imageCrop",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0.5,
};
const CROP_RIGHT = {
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
      lists.push(...(b.items || []).map((i) => stripEmoji(String(i))));
  }
  return { paras, lists };
}

function collectListsMatching(body, predicate, max = 8) {
  const items = [];
  let capture = false;
  for (const b of body) {
    if (b.type === "heading") {
      capture = predicate(stripEmoji(b.text || ""));
      continue;
    }
    if (capture && b.type === "list") {
      items.push(...(b.items || []).map((i) => stripEmoji(String(i))));
    }
  }
  return [...new Set(items.filter(Boolean))].slice(0, max);
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
    if (inFaq && b.type === "heading" && !/\?$/.test(b.text || "")) {
      // stay in FAQ region for subheads that are questions
      if (!/faq/i.test(b.text || "") && (b.text || "").length < 160 && /\?$/.test(stripEmoji(b.text || ""))) {
        question = stripEmoji(b.text || "");
        continue;
      }
      if (!/\?/.test(b.text || "")) break;
    }
    if (!inFaq) continue;
    if (b.type === "heading" && /\?$/.test(stripEmoji(b.text || ""))) {
      question = stripEmoji(b.text || "");
      continue;
    }
    if (b.type !== "paragraph") continue;
    const text = stripEmoji(b.text || "");
    if (!text) continue;
    if (/\?$/.test(text) && text.length < 200) {
      question = text;
    } else if (question) {
      faqs.push({ _key: key(), question, answer: text });
      question = null;
    }
  }
  return faqs.slice(0, 20);
}

function extractMythPairs(body = []) {
  const pairs = [];
  let myth = null;
  let inMyths = false;
  for (const b of body) {
    const t = stripEmoji(b.text || "");
    if (b.type === "heading" && /myth/i.test(t) && /fact/i.test(t)) {
      inMyths = true;
      continue;
    }
    if (!inMyths) continue;
    if (b.type === "heading" && /^myth\b/i.test(t)) {
      myth = t.replace(/^myth\s*\d*:?\s*/i, "");
      continue;
    }
    if (myth && b.type === "paragraph") {
      pairs.push({ _key: key(), myth, fact: t });
      myth = null;
    }
    if (b.type === "heading" && !/myth/i.test(t) && pairs.length) break;
  }
  return pairs.slice(0, 8);
}

function extractYoutubeIds(html = "") {
  const ids = [];
  for (const m of html.matchAll(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/gi,
  )) {
    if (!ids.includes(m[1])) ids.push(m[1]);
  }
  return ids;
}

function uriToServiceSlug(uri = "", fallback = "") {
  const fromUri = uri
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .join("-")
    .toLowerCase();
  return fromUri || fallback || "service";
}

function shortTitle(title = "") {
  return stripEmoji(title)
    .split(/[–—|-]/)[0]
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function categoryFromUri(uri = "", title = "") {
  const hay = `${uri} ${title}`.toLowerCase();
  if (/hair|fue|fut|prp|alopecia|bald|beard|eyebrow|scalp|transplant/.test(hay))
    return "hair";
  if (
    /skin|vitiligo|acne|peel|hydrafacial|mole|wart|tattoo|birthmark|microneedling|whitening|carbon|fractional|dermabrasion|dark.circle|permanent.makeup/.test(
      hay,
    )
  )
    return "skin";
  if (
    /botox|filler|hifu|thread|vampire|anti.aging|brow|lip.aug|face.slim|double.chin|laser.hair|cosmetic.treat/.test(
      hay,
    )
  )
    return "face";
  if (
    /gynae|gyne|lipo|breast|tummy|mommy|bbl|body|contour|weight|cryolip|intimate|hymen|labia|vagino|urology|circumcision|kidney|piles|proctology|fatty.liver|iv.therapy|ozone|peptide|hyperbaric|rhino|septoplasty|facelift|eyelid|neck.lift|chin|dimple|fat.graft|buccal/.test(
      hay,
    )
  )
    return "body";
  return "other";
}

function findBackup(slug, uri) {
  const wantUri = (uri || "").replace(/\/?$/, "/");
  if (wantUri && wantUri !== "/") {
    for (const f of fs.readdirSync(BACKUP_DIR)) {
      if (!f.endsWith(".json")) continue;
      const j = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, f), "utf8"));
      if ((j.uri || "").replace(/\/?$/, "/") === wantUri) return j;
    }
  }
  const direct = path.join(BACKUP_DIR, `${slug}.json`);
  if (fs.existsSync(direct)) {
    return JSON.parse(fs.readFileSync(direct, "utf8"));
  }
  for (const f of fs.readdirSync(BACKUP_DIR)) {
    if (!f.endsWith(".json")) continue;
    const j = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, f), "utf8"));
    if (j.slug === slug) return j;
  }
  return null;
}

function parseArgs(argv) {
  const out = { slug: null, uri: null, batch: null, all: false, limit: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i];
    else if (a === "--uri") out.uri = argv[++i];
    else if (a === "--batch") out.batch = Number(argv[++i]);
    else if (a === "--all") out.all = true;
    else if (a === "--limit") out.limit = Number(argv[++i]);
  }
  return out;
}

function pickHeroAsset(bodyImages, assetsBySource, structured) {
  const featured = structured.featuredImage?.assetId;
  if (featured && assetsBySource[featured]) return assetsBySource[featured]._id;
  const ba = bodyImages.find((i) =>
    /before|after|result/i.test(`${i.alt} ${i.filename || ""}`),
  );
  if (ba?.assetId) return ba.assetId;
  return bodyImages[0]?.assetId;
}

function pickDoctorAsset(bodyImages, assetsBySource) {
  const hit = bodyImages.find((i) =>
    /dr\.|doctor|sandeep|surgeon|bhasin/i.test(`${i.alt} ${i.filename || ""}`),
  );
  if (hit?.assetId) return hit.assetId;
  // try known doctor assets from source ids on page
  for (const a of Object.values(assetsBySource)) {
    if (/sandeep|bhasin|doctor/i.test(a.originalFilename || "")) return a._id;
  }
  return undefined;
}

function buildSteps(body, serviceLabel) {
  const stepHeads = (body || [])
    .filter(
      (b) =>
        b.type === "heading" &&
        /^(step\s*\d|[1234]\.\s|initial consultation|surgical procedure|recovery)/i.test(
          stripEmoji(b.text || ""),
        ),
    )
    .map((b) => stripEmoji(b.text || ""))
    .slice(0, 6);

  if (stepHeads.length >= 3) {
    return stepHeads.slice(0, 4).map((title) => {
      const sec = sectionByHeading(body, (t) => t === title);
      return {
        _key: key(),
        title: title.replace(/^step\s*\d[:.]?\s*/i, "").slice(0, 80),
        description: sec.paras[0] || "",
      };
    });
  }

  return [
    {
      _key: key(),
      title: "Consultation",
      description: `Clinical assessment and goals for ${serviceLabel}.`,
    },
    {
      _key: key(),
      title: "Personalised plan",
      description: "Technique, timeline, and expectations confirmed with the surgeon.",
    },
    {
      _key: key(),
      title: "Procedure",
      description: "Treatment day under medical supervision at Care Well.",
    },
    {
      _key: key(),
      title: "Recovery",
      description: "Aftercare guidance and follow-ups as healing progresses.",
    },
  ];
}

function buildOptions(body) {
  const optionHeads = (body || [])
    .filter(
      (b) =>
        b.type === "heading" &&
        /^(liposuction|excision|combined|fue|fut|dhi|open|closed|laser|prp|peel|botox|filler|hifu|thread)/i.test(
          stripEmoji(b.text || ""),
        ),
    )
    .map((b) => stripEmoji(b.text || ""));

  const unique = [...new Set(optionHeads)].slice(0, 4);
  if (!unique.length) return [];

  return unique.map((title) => {
    const sec = sectionByHeading(body, (t) => t === title || t.includes(title));
    return {
      _key: key(),
      title: title.slice(0, 80),
      description: sec.paras[0] || `${title} as planned after clinical assessment.`,
      bullets: sec.lists.slice(0, 3),
    };
  });
}

async function populateOne(client, slug, uriHint) {
  const structured = findBackup(slug, uriHint);
  if (!structured) throw new Error(`Backup JSON not found for slug=${slug}`);

  const page =
    (await client.fetch(
      `*[_type == "page" && (uri == $uri || uri == $uriNoSlash)][0]{
      _id, title, slug, uri, excerpt, legacyId, seo, mainImage, body,
      "bodyImages": body[_type == "bodyImage"]{
        _key, alt, "assetId": asset._ref, "filename": asset->originalFilename
      }
    }`,
      {
        uri: structured.uri || uriHint || `/${slug}/`,
        uriNoSlash: (structured.uri || uriHint || `/${slug}/`).replace(
          /\/$/,
          "",
        ),
      },
    )) ||
    (await client.fetch(
      `*[_type == "page" && slug.current == $slug][0]{
      _id, title, slug, uri, excerpt, legacyId, seo, mainImage, body,
      "bodyImages": body[_type == "bodyImage"]{
        _key, alt, "assetId": asset._ref, "filename": asset->originalFilename
      }
    }`,
      { slug },
    ));
  if (!page) throw new Error(`Sanity page not found for slug=${slug}`);

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

  const body = structured.body || [];
  const serviceLabel = shortTitle(page.title || structured.title || slug);
  const uri = page.uri || structured.uri || `/${slug}/`;
  const category = categoryFromUri(uri, page.title);

  const intro = [];
  for (const b of body) {
    if (b.type === "heading") break;
    if (b.type === "paragraph") intro.push(stripEmoji(b.text));
  }

  const overviewSec = sectionByHeading(
    body,
    (t) =>
      new RegExp(`what is|about ${serviceLabel.split(" ")[0]}|overview`, "i").test(
        t,
      ),
  );
  const whySec = sectionByHeading(
    body,
    (t) => /why choose|why trust|why care well/i.test(t),
  );
  const benefits = collectListsMatching(body, (t) => /benefit/i.test(t));
  const causes = collectListsMatching(body, (t) => /cause/i.test(t));
  const prep = collectListsMatching(
    body,
    (t) => /prepar|pre-?surgery|checklist|before surgery/i.test(t),
  );
  const recovery = collectListsMatching(
    body,
    (t) => /recover|aftercare|healing|post-?surgery/i.test(t),
  );
  const risks = collectListsMatching(
    body,
    (t) => /risk|complication|side effect/i.test(t),
  );
  const candidacyGood = collectListsMatching(
    body,
    (t) => /candidate|who (is|are) |recommended|ideal|right for you/i.test(t),
  );
  const costFactors = collectListsMatching(
    body,
    (t) => /cost|price|pricing|fee/i.test(t),
  );
  const faqs = extractFaqs(body);
  const myths = extractMythPairs(body);
  const youtubeIds = extractYoutubeIds(structured.rawHtml || "");
  const options = buildOptions(body);
  const steps = buildSteps(body, serviceLabel);

  if (faqs.length < 2) {
    faqs.push({
      _key: key(),
      question: `How do I book ${serviceLabel} at Care Well?`,
      answer:
        "Call or WhatsApp the clinic, or use the consultation form on this page. We are in Chittaranjan Park, South Delhi.",
    });
  }

  const bodyImages = page.bodyImages || [];
  const heroAssetId =
    pickHeroAsset(bodyImages, assetsBySource, structured) ||
    page.mainImage?.asset?._ref;
  const doctorAssetId = pickDoctorAsset(bodyImages, assetsBySource);

  const baCandidates = bodyImages.filter((i) =>
    /before|after|result/i.test(`${i.alt} ${i.filename || ""}`),
  );
  const baSources = (baCandidates.length ? baCandidates : bodyImages.slice(0, 2))
    .filter((i) => i.assetId)
    .slice(0, 6);

  const overviewImages = bodyImages.slice(0, 3);
  const overviewBody = [
    ...blocksFromParagraphs(intro.slice(0, 3)),
    ...blocksFromParagraphs(overviewSec.paras.slice(0, 3)),
    ...overviewImages.map((img) => ({
      _type: "bodyImage",
      _key: key(),
      alt: stripEmoji(img.alt || serviceLabel),
      asset: { _type: "reference", _ref: img.assetId },
    })),
    ...blocksFromParagraphs(whySec.paras.slice(0, 2)),
  ];

  const seoTitle =
    page.seo?.title?.replace(/\s*%%sep%%\s*%%sitename%%/gi, "").trim() ||
    serviceLabel;
  const seoDesc =
    page.seo?.description ||
    structured.seo?.metaDesc ||
    `${serviceLabel} at Care Well Medical Centre, South Delhi — doctor-led care with transparent counselling.`;

  const serviceSlug = uriToServiceSlug(uri, page.slug?.current || slug);

  const otherServices = await client.fetch(
    `*[_type == "service" && slug.current != $slug && uri != $uri] | order(title asc)[0...4]{_id}`,
    { slug: serviceSlug, uri },
  );

  const existing = await client.fetch(
    `*[_type == "service" && (uri == $uri || uri == $uriNoSlash || slug.current == $serviceSlug || legacyId == $legacyId)][0]._id`,
    {
      uri,
      uriNoSlash: uri.replace(/\/$/, ""),
      serviceSlug,
      legacyId: page.legacyId,
    },
  );

  const doc = {
    _type: "service",
    title: page.title || structured.title,
    slug: { _type: "slug", current: serviceSlug },
    uri,
    legacyId: page.legacyId,
    category,
    excerpt: page.excerpt || seoDesc,
    seo: {
      title: seoTitle,
      description: seoDesc,
      focusKeyword: structured.seo?.focusKeyword || serviceLabel,
      breadcrumbsTitle:
        structured.seo?.breadcrumbsTitle || serviceLabel.split(" ")[0],
      noIndex: false,
      ogImage: imgRef(heroAssetId, stripEmoji(bodyImages[0]?.alt || serviceLabel)),
    },
    hero: {
      heading: serviceLabel,
      tagline:
        intro[0]?.slice(0, 180) ||
        `Doctor-led ${serviceLabel.toLowerCase()} at Care Well Medical Centre, South Delhi.`,
      image: imgRef(
        heroAssetId,
        bodyImages.find((i) => i.assetId === heroAssetId)?.alt || serviceLabel,
      ),
      primaryCtaLabel: "Book Free Consultation",
      secondaryCtaLabel: "WhatsApp",
      quickFacts: [
        { _key: key(), label: "Consultation", value: "Free clinical assessment" },
        { _key: key(), label: "Surgeon", value: "Dr Sandeep Bhasin" },
        { _key: key(), label: "Clinic", value: "South Delhi" },
        { _key: key(), label: "Plan", value: "Personalised after exam" },
      ],
      quickFactsNote:
        "Typical guidance — your plan is confirmed after consultation.",
    },
    booking: {
      eyebrow: "Free consult",
      title: `Book FREE ${serviceLabel} consultation`,
      subtitle: `Speak with Care Well about ${serviceLabel.toLowerCase()}.`,
      submitLabel: "Book Free Consultation",
      nameLabel: "Patient name",
      namePlaceholder: "Full name",
      phoneLabel: "Mobile number",
      phonePlaceholder: "10-digit mobile",
      trustItems: ["100% private", "Reply in ~2 hrs", "No spam"],
      successTitle: "Request received",
      successBody: "We'll call you shortly on the number you shared.",
      bandEyebrow: "Next step",
      bandHeadline: `Ready to discuss ${serviceLabel.toLowerCase()}?`,
      bandBody:
        "Share your details — a Care Well coordinator will schedule a free, private consultation.",
    },
    overview: {
      eyebrow: "Overview",
      heading: overviewSec.paras.length
        ? `What is ${serviceLabel}?`
        : `About ${serviceLabel}`,
      insightsTitle: "Key insights",
      insightsEyebrow: "Good to know",
      body: overviewBody.length ? overviewBody : (page.body || []).slice(0, 30),
      insights: [
        "Surgeon-led planning at Care Well Medical Centre",
        "Transparent counselling before you decide",
        "South Delhi clinic with Delhi NCR access",
        "Personalised technique and recovery guidance",
      ],
    },
    howItWorks: {
      eyebrow: "Process",
      heading: "How it works",
      stepLabel: "Step",
      youtubeId: youtubeIds[0] || "",
      youtubeEyebrow: youtubeIds[0] ? "Watch" : undefined,
      youtubeTitle: youtubeIds[0] ? `${serviceLabel} explained` : undefined,
      steps,
    },
    beforeAfter: {
      eyebrow: "Results",
      heading: `${serviceLabel} results`,
      consentNotice:
        "Images shared with patient consent. Individual results vary.",
      pairs: baSources.map((p, i) => ({
        _key: key(),
        patientInitials: `P${i + 1}`,
        subtype: serviceLabel.slice(0, 40),
        monthsPost: 3,
        before: imgRef(p.assetId, `${p.alt || serviceLabel} — before`, CROP_LEFT),
        after: imgRef(p.assetId, `${p.alt || serviceLabel} — after`, CROP_RIGHT),
      })),
    },
    candidacy: {
      eyebrow: "Eligibility",
      heading: `Am I a candidate for ${serviceLabel}?`,
      goodFitLabel: "Good fit",
      notIdealLabel: "Not ideal yet",
      goodFit: candidacyGood.length
        ? candidacyGood
        : [
            "Healthy enough after clinical assessment",
            "Clear, realistic goals discussed with the surgeon",
            "Ready to follow aftercare instructions",
          ],
      notIdeal: [
        "Uncontrolled medical conditions (until cleared)",
        "Unrealistic expectations about outcomes",
        "Unable to follow recovery guidance",
      ],
      quizCtaLabel: "Book an assessment",
      quizCtaHref: "#book",
    },
    causes: causes.length
      ? {
          eyebrow: "Causes",
          heading: "Common causes",
          items: causes,
        }
      : undefined,
    benefits: {
      eyebrow: "Benefits",
      heading: `Benefits of ${serviceLabel}`,
      items: benefits.length
        ? benefits
        : [
            "Personalised plan after clinical assessment",
            "Experienced surgical team in South Delhi",
            "Focus on natural-looking outcomes",
          ],
    },
    preparation: {
      eyebrow: "Before treatment",
      heading: "How to prepare",
      items: prep.length
        ? prep
        : [
            "Share medical history and medications",
            "Follow pre-procedure instructions",
            "Plan rest for treatment day and early recovery",
          ],
    },
    recovery: {
      eyebrow: "Recovery",
      heading: "Recovery & aftercare",
      items: recovery.length
        ? recovery
        : [
            "Follow dressing and activity guidance",
            "Attend scheduled follow-ups",
            "Results settle over the healing timeline discussed in consult",
          ],
    },
    risks: {
      eyebrow: "Safety",
      heading: "Risks & limitations",
      items: risks.length
        ? risks
        : [
            "Temporary swelling, bruising, or discomfort",
            "Individual results vary",
            "Rare complications discussed during consent",
          ],
    },
    whyChooseUs: {
      eyebrow: "Why Care Well",
      heading: `Why choose Care Well for ${serviceLabel}`,
      intro: whySec.paras[0],
      items: [
        "Surgeon-led planning — not technician-only sessions",
        "Transparent counselling on technique and recovery",
        "South Delhi clinic with Delhi NCR access",
        "Focus on natural results and patient safety",
      ],
    },
    whenRecommended: {
      eyebrow: "Clinical fit",
      heading: "When doctors recommend this",
      items: candidacyGood.slice(0, 5).length
        ? candidacyGood.slice(0, 5)
        : [
            "After clinical assessment confirms suitability",
            "When non-surgical options are insufficient",
            "When goals are realistic and medically appropriate",
          ],
    },
    myths: myths.length
      ? {
          eyebrow: "Myths vs facts",
          heading: "Myths vs facts",
          mythLabel: "Myth",
          factLabel: "Fact",
          pairs: myths,
        }
      : undefined,
    treatmentOptions: options.length
      ? {
          eyebrow: "Options",
          heading: "Treatment options",
          options,
        }
      : undefined,
    technology:
      options.length >= 2
        ? {
            eyebrow: "Techniques",
            heading: "Techniques used",
            techniques: options.slice(0, 3).map((o) => ({
              _key: key(),
              title: o.title,
              description: o.description,
            })),
          }
        : undefined,
    pricing: {
      eyebrow: "Pricing",
      heading: `${serviceLabel} cost in Delhi`,
      startingFromLabel: "Typical range",
      startingFrom: "Custom quote after assessment",
      factorsHeading: "What affects cost",
      factors: costFactors.length
        ? costFactors
        : [
            "Technique and complexity",
            "Extent of treatment area",
            "Anaesthesia and facility needs",
          ],
      includedHeading: "Discussed before treatment",
      whatsIncluded: [
        "Surgeon consultation",
        "Personalised plan",
        "Aftercare guidance",
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
          sublabel: "Clinical plan discussion",
        },
        {
          _key: key(),
          label: "Quote",
          value: "Personalized",
          sublabel: "Based on your case",
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
        "Illustrative only. Final EMI terms depend on financing partner approval.",
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
      credentials: ["Cosmetic surgery", "Aesthetic medicine"],
      bio: [
        `Dr Sandeep Bhasin leads ${serviceLabel.toLowerCase()} care at Care Well with a focus on safety and natural-looking outcomes.`,
      ],
      photo: imgRef(doctorAssetId, "Dr Sandeep Bhasin, Care Well Medical Centre"),
      ctaLabel: "Book with Dr Bhasin",
      ctaHref: "#book",
    },
    testimonialsSection: {
      eyebrow: "Patients",
      heading: "Patient stories & videos",
      videoEnabled: youtubeIds.length > 0,
      videoEyebrow: youtubeIds.length ? "Watch" : undefined,
      videoHeading: youtubeIds.length ? `${serviceLabel} videos` : undefined,
      items: [],
      videos: youtubeIds.slice(0, 6).map((id, i) => ({
        _key: key(),
        youtubeId: id,
        title: i === 0 ? `${serviceLabel} story` : `Patient video ${i + 1}`,
      })),
    },
    faqs,
    faqEyebrow: "FAQs",
    faqHeading: `${serviceLabel} FAQs`,
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
      heading: "Clinic in South Delhi",
      address: "Care Well Medical Centre, Chittaranjan Park, South Delhi",
      hours: "Mon–Sat · by appointment",
      phone: "+91 98101 53580",
      mapHref:
        "https://maps.google.com/?q=Care+Well+Medical+Centre+Chittaranjan+Park",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5!2d77.25!3d28.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCare%20Well%20Medical%20Centre!5e0!3m2!1sen!2sin!4v1",
    },
    finalCta: {
      eyebrow: "Next step",
      headline: `Book a ${serviceLabel} consultation`,
      primaryLabel: "Book Free Consultation",
      primaryHref: "#book",
      secondaryLabel: "Call Now",
      secondaryHref: "tel:+919810153580",
    },
    body: page.body || [],
  };

  // Remove undefined optional objects so patch doesn't wipe oddly
  for (const k of Object.keys(doc)) {
    if (doc[k] === undefined) delete doc[k];
  }

  let id;
  if (existing) {
    await client.patch(existing).set(doc).commit();
    id = existing;
  } else {
    const created = await client.create(doc);
    id = created._id;
  }

  return {
    id,
    slug,
    uri,
    hero: !!heroAssetId,
    ba: doc.beforeAfter.pairs.length,
    faqs: faqs.length,
    videos: youtubeIds.length,
    options: options.length,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const env = loadEnv();
  if (!env.SANITY_API_TOKEN) throw new Error("SANITY_API_TOKEN missing");

  const client = createClient({
    projectId: env.SANITY_PROJECT_ID || "ndeeiwkw",
    dataset: env.SANITY_DATASET || "production",
    token: env.SANITY_API_TOKEN,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  let targets = [];

  if (args.slug) {
    targets = [{ slug: args.slug, uri: args.uri }];
  } else if (args.uri) {
    const slug = args.uri.split("/").filter(Boolean).pop();
    targets = [{ slug, uri: args.uri }];
  } else {
    if (!fs.existsSync(LIST_PATH)) {
      throw new Error(
        `Missing ${LIST_PATH}. Run: node scripts/generate-service-pages-list.mjs`,
      );
    }
    const list = JSON.parse(fs.readFileSync(LIST_PATH, "utf8"));
    if (args.batch) {
      const batch = list.batches.find((b) => b.id === args.batch);
      if (!batch) throw new Error(`Batch ${args.batch} not found`);
      targets = batch.items.map((item) => {
        // Batches store URIs (preferred) or legacy slug strings
        if (String(item).startsWith("/")) {
          const slugFromUri = String(item).split("/").filter(Boolean).pop();
          return { slug: slugFromUri, uri: item };
        }
        const row = list.remaining.find((r) => r.slug === item);
        return { slug: item, uri: row?.uri };
      });
    } else if (args.all) {
      targets = list.remaining.map((r) => ({ slug: r.slug, uri: r.uri }));
    } else {
      throw new Error("Pass --slug, --uri, --batch N, or --all");
    }
  }

  if (args.limit) targets = targets.slice(0, args.limit);

  const results = [];
  for (const t of targets) {
    process.stdout.write(`→ ${t.slug} ... `);
    try {
      const r = await populateOne(client, t.slug, t.uri);
      results.push({ ok: true, ...r });
      console.log(
        `OK uri=${r.uri} hero=${r.hero} ba=${r.ba} faqs=${r.faqs} yt=${r.videos}`,
      );
    } catch (err) {
      results.push({ ok: false, slug: t.slug, error: String(err.message || err) });
      console.log(`FAIL ${err.message || err}`);
    }
  }

  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok);
  console.log(`\nDone: ${ok}/${results.length} succeeded`);
  if (fail.length) {
    console.log("Failures:");
    for (const f of fail) console.log(` - ${f.slug}: ${f.error}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

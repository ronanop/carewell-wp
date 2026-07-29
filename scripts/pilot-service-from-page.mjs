/**
 * Create a pilot Sanity `service` document from an imported `page` (P1.8).
 *
 * Usage:
 *   node scripts/pilot-service-from-page.mjs --slug gynecomastia
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

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

function blocksToPlain(blocks = []) {
  return blocks
    .filter((b) => b._type === "block")
    .map((b) =>
      (b.children || []).map((c) => c.text || "").join(""),
    )
    .filter(Boolean);
}

function extractFaqs(blocks = []) {
  const faqs = [];
  const texts = blocksToPlain(blocks);
  for (let i = 0; i < texts.length - 1; i++) {
    const q = texts[i];
    const a = texts[i + 1];
    if (/\?$/.test(q) && q.length < 160 && a && !/\?$/.test(a)) {
      faqs.push({ _key: key(), question: q, answer: a });
      i++;
    }
  }
  return faqs.slice(0, 12);
}

function extractSteps(blocks = []) {
  const headings = blocks
    .filter((b) => b._type === "block" && ["h2", "h3"].includes(b.style))
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .filter(Boolean);
  const howIdx = headings.findIndex((h) => /how|process|step|procedure/i.test(h));
  if (howIdx < 0) {
    return [
      { _key: key(), title: "Consultation", description: "Meet the surgeon and discuss goals." },
      { _key: key(), title: "Assessment", description: "Clinical evaluation and plan." },
      { _key: key(), title: "Procedure", description: "Treatment day under medical supervision." },
      { _key: key(), title: "Recovery", description: "Aftercare guidance and follow-ups." },
      { _key: key(), title: "Results", description: "Track progress as healing completes." },
    ];
  }
  return headings.slice(howIdx + 1, howIdx + 6).map((title) => ({
    _key: key(),
    title,
    description: "",
  }));
}

function parseArgs(argv) {
  let slug = "gynecomastia";
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--slug") slug = argv[++i];
  }
  return { slug };
}

async function main() {
  const { slug } = parseArgs(process.argv);
  const env = loadEnv();
  const client = createClient({
    projectId: env.SANITY_PROJECT_ID || "ndeeiwkw",
    dataset: env.SANITY_DATASET || "production",
    token: env.SANITY_API_TOKEN,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, slug, uri, excerpt, legacyId, seo, mainImage, body
    }`,
    { slug },
  );
  if (!page) throw new Error(`Page not found for slug=${slug}`);

  const existing = await client.fetch(
    `*[_type == "service" && (slug.current == $slug || legacyId == $legacyId)][0]._id`,
    { slug, legacyId: page.legacyId },
  );

  const faqs = extractFaqs(page.body || []);
  if (faqs.length < 2) {
    faqs.push(
      {
        _key: key(),
        question: "How do I book at Care Well Medical Centre?",
        answer:
          "Call or WhatsApp the clinic, or use the consultation form on this page. We are in Chittaranjan Park, South Delhi.",
      },
    );
  }

  const doc = {
    _type: "service",
    title: page.title,
    slug: { _type: "slug", current: page.slug?.current || slug },
    uri: page.uri,
    legacyId: page.legacyId,
    category: /gynae|gyne|lipo|fat|mommy|breast|body/i.test(page.title)
      ? "body"
      : /hair/i.test(page.title)
        ? "hair"
        : /skin|vitiligo|peel|tattoo|hydra/i.test(page.title)
          ? "skin"
          : "other",
    excerpt: page.excerpt || page.seo?.description || "",
    seo: page.seo || undefined,
    hero: {
      heading: page.title,
      tagline: "",
      image: page.mainImage || undefined,
      primaryCtaLabel: "Book Free Consultation",
      secondaryCtaLabel: "WhatsApp",
      quickFacts: [
        { _key: key(), label: "Procedure time", value: "Discussed in consult" },
        { _key: key(), label: "Recovery", value: "Personalized plan" },
        { _key: key(), label: "Anaesthesia", value: "As advised by surgeon" },
        { _key: key(), label: "Results timeline", value: "Varies by patient" },
      ],
      quickFactsNote:
        "Typical ranges — your plan is confirmed after consultation.",
    },
    booking: {
      eyebrow: "Free consult",
      title: "Book FREE consultation",
      subtitle: `Speak with our team about ${page.title.split("–")[0].trim()}.`,
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
      heading: `What is ${page.title.split("–")[0].trim()}?`,
      insightsTitle: "Key insights",
      insightsEyebrow: "Good to know",
      body: (page.body || []).slice(0, 40),
      insights: [
        "Personalized plan after clinical assessment",
        "Experienced surgical team in South Delhi",
        "Transparent counselling before you decide",
      ],
    },
    howItWorks: {
      eyebrow: "Process",
      heading: "How it works",
      stepLabel: "Step",
      steps: extractSteps(page.body || []),
    },
    candidacy: {
      heading: "Am I a candidate?",
      goodFit: [
        "Healthy enough for the procedure after assessment",
        "Clear, realistic goals discussed with the surgeon",
        "Ready to follow aftercare instructions",
      ],
      notIdeal: [
        "Uncontrolled medical conditions (until cleared)",
        "Unrealistic expectations about outcomes",
        "Unable to follow recovery guidance",
      ],
      quizCtaLabel: "Take the quick self-check",
    },
    pricing: {
      startingFrom: "Custom quote",
      factors: [
        "Technique and complexity",
        "Extent of treatment area",
        "Anaesthesia and facility needs",
      ],
      emiNote: "EMI options may be available — ask during consultation.",
      ctaLabel: "Get Personalized Quote",
      whatsIncluded: [
        "Surgeon consultation",
        "Procedure plan",
        "Follow-up guidance",
      ],
    },
    faqs,
    finalCta: {
      headline: `Ready to discuss ${page.title.split("–")[0].trim()}?`,
      primaryLabel: "Book Free Consultation",
      secondaryLabel: "Call Now",
    },
    body: page.body || [],
    rawHtml: undefined,
  };

  // Ensure site settings singleton exists
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Care Well Medical Centre",
    phone: "+91 98101 53580",
    whatsapp: "919810153580",
    helloBarText: "Free consultation — Limited slots.",
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

  console.log(`Preview: http://localhost:3001${page.uri || `/${slug}/`}`);
  console.log(`(legacy redirect) http://localhost:3001/sanity/service/${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

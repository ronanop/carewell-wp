/**
 * Generate remaining service-page build list from WP backup + Sanity.
 * Writes scripts/data/service-pages-remaining.json and docs/SERVICE_PAGES_BUILD_LIST.md
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const BACKUP_PAGES =
  "C:/Users/risha/Downloads/carewell-backup-2026-07-28/structured/pages";

function loadEnv() {
  const env = {};
  const p = path.resolve(".env.local");
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const STATIC = new Set([
  "home",
  "homepage",
  "about",
  "about-us",
  "contact",
  "contact-us",
  "privacy",
  "privacy-policy",
  "disclaimer",
  "terms",
  "terms-and-conditions",
  "thank-you",
  "thankyou",
  "faq",
  "faqs",
  "gallery",
  "results",
  "doctors",
  "doctor",
  "blog",
  "blogs",
  "sitemap",
  "404",
  "custom-404",
  "cart",
  "checkout",
  "my-account",
  "shop",
  "search",
  "careers",
  "testimonials",
]);

const STATIC_URI_RE =
  /^\/(about(\/|$)|contact(\/|$)|privacy|disclaimer|terms|thank-you|faq|faqs|gallery|results|doctors?|blogs?|author|category|tag|wp-|sample-page|custom-404)/i;

function categoryFromUri(uri) {
  const top = uri.split("/").filter(Boolean)[0] || "";
  if (/hair/.test(top)) return "hair";
  if (/skin|vitiligo|acne|laser|hydrafacial|chemical|mole|tattoo|birthmark|microneedling|dermabrasion|whitening|punch|grafting|carbon|fractional|permanent-makeup|dark-circle/.test(top))
    return "skin";
  if (/cosmetic|botox|filler|hifu|thread|vampire|anti-aging|brow|lip|face-slimming|double-chin|laser-hair/.test(top))
    return "face";
  if (/plastic|body|liposuction|tummy|breast|mommy|bbl|gynecomastia|contour|weight|cryolipolysis|intimate|hymen|labia|vagino|urology|circumcision|kidney|proctology|piles|fatty-liver|iv-therapy|holistic|ozone|peptide|hyperbaric|non-surgical/.test(top))
    return "body";
  return "other";
}

function kindFromUri(uri) {
  const segs = uri.split("/").filter(Boolean);
  if (/\/(videos|before-and-after|cost|graft-calculator|side-effects|grades)\//.test(uri) || /(videos|before-and-after|cost|graft-calculator|side-effects|grades)$/.test(segs.at(-1) || ""))
    return "support";
  if (segs.length === 1 && /-(in-delhi|treatments)$|treatments-in-delhi|surgery-in-delhi|urology-in-delhi|iv-therapy|hyperbaric|fatty-liver|non-surgical|hair-loss-treatment|hair-transplant-in-delhi|plastic-surgery|cosmetic-treatments|skin-treatments|body-contouring|intimate-surgery|holistic-wellness|proctology/.test(segs[0]))
    return "hub";
  if (/faridabad|gurgaon|noida|ncr/.test(segs.at(-1) || "")) return "location";
  return "treatment";
}

const files = fs.readdirSync(BACKUP_PAGES).filter((f) => f.endsWith(".json"));
const pages = files.map((f) => {
  const j = JSON.parse(fs.readFileSync(path.join(BACKUP_PAGES, f), "utf8"));
  return {
    slug: j.slug,
    uri: (j.uri || `/${j.slug}/`).replace(/\/?$/, "/"),
    title: j.title,
    backupFile: f,
    assetsUsed: j.assetsUsed || [],
  };
});

const candidates = pages.filter((p) => {
  const slug = (p.slug || "").toLowerCase();
  if (STATIC.has(slug) || STATIC_URI_RE.test(p.uri)) return false;
  if (/cookie|policy|login|register/i.test(slug)) return false;
  return true;
});

const env = loadEnv();
const client = createClient({
  projectId: env.SANITY_PROJECT_ID || "ndeeiwkw",
  dataset: env.SANITY_DATASET || "production",
  token: env.SANITY_API_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const built = await client.fetch(
  `*[_type == "service"]{ "slug": slug.current, uri }`,
);
const builtUris = new Set(
  built.map((s) => (s.uri || `/${s.slug}/`).replace(/\/?$/, "/")),
);
const builtSlugs = new Set(built.map((s) => s.slug).filter(Boolean));

const remaining = candidates
  .filter((p) => !builtUris.has(p.uri) && !builtSlugs.has(p.slug))
  .map((p) => ({
    ...p,
    category: categoryFromUri(p.uri),
    kind: kindFromUri(p.uri),
    depth: p.uri.split("/").filter(Boolean).length,
    priority:
      kindFromUri(p.uri) === "treatment"
        ? 1
        : kindFromUri(p.uri) === "hub"
          ? 2
          : kindFromUri(p.uri) === "location"
            ? 3
            : 4,
  }))
  .sort((a, b) => a.priority - b.priority || a.uri.localeCompare(b.uri));

const BATCH_SIZE = 15;
const batches = [];
for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
  const slice = remaining.slice(i, i + BATCH_SIZE);
  batches.push({
    id: Math.floor(i / BATCH_SIZE) + 1,
    // Prefer URI keys — WP slugs collide (female, facial, videos)
    items: slice.map((p) => p.uri),
    slugs: slice.map((p) => p.slug),
  });
}

const outDir = path.resolve("scripts/data");
fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, "service-pages-remaining.json");
fs.writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalBackupPages: pages.length,
      serviceLike: candidates.length,
      alreadyBuilt: built.length,
      remaining: remaining.length,
      batchSize: BATCH_SIZE,
      batchCount: batches.length,
      built,
      remaining,
      batches,
    },
    null,
    2,
  ),
);

const md = `# Service pages build list

Generated: ${new Date().toISOString().slice(0, 10)}  
Source: WP backup structured pages + Sanity \`service\` docs  
Quality bar: hair-transplant / gynecomastia rich populate

## Summary

| Metric | Count |
|--------|------:|
| Backup pages total | ${pages.length} |
| Service-like candidates | ${candidates.length} |
| Already built | ${built.length} |
| **Remaining to build** | **${remaining.length}** |
| Batch size | ${BATCH_SIZE} |
| Batches | ${batches.length} |

### Already built
${built.map((b) => `- \`${b.slug}\` → ${b.uri}`).join("\n")}

### Remaining by kind
${Object.entries(
  remaining.reduce((a, p) => {
    a[p.kind] = (a[p.kind] || 0) + 1;
    return a;
  }, {}),
)
  .map(([k, v]) => `- **${k}**: ${v}`)
  .join("\n")}

### Remaining by category
${Object.entries(
  remaining.reduce((a, p) => {
    a[p.category] = (a[p.category] || 0) + 1;
    return a;
  }, {}),
)
  .map(([k, v]) => `- **${k}**: ${v}`)
  .join("\n")}

## Batches

${batches
  .map(
    (b) =>
      `### Batch ${b.id} (${b.items.length})\n\`\`\`\nnpm run populate:service -- --batch ${b.id}\n\`\`\`\n${b.items.map((u) => `- ${u}`).join("\n")}`,
  )
  .join("\n\n")}

## Full remaining URI list

${remaining.map((p, i) => `${i + 1}. \`${p.uri}\` (${p.kind}, ${p.category})`).join("\n")}
`;

fs.writeFileSync(path.resolve("docs/SERVICE_PAGES_BUILD_LIST.md"), md);
console.log(
  JSON.stringify(
    {
      jsonPath,
      remaining: remaining.length,
      batches: batches.length,
      batch1: batches[0]?.items,
      byKind: remaining.reduce((a, p) => {
        a[p.kind] = (a[p.kind] || 0) + 1;
        return a;
      }, {}),
    },
    null,
    2,
  ),
);

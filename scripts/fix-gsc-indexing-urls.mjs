/**
 * Fix Search Console soft-404 / indexing issues for a curated URL set:
 * 1. Upsert 301 redirects for broken paths → live destinations
 * 2. Clear seo.noIndex / seo.noFollow on destination posts (and related services)
 *
 * Usage:
 *   node scripts/fix-gsc-indexing-urls.mjs
 *   node scripts/fix-gsc-indexing-urls.mjs --dry-run
 */
import { createClient } from "@sanity/client";

import {
  resolveSanityWriteToken,
  sanityProjectConfig,
} from "./lib/sanityEnv.mjs";

const dryRun = process.argv.includes("--dry-run");

/** Broken / soft-404 paths → live canonical paths (trailing slash). */
const REDIRECTS = [
  {
    _id: "redirect-gsc-chemical-peels-nested",
    from: "/chemical-peels-what-surprising-things-you-should-know-before-go/chemical-peels/",
    to: "/chemical-peels-what-surprising-things-you-should-know-before-go/",
  },
  {
    // Was pointing at soft-404 /plastic-surgery/facelift/
    _id: "redirect-wp-163",
    from: "/facelift-surgery-what-you-need-to-know-from-a-cosmetic-surgery-expert/",
    to: "/plastic-surgery-in-delhi/facelift/",
  },
  {
    _id: "redirect-gsc-plastic-surgery-facelift",
    from: "/plastic-surgery/facelift/",
    to: "/plastic-surgery-in-delhi/facelift/",
  },
  {
    // Was pointing at soft-404 /hair-transplant/cost/
    _id: "redirect-wp-227",
    from: "/cost-of-hair-transplant-in-delhi-ncr/",
    to: "/hair-transplant-in-delhi/cost/",
  },
  {
    _id: "redirect-gsc-hair-transplant-cost",
    from: "/hair-transplant/cost/",
    to: "/hair-transplant-in-delhi/cost/",
  },
  {
    _id: "redirect-gsc-rhinoplasty-surgeon-delhi-ncr",
    from: "/how-to-choose-best-rhinoplasty-surgeon-in-delhi-ncr/",
    to: "/rhinoplasty-in-delhi-how-to-choose-the-best-surgeon/",
  },
];

/**
 * Slugs that must be indexable for the GSC URL set (destinations + live articles).
 * custom-404 stays noindex intentionally.
 */
const INDEXABLE_POST_SLUGS = [
  "how-to-become-virgin-again",
  "indian-celebrities-cricketers-bollywood-actors-hair-transplants",
  "bollywood-celebrities-who-use-botox-liposuction-plastic-surgery",
  "chemical-peels-what-surprising-things-you-should-know-before-go",
  "best-diet-to-stop-hair-fall-naturally",
  "facelift-surgery-cost-in-india",
  "hair-transplant-cost-in-india",
  "best-fruit-juices-for-skin-whitening",
  "top-natural-dht-blockers-hair-regrowth",
  "diagnosis-of-hair-loss-in-women",
  "deprived-of-virginity-issue-hymenoplasty-vaginoplasty-is-the-solution",
  "rainy-season-hair-care-how-to-prevent-hair-fall-in-monsoon",
  "essential-nutrients-for-healthy-hair-during-rainy-season",
  "what-is-best-penis-enlargement-growth-treatment-in-india",
  "how-to-protect-your-skin-from-suns-harmful-rays",
  "difference-between-weight-loss-and-inch-loss",
  "does-high-protein-diet-cause-kidney-problems",
  "body-types-eating-habits-physical-training",
  "coconut-oil-and-alzheimers-fact-vs-fiction",
  "top-10-laser-hair-removal-clinics-in-delhi",
  "how-brides-can-remove-tan-before-wedding",
  "best-bridal-treatments-for-natural-glow",
  "grade-3-fatty-liver-reversal-case-study",
  "incredible-health-benefits-of-turmeric",
  "bridal-acne-before-wedding-quick-fixes",
  "winter-skincare-tips-for-glowing-skin",
  "60-day-bridal-glow-plan-delhi-brides",
  "can-changing-cities-cause-hair-loss",
  "hollywood-celebrities-liposuction",
  "winter-hair-care-tips-mistakes",
  "how-to-reduce-wrinkles-on-face",
  "metabolism-and-weight-control",
  "health-benefits-dates-recipes",
  "skincare-routine-for-monsoon",
  "sun-tan-removal-treatments",
  "7-day-bridal-glow-routine",
  "how-to-grow-beard-faster",
  "rhinoplasty-in-delhi-how-to-choose-the-best-surgeon",
  "how-to-reduce-lip-size",
  "how-to-regrow-hairline",
  "bridal-lip-glow-guide",
];

const INDEXABLE_SERVICE_URIS = [
  "/plastic-surgery-in-delhi/facelift/",
  "/hair-transplant-in-delhi/cost/",
];

async function main() {
  const { projectId, dataset, env } = sanityProjectConfig();
  const token = resolveSanityWriteToken(env);
  if (!token) {
    throw new Error("SANITY_WRITE_TOKEN (or SANITY_API_TOKEN) is required");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    token,
    useCdn: false,
  });

  console.log(
    dryRun
      ? "Dry run — no writes"
      : `Writing to ${projectId}/${dataset}`,
  );

  // --- Redirects ---
  const txRedirects = client.transaction();
  for (const rule of REDIRECTS) {
    const doc = {
      _id: rule._id,
      _type: "redirect",
      from: rule.from,
      to: rule.to,
      permanent: true,
      isEnabled: true,
    };
    console.log(`Redirect ${rule.from} → ${rule.to} (${rule._id})`);
    if (!dryRun) txRedirects.createOrReplace(doc);
  }
  if (!dryRun) {
    await txRedirects.commit();
    console.log(`Wrote ${REDIRECTS.length} redirects`);
  }

  // --- Clear noIndex on posts ---
  const posts = await client.fetch(
    `*[_type == "post" && slug.current in $slugs]{
      _id,
      title,
      "slug": slug.current,
      "noIndex": seo.noIndex,
      "noFollow": seo.noFollow
    }`,
    { slugs: INDEXABLE_POST_SLUGS },
  );

  const foundSlugs = new Set(posts.map((p) => p.slug));
  const missing = INDEXABLE_POST_SLUGS.filter((s) => !foundSlugs.has(s));
  if (missing.length) {
    console.warn("Missing posts (skipped):", missing);
  }

  let postPatches = 0;
  const txPosts = client.transaction();
  for (const post of posts) {
    if (post.noIndex === true || post.noFollow === true) {
      console.log(
        `Indexable post: ${post.slug} (was noIndex=${post.noIndex} noFollow=${post.noFollow})`,
      );
      if (!dryRun) {
        txPosts.patch(post._id, {
          set: {
            "seo.noIndex": false,
            "seo.noFollow": false,
          },
        });
      }
      postPatches += 1;
    } else {
      console.log(`Already indexable: ${post.slug}`);
    }
  }
  if (!dryRun && postPatches > 0) {
    await txPosts.commit();
  }
  console.log(`Cleared noIndex/noFollow on ${postPatches} posts`);

  // --- Clear noIndex on destination services ---
  const services = await client.fetch(
    `*[_type == "service" && uri in $uris]{
      _id,
      title,
      uri,
      "noIndex": seo.noIndex,
      "noFollow": seo.noFollow
    }`,
    { uris: INDEXABLE_SERVICE_URIS },
  );

  let servicePatches = 0;
  const txServices = client.transaction();
  for (const service of services) {
    if (service.noIndex === true || service.noFollow === true) {
      console.log(
        `Indexable service: ${service.uri} (was noIndex=${service.noIndex})`,
      );
      if (!dryRun) {
        txServices.patch(service._id, {
          set: {
            "seo.noIndex": false,
            "seo.noFollow": false,
          },
        });
      }
      servicePatches += 1;
    } else {
      console.log(`Service already indexable: ${service.uri}`);
    }
  }
  if (!dryRun && servicePatches > 0) {
    await txServices.commit();
  }
  console.log(`Cleared noIndex/noFollow on ${servicePatches} services`);

  // Keep custom-404 noindexed
  const custom404 = await client.fetch(
    `*[_type == "page" && (slug.current == "custom-404" || uri == "/custom-404/")][0]{_id, "noIndex": seo.noIndex}`,
  );
  if (custom404 && custom404.noIndex !== true) {
    console.log("Ensuring /custom-404/ stays noindex");
    if (!dryRun) {
      await client
        .patch(custom404._id)
        .set({ "seo.noIndex": true, "seo.noFollow": true })
        .commit();
    }
  } else {
    console.log("/custom-404/ already noindex (correct)");
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

/**
 * Backfill `pageBuilder` on existing Sanity blog posts with the default section order.
 * Safe to re-run: skips docs that already have pageBuilder set.
 *
 * Prefers SANITY_WRITE_TOKEN (project Editor). Falls back to SANITY_API_TOKEN.
 *
 * Usage: node scripts/backfill-blog-page-builder.mjs
 */
import { createClient } from "@sanity/client";

import {
  resolveSanityWriteToken,
  sanityProjectConfig,
} from "./lib/sanityEnv.mjs";

const DEFAULT_ORDER = [
  "hero",
  "toc",
  "body",
  "midCta",
  "endCta",
  "doctor",
  "faq",
  "nextPosts",
];

const { projectId, dataset, env } = sanityProjectConfig();
const token = resolveSanityWriteToken(env);

if (!token) {
  console.error(`Missing write token.

Set in .env:
  SANITY_WRITE_TOKEN=<project Editor token>

Create at: https://www.sanity.io/manage/project/ndeeiwkw/api#tokens
`);
  process.exit(1);
}

if (!env.SANITY_WRITE_TOKEN) {
  console.warn(
    "SANITY_WRITE_TOKEN not set — falling back to SANITY_API_TOKEN. Prefer a dedicated Editor token.",
  );
} else {
  console.log("Using SANITY_WRITE_TOKEN for backfill");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const dryRun = process.argv.includes("--dry-run");

let docs;
try {
  docs = await client.fetch(
    `*[_type == "post" && !defined(pageBuilder)]{ _id, title }`,
  );
} catch (error) {
  const msg = error?.message || String(error);
  if (
    error?.statusCode === 401 ||
    /project user not found/i.test(msg)
  ) {
    console.error(`
Backfill failed: token is not a member of project "ndeeiwkw".

You likely used an Organization "Deploy Studios" token.
Create a PROJECT Editor token instead:
  https://www.sanity.io/manage/project/ndeeiwkw/api#tokens
Set it as SANITY_WRITE_TOKEN in .env (keep SANITY_DEPLOY_TOKEN for schema deploy).
`);
    process.exit(1);
  }
  throw error;
}

console.log(`Found ${docs.length} post(s) without pageBuilder`);

const pageBuilder = DEFAULT_ORDER.map((section) => ({
  _type: "blogSectionSlot",
  _key: section,
  section,
}));

let updated = 0;
try {
  for (const doc of docs) {
    console.log(`  ${dryRun ? "[dry-run]" : "patch"} ${doc._id} — ${doc.title}`);
    if (!dryRun) {
      await client.patch(doc._id).set({ pageBuilder }).commit();
      updated += 1;
    }
  }
} catch (error) {
  const status = error?.statusCode;
  const msg = error?.message || String(error);
  if (
    status === 403 ||
    /Insufficient permissions|permission "update"/i.test(msg)
  ) {
    console.error(`
Backfill failed: token cannot UPDATE documents (needs project Editor).

Set SANITY_WRITE_TOKEN to a project Editor/Admin token:
  https://www.sanity.io/manage/project/ndeeiwkw/api#tokens
`);
    process.exit(1);
  }
  throw error;
}

console.log(
  dryRun
    ? `Dry run complete (${docs.length} would update)`
    : `Updated ${updated} document(s)`,
);

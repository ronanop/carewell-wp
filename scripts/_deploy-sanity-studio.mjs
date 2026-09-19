/**
 * Deploy hosted Studio UI (carewellcms.sanity.studio).
 * Schema-only deploy does NOT update field titles in the Studio app — this does.
 *
 * Usage: npm run sanity:deploy-studio
 *
 * Preview URLs are baked in at deploy time (`SANITY_STUDIO_*`). Never ship
 * localhost from `.env.local` into the hosted Studio.
 */
import fs from "node:fs";
import { spawnSync } from "node:child_process";

import {
  loadEnvFiles,
  resolveSanityDeployToken,
} from "./lib/sanityEnv.mjs";

const CANONICAL_PREVIEW_ORIGIN = "https://www.carewellmedicalcentre.com";

function isLoopbackOrigin(value) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1"
    );
  } catch {
    return true;
  }
}

/** Prefer production `.env` value; never bake `.env.local` localhost into Studio. */
function resolveHostedPreviewOrigin(mergedEnv) {
  if (fs.existsSync(".env")) {
    for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
      const m = line.match(/^SANITY_STUDIO_PREVIEW_ORIGIN=(.*)$/);
      if (!m) continue;
      const fromDotEnv = m[1].trim().replace(/^["']|["']$/g, "").replace(/\/$/, "");
      if (fromDotEnv && !isLoopbackOrigin(fromDotEnv)) return fromDotEnv;
    }
  }
  const site = mergedEnv.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (site && !isLoopbackOrigin(site)) return site;
  return CANONICAL_PREVIEW_ORIGIN;
}

const env = loadEnvFiles();
const deployToken = resolveSanityDeployToken(env);

if (!deployToken) {
  console.error(`Missing deploy token for Studio deploy.

Set SANITY_DEPLOY_TOKEN (Deploy Studios) in .env
`);
  process.exit(1);
}

env.SANITY_AUTH_TOKEN = deployToken;

const previewOrigin = resolveHostedPreviewOrigin(env);
const previousPreview = env.SANITY_STUDIO_PREVIEW_ORIGIN?.trim();
if (previousPreview && isLoopbackOrigin(previousPreview)) {
  console.warn(
    `Ignoring local preview origin (${previousPreview}) for hosted Studio deploy.`,
  );
}
env.SANITY_STUDIO_PREVIEW_ORIGIN = previewOrigin;

console.log(
  `Deploying hosted Studio (UI + local schemaTypes) to carewellcms.sanity.studio…\nPreview origin: ${previewOrigin}`,
);

const result = spawnSync(
  "npx",
  ["--yes", "sanity@latest", "deploy", "--yes"],
  {
    stdio: "inherit",
    env,
    shell: true,
  },
);
process.exit(result.status ?? 1);

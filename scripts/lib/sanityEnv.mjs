/**
 * Shared env + Sanity token resolution for scripts.
 *
 * Tokens (set all three once in `.env` / `.env.local`):
 * - SANITY_API_TOKEN     — project Viewer (or Editor): draft/preview reads
 * - SANITY_WRITE_TOKEN   — project Editor/Admin: mutations, backfill, imports
 * - SANITY_DEPLOY_TOKEN  — org "Deploy Studios": `sanity schema deploy`
 *
 * Fallbacks keep older single-token setups working.
 */
import fs from "node:fs";

/** Merge `.env` then `.env.local` (local wins). */
export function loadEnvFiles() {
  const merged = { ...process.env };
  for (const file of [".env", ".env.local"]) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) merged[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return merged;
}

export function sanityProjectConfig(env = loadEnvFiles()) {
  return {
    projectId:
      env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      env.SANITY_PROJECT_ID ||
      "ndeeiwkw",
    dataset:
      env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_DATASET || "production",
    env,
  };
}

/** Content mutations / backfill / imports */
export function resolveSanityWriteToken(env = loadEnvFiles()) {
  return (
    env.SANITY_WRITE_TOKEN ||
    env.SANITY_API_TOKEN ||
    env.SANITY_AUTH_TOKEN ||
    ""
  );
}

/** Schema / Studio deploy (CLI uses SANITY_AUTH_TOKEN) */
export function resolveSanityDeployToken(env = loadEnvFiles()) {
  return (
    env.SANITY_DEPLOY_TOKEN ||
    env.SANITY_AUTH_TOKEN ||
    env.SANITY_WRITE_TOKEN ||
    env.SANITY_API_TOKEN ||
    ""
  );
}

/** Draft / preview reads */
export function resolveSanityReadToken(env = loadEnvFiles()) {
  return (
    env.SANITY_API_TOKEN ||
    env.SANITY_WRITE_TOKEN ||
    env.SANITY_AUTH_TOKEN ||
    ""
  );
}

/**
 * Deploy hosted Studio UI (carewellcms.sanity.studio).
 * Schema-only deploy does NOT update field titles in the Studio app — this does.
 *
 * Usage: npm run sanity:deploy-studio
 */
import { spawnSync } from "node:child_process";

import {
  loadEnvFiles,
  resolveSanityDeployToken,
} from "./lib/sanityEnv.mjs";

const env = loadEnvFiles();
const deployToken = resolveSanityDeployToken(env);

if (!deployToken) {
  console.error(`Missing deploy token for Studio deploy.

Set SANITY_DEPLOY_TOKEN (Deploy Studios) in .env
`);
  process.exit(1);
}

env.SANITY_AUTH_TOKEN = deployToken;

console.log(
  "Deploying hosted Studio (UI + local schemaTypes) to carewellcms.sanity.studio…",
);

const result = spawnSync(
  "npx",
  ["sanity@latest", "deploy", "--yes"],
  {
    stdio: "inherit",
    env,
    shell: true,
  },
);
process.exit(result.status ?? 1);

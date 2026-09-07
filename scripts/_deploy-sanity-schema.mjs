import { spawnSync } from "node:child_process";

import {
  loadEnvFiles,
  resolveSanityDeployToken,
} from "./lib/sanityEnv.mjs";

const env = loadEnvFiles();
const deployToken = resolveSanityDeployToken(env);

if (!deployToken) {
  console.error(`Missing deploy token.

Set one of these in .env (prefer dedicated deploy token):
  SANITY_DEPLOY_TOKEN  ← org token with "Deploy Studios" (recommended)
  SANITY_WRITE_TOKEN   ← project Editor (fallback)
  SANITY_API_TOKEN     ← last resort

Create at:
  Organization → API → Deploy Studios
  or Project ndeeiwkw → API → Tokens
`);
  process.exit(1);
}

env.SANITY_AUTH_TOKEN = deployToken;

console.log(
  env.SANITY_DEPLOY_TOKEN
    ? "Using SANITY_DEPLOY_TOKEN for schema deploy"
    : "Using fallback token for schema deploy (set SANITY_DEPLOY_TOKEN to avoid mixing roles)",
);

const result = spawnSync("npx", ["sanity@latest", "schema", "deploy"], {
  stdio: "inherit",
  env,
  shell: true,
});
process.exit(result.status ?? 1);

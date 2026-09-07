/**
 * Hostinger / CI one-shot build.
 * hPanel → Build command: `npm run build`
 * hPanel → Entry file: `server.js`
 *
 * Steps: prisma generate → db push → db seed → next build
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function run(command, args) {
  console.log(`\n[hostinger-build] ${command} ${args.join(" ")}\n`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    // Always use a shell so `npx` resolves on Hostinger Linux and local Windows.
    shell: true,
    env: process.env,
  });
  if (result.error) {
    console.error(`[hostinger-build] Failed to start: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(
      `[hostinger-build] Missing required env: ${name}. Set it in Hostinger → Environment variables, then redeploy.`,
    );
    process.exit(1);
  }
  return value;
}

requireEnv("DATABASE_URL");
requireEnv("AUTH_SECRET");

if (!process.env.AUTH_URL?.trim() && !process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
  console.error(
    "[hostinger-build] Set AUTH_URL or NEXT_PUBLIC_SITE_URL to your public site URL.",
  );
  process.exit(1);
}

const bootstrapEmail = process.env.STUDIO_BOOTSTRAP_EMAIL?.trim();
const bootstrapPassword = process.env.STUDIO_BOOTSTRAP_PASSWORD?.trim();
if (!bootstrapEmail || !bootstrapPassword || bootstrapPassword.length < 8) {
  console.warn(
    "[hostinger-build] WARNING: STUDIO_BOOTSTRAP_EMAIL / STUDIO_BOOTSTRAP_PASSWORD not set (or password < 8). Seed will still run roles, but /admin login may not exist until you set them and redeploy.",
  );
}

const prismaCli = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");
const nextCli = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const tsxCli = path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");

if (!fs.existsSync(path.join(process.cwd(), "node_modules", "prisma"))) {
  console.error(
    "[hostinger-build] `prisma` package is missing. It must be in dependencies (not only devDependencies) for Hostinger production installs.",
  );
  process.exit(1);
}
if (!fs.existsSync(tsxCli) && !fs.existsSync(path.join(process.cwd(), "node_modules", "tsx"))) {
  console.error(
    "[hostinger-build] `tsx` package is missing (needed for prisma db seed). Keep it in dependencies for Hostinger.",
  );
  process.exit(1);
}
if (!fs.existsSync(nextCli)) {
  console.error("[hostinger-build] `next` is not installed. npm install may have failed.");
  process.exit(1);
}

if (!process.env.SANITY_PROJECT_ID?.trim() && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()) {
  console.warn(
    "[hostinger-build] WARNING: SANITY_PROJECT_ID not set — next build may fail or ship empty CMS pages.",
  );
}

const node = process.execPath;

function runPrisma(subArgs) {
  if (fs.existsSync(prismaCli)) {
    run(node, [prismaCli, ...subArgs]);
  } else {
    run("npx", ["prisma", ...subArgs]);
  }
}

runPrisma(["generate"]);
runPrisma(["db", "push"]);
runPrisma(["db", "seed"]);
run(node, [nextCli, "build"]);

console.log(
  "\n[hostinger-build] Done. Hostinger should start with entry file: server.js\n",
);

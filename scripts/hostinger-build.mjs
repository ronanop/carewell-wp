/**
 * Hostinger / CI build: sync Neon schema, seed roles/admin (safe), then Next build.
 * hPanel → Deployment settings → Build command: `npm run build`
 */
import { spawnSync } from "node:child_process";

function run(command, args) {
  console.log(`\n[hostinger-build] ${command} ${args.join(" ")}\n`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error(
    "[hostinger-build] DATABASE_URL is missing. Set it in Hostinger env vars before deploy.",
  );
  process.exit(1);
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "db", "push"]);
run("npx", ["prisma", "db", "seed"]);
run("npx", ["next", "build"]);

console.log("\n[hostinger-build] Done. Hostinger will start with: node server.js\n");

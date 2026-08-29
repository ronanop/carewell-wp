/**
 * Removes stale Next.js dev cache before starting the dev server.
 * Prevents unstyled pages when .next chunks drift out of sync (CSS 404 / MODULE_NOT_FOUND).
 */
import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

// Development and production use separate Next.js output directories. Remove
// both here once so projects upgraded from the old shared `.next` cache start
// cleanly; future production builds cannot invalidate the dev cache.
const nextDirs = [".next-dev", ".next"].map((directory) =>
  path.join(process.cwd(), directory),
);

for (const nextDir of nextDirs) {
  if (existsSync(nextDir)) {
    rmSync(nextDir, { recursive: true, force: true });
    console.log(`[dev:clean] Removed stale ${path.basename(nextDir)} cache`);
  }
}

const child = spawn("next", ["dev"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));

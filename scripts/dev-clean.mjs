/**
 * Removes stale Next.js dev cache before starting the dev server.
 * Prevents unstyled pages when .next chunks drift out of sync (CSS 404 / MODULE_NOT_FOUND).
 */
import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("[dev:clean] Removed stale .next cache");
}

const child = spawn("next", ["dev"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));

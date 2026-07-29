import fs from "node:fs";
import { spawnSync } from "node:child_process";

const env = { ...process.env };
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
env.SANITY_AUTH_TOKEN = env.SANITY_API_TOKEN;

const result = spawnSync("npx", ["sanity@latest", "schema", "deploy"], {
  stdio: "inherit",
  env,
  shell: true,
});
process.exit(result.status ?? 1);

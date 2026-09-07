/**
 * Export docs/CMS_USER_GUIDE.html → docs/CMS_USER_GUIDE.pdf
 * Usage: node scripts/export-cms-guide-pdf.mjs
 */
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const htmlPath = path.join(root, "docs", "CMS_USER_GUIDE.html");
const pdfPath = path.join(root, "docs", "CMS_USER_GUIDE.pdf");

function ensurePlaywright() {
  try {
    createRequire(import.meta.url)("playwright");
    return true;
  } catch {
    console.log("Installing playwright (one-time)…");
    const install = spawnSync(
      "npm",
      ["install", "-D", "playwright@1.49.1", "--no-save"],
      { stdio: "inherit", shell: true, cwd: root },
    );
    if (install.status !== 0) return false;
    const browsers = spawnSync("npx", ["playwright", "install", "chromium"], {
      stdio: "inherit",
      shell: true,
      cwd: root,
    });
    return browsers.status === 0;
  }
}

async function main() {
  if (!ensurePlaywright()) {
    console.error("Could not install playwright.");
    process.exit(1);
  }

  const { chromium } = createRequire(import.meta.url)("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
  });
  await browser.close();
  console.log(`Wrote ${pdfPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

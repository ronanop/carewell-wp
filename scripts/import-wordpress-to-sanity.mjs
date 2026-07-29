/**
 * Import Care Well structured WordPress backup into Sanity.
 *
 * Usage:
 *   node scripts/import-wordpress-to-sanity.mjs --backup "C:/Users/risha/Downloads/carewell-backup-2026-07-28"
 *
 * Reads SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN from .env.local
 */

import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

const DEFAULT_BACKUP =
  "C:/Users/risha/Downloads/carewell-backup-2026-07-28";

function loadEnvLocal() {
  const envPath = path.resolve(".env.local");
  if (!fs.existsSync(envPath)) throw new Error(".env.local not found");
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function parseArgs(argv) {
  const out = { backup: DEFAULT_BACKUP, skipAssets: false, limit: 0 };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--backup") out.backup = argv[++i];
    if (argv[i] === "--skip-assets") out.skipAssets = true;
    if (argv[i] === "--limit") out.limit = Number(argv[++i]) || 0;
  }
  return out;
}

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function toIso(wpDate) {
  if (!wpDate) return undefined;
  // "2025-06-03 11:13:00" or RFC
  const normalized = wpDate.includes("T")
    ? wpDate
    : wpDate.replace(" ", "T") + "Z";
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function textBlock(style, text) {
  return {
    _type: "block",
    _key: key(),
    style: style || "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key(),
        text: text || "",
        marks: [],
      },
    ],
  };
}

function listBlocks(items, ordered) {
  return (items || []).filter(Boolean).map((item) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: ordered ? "number" : "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key(),
        text: item,
        marks: [],
      },
    ],
  }));
}

function mapBody(body, assetMap) {
  const out = [];
  for (const node of body || []) {
    switch (node.type) {
      case "heading": {
        const level = Math.min(Math.max(node.level || 2, 1), 4);
        out.push(textBlock(`h${level}`, node.text || ""));
        break;
      }
      case "paragraph":
        if (node.text?.trim()) out.push(textBlock("normal", node.text));
        break;
      case "quote":
        if (node.text?.trim()) out.push(textBlock("blockquote", node.text));
        break;
      case "list":
        out.push(...listBlocks(node.items, node.ordered));
        break;
      case "image": {
        const assetId =
          (node.assetId && assetMap[node.assetId]) ||
          (node.localPath && assetMap[`path:${node.localPath}`]);
        if (!assetId) break;
        out.push({
          _type: "bodyImage",
          _key: key(),
          alt: node.alt || "",
          caption: node.caption || undefined,
          asset: { _type: "reference", _ref: assetId },
        });
        break;
      }
      case "youtube":
        out.push({
          _type: "youtube",
          _key: key(),
          url: node.src || undefined,
          youtubeId: node.youtubeId || undefined,
        });
        break;
      case "embed":
        out.push({
          _type: "embed",
          _key: key(),
          url: node.src || undefined,
          html: node.html || undefined,
        });
        break;
      case "table":
        out.push({
          _type: "htmlTable",
          _key: key(),
          html: node.html || "",
        });
        break;
      case "divider":
        // skip visual dividers
        break;
      case "html":
        if (node.html?.trim()) {
          out.push({
            _type: "embed",
            _key: key(),
            html: node.html,
          });
        }
        break;
      default:
        break;
    }
  }
  return out;
}

function mapSeo(seo, assetMap) {
  if (!seo) return undefined;
  const ogAsset =
    seo.openGraph?.image?.assetId && assetMap[seo.openGraph.image.assetId];
  const twAsset =
    seo.twitter?.image?.assetId && assetMap[seo.twitter.image.assetId];

  return {
    title: seo.title || undefined,
    description: seo.metaDesc || undefined,
    focusKeyword: seo.focusKeyword || undefined,
    canonical:
      seo.canonical && /^https?:\/\//i.test(seo.canonical)
        ? seo.canonical
        : undefined,
    breadcrumbsTitle: seo.breadcrumbsTitle || undefined,
    ogTitle: seo.openGraph?.title || undefined,
    ogDescription: seo.openGraph?.description || undefined,
    ogImage: ogAsset
      ? {
          _type: "image",
          asset: { _type: "reference", _ref: ogAsset },
          alt: seo.openGraph?.image?.alt || "",
        }
      : undefined,
    twitterTitle: seo.twitter?.title || undefined,
    twitterDescription: seo.twitter?.description || undefined,
    twitterImage: twAsset
      ? {
          _type: "image",
          asset: { _type: "reference", _ref: twAsset },
          alt: seo.twitter?.image?.alt || "",
        }
      : undefined,
    noIndex: Boolean(seo.robotsNoindex && seo.robotsNoindex !== "0"),
    noFollow: Boolean(seo.robotsNofollow && seo.robotsNofollow !== "0"),
  };
}

function mapMainImage(featured, assetMap) {
  if (!featured?.assetId) return undefined;
  const ref = assetMap[featured.assetId];
  if (!ref) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    alt: featured.alt || "",
  };
}

async function mapPool(items, concurrency, worker) {
  let i = 0;
  const results = new Array(items.length);
  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run()),
  );
  return results;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function withRetry(fn, label, retries = 5) {
  let last;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      const status = err?.statusCode || err?.response?.statusCode;
      const retryable =
        status === 429 || status >= 500 || err?.code === "ECONNRESET";
      if (!retryable || attempt === retries) throw err;
      const wait = Math.min(30000, 1000 * 2 ** attempt);
      console.warn(
        `Retry ${attempt}/${retries} ${label}: ${err.message || err} (wait ${wait}ms)`,
      );
      await sleep(wait);
    }
  }
  throw last;
}

function collectAssetJobs(backupDir, structuredDir) {
  /** @type {Map<string, { assetKey: string, localPath: string, filename: string, alt?: string }>} */
  const jobs = new Map();

  const attachmentsPath = path.join(structuredDir, "attachments.json");
  if (fs.existsSync(attachmentsPath)) {
    const attachments = JSON.parse(fs.readFileSync(attachmentsPath, "utf8"));
    for (const a of attachments) {
      if (!a.localPath || !a.existsLocally) continue;
      const abs = path.join(backupDir, a.localPath);
      if (!fs.existsSync(abs)) continue;
      const assetKey = a.assetId || `path:${a.localPath}`;
      if (jobs.has(assetKey)) continue;
      jobs.set(assetKey, {
        assetKey,
        localPath: a.localPath,
        filename: path.basename(a.localPath),
        alt: a.alt || "",
      });
    }
  }

  // Also scan docs for any localPath references
  for (const folder of ["pages", "posts"]) {
    const dir = path.join(structuredDir, folder);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const candidates = [
        doc.featuredImage,
        doc.seo?.openGraph?.image,
        doc.seo?.twitter?.image,
        ...(doc.body || []).filter((b) => b.type === "image"),
      ].filter(Boolean);
      for (const c of candidates) {
        if (!c.localPath) continue;
        const abs = path.join(backupDir, c.localPath);
        if (!fs.existsSync(abs)) continue;
        const assetKey = c.assetId || `path:${c.localPath}`;
        if (jobs.has(assetKey)) continue;
        jobs.set(assetKey, {
          assetKey,
          localPath: c.localPath,
          filename: path.basename(c.localPath),
          alt: c.alt || "",
        });
      }
    }
  }

  return [...jobs.values()];
}

async function main() {
  const { backup, skipAssets, limit } = parseArgs(process.argv);
  const env = loadEnvLocal();
  const projectId = env.SANITY_PROJECT_ID;
  const dataset = env.SANITY_DATASET || "production";
  const token = env.SANITY_API_TOKEN;
  if (!projectId || !token) {
    throw new Error("SANITY_PROJECT_ID and SANITY_API_TOKEN required in .env.local");
  }

  const backupDir = path.resolve(backup);
  const structuredDir = path.join(backupDir, "structured");
  if (!fs.existsSync(structuredDir)) {
    throw new Error(`Missing structured/ in ${backupDir}`);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  // Auth check
  const ping = await client.fetch(`count(*)`);
  console.log(`Connected to ${projectId}/${dataset} (docs=${ping})`);

  const mapPath = path.join(structuredDir, "sanity-asset-map.json");
  /** @type {Record<string, string>} */
  let assetMap = fs.existsSync(mapPath)
    ? JSON.parse(fs.readFileSync(mapPath, "utf8"))
    : {};

  if (!skipAssets) {
    const jobs = collectAssetJobs(backupDir, structuredDir);
    console.log(`Assets to upload: ${jobs.length} (already mapped: ${Object.keys(assetMap).length})`);

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    await mapPool(jobs, 3, async (job, idx) => {
      if (assetMap[job.assetKey]) {
        skipped++;
        return;
      }

      // Idempotent lookup by source id
      const existing = await withRetry(
        () =>
          client.fetch(
            `*[_type == "sanity.imageAsset" && source.id == $sid][0]._id`,
            { sid: job.assetKey },
          ),
        `lookup ${job.assetKey}`,
      );
      if (existing) {
        assetMap[job.assetKey] = existing;
        assetMap[`path:${job.localPath}`] = existing;
        skipped++;
        if ((idx + 1) % 50 === 0) {
          fs.writeFileSync(mapPath, JSON.stringify(assetMap, null, 2));
          console.log(`Progress assets ${idx + 1}/${jobs.length}`);
        }
        return;
      }

      const abs = path.join(backupDir, job.localPath);
      try {
        const stream = fs.createReadStream(abs);
        const asset = await withRetry(
          () =>
            client.assets.upload("image", stream, {
              filename: job.filename,
              source: {
                id: job.assetKey,
                name: "carewell-wordpress-export",
                url: `file://${job.localPath}`,
              },
            }),
          `upload ${job.filename}`,
        );
        assetMap[job.assetKey] = asset._id;
        assetMap[`path:${job.localPath}`] = asset._id;
        uploaded++;
      } catch (err) {
        failed++;
        console.error(`Failed upload ${job.localPath}:`, err.message || err);
      }

      if ((idx + 1) % 25 === 0 || idx + 1 === jobs.length) {
        fs.writeFileSync(mapPath, JSON.stringify(assetMap, null, 2));
        console.log(
          `Assets ${idx + 1}/${jobs.length} (uploaded=${uploaded}, skipped=${skipped}, failed=${failed})`,
        );
      }
    });

    fs.writeFileSync(mapPath, JSON.stringify(assetMap, null, 2));
    console.log(
      `Asset phase done. uploaded=${uploaded} skipped=${skipped} failed=${failed}`,
    );
  } else {
    console.log(`Skipping assets. Map entries: ${Object.keys(assetMap).length}`);
  }

  async function upsertDoc(type, filePath) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const legacyId = raw.wpId;
    const existingId = await client.fetch(
      `*[_type == $type && legacyId == $legacyId][0]._id`,
      { type, legacyId },
    );

    const doc = {
      _type: type,
      title: raw.title,
      slug: { _type: "slug", current: raw.slug || String(legacyId) },
      uri: raw.uri || undefined,
      legacyId,
      publishedAt: toIso(raw.date),
      modifiedAt: toIso(raw.modified),
      excerpt: raw.excerpt || undefined,
      mainImage: mapMainImage(raw.featuredImage, assetMap),
      seo: mapSeo(raw.seo, assetMap),
      body: mapBody(raw.body, assetMap),
      rawHtml: raw.rawHtml || undefined,
    };

    if (type === "post") {
      doc.categories = (raw.categories || []).map((c) => c.name || c.slug).filter(Boolean);
      doc.tags = (raw.tags || []).map((t) => t.name || t.slug).filter(Boolean);
    }

    if (existingId) {
      await withRetry(
        () => client.patch(existingId).set(doc).commit(),
        `patch ${type} ${legacyId}`,
      );
      return { id: existingId, action: "patched" };
    }

    const created = await withRetry(
      () => client.create(doc),
      `create ${type} ${legacyId}`,
    );
    return { id: created._id, action: "created" };
  }

  for (const type of ["page", "post"]) {
    const dir = path.join(structuredDir, type === "page" ? "pages" : "posts");
    let files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    if (limit > 0) files = files.slice(0, limit);
    console.log(`Importing ${files.length} ${type}s…`);

    let created = 0;
    let patched = 0;
    let failed = 0;

    await mapPool(files, 2, async (file, idx) => {
      try {
        const result = await upsertDoc(type, path.join(dir, file));
        if (result.action === "created") created++;
        else patched++;
      } catch (err) {
        failed++;
        console.error(`Failed ${type}/${file}:`, err.message || err);
      }
      if ((idx + 1) % 20 === 0 || idx + 1 === files.length) {
        console.log(
          `${type}s ${idx + 1}/${files.length} (created=${created}, patched=${patched}, failed=${failed})`,
        );
      }
    });
  }

  const counts = await client.fetch(`{
    "pages": count(*[_type == "page"]),
    "posts": count(*[_type == "post"]),
    "images": count(*[_type == "sanity.imageAsset"])
  }`);
  console.log("Sanity counts:", counts);
  console.log("Asset map:", mapPath);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

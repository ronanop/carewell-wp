/**
 * Structure a WordPress WXR backup into per-page/post JSON for later CMS import.
 *
 * Usage:
 *   node scripts/structure-wordpress-backup.mjs --backup "C:/path/to/carewell-backup-2026-07-28"
 *
 * Expects inside --backup:
 *   *.xml (WXR)
 *   export-media-urls-*.json (optional)
 *   media/ (year/month folders + media_metadata.json)
 *
 * Writes:
 *   structured/pages/*.json
 *   structured/posts/*.json
 *   structured/attachments.json
 *   structured/usage-index.json
 *   structured/manifest.json
 */

import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

function parseArgs(argv) {
  const out = { backup: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--backup") out.backup = argv[++i];
  }
  return out;
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function decodeEntities(text) {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    );
}

function cdata(block, tag) {
  const re = new RegExp(
    `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`,
  );
  const m = block.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<${tag}>([^<]*)</${tag}>`);
  return (block.match(re2) || [])[1] ?? "";
}

function plainTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : "";
}

function extractPostMeta(item) {
  const meta = {};
  for (const m of item.matchAll(
    /<wp:meta_key><!\[CDATA\[([^\]]+)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g,
  )) {
    meta[m[1]] = m[2];
  }
  return meta;
}

function extractCategories(item) {
  const cats = [];
  for (const m of item.matchAll(
    /<category\s+domain="category"\s+nicename="([^"]+)"><!\[CDATA\[([^\]]*)\]\]><\/category>/g,
  )) {
    cats.push({ slug: m[1], name: decodeEntities(m[2]) });
  }
  return cats;
}

function extractTags(item) {
  const tags = [];
  for (const m of item.matchAll(
    /<category\s+domain="post_tag"\s+nicename="([^"]+)"><!\[CDATA\[([^\]]*)\]\]><\/category>/g,
  )) {
    tags.push({ slug: m[1], name: decodeEntities(m[2]) });
  }
  return tags;
}

function slugify(input) {
  return String(input || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "untitled";
}

function uriFromLink(link, base) {
  if (!link) return "/";
  try {
    const u = new URL(link);
    let p = u.pathname || "/";
    if (!p.endsWith("/") && !path.extname(p)) p += "/";
    return p;
  } catch {
    return link.replace(base, "") || "/";
  }
}

function normalizeUploadsPath(urlOrPath) {
  if (!urlOrPath) return null;
  const cleaned = urlOrPath.split("?")[0].split("#")[0];
  const marker = "/wp-content/uploads/";
  const idx = cleaned.toLowerCase().indexOf(marker);
  if (idx >= 0) return cleaned.slice(idx + marker.length);
  // already relative like 2024/03/file.jpg
  if (/^\d{4}\/\d{2}\//.test(cleaned)) return cleaned.replace(/^\/+/, "");
  return null;
}

function stripSizeSuffix(filename) {
  // photo-300x200.jpg → photo.jpg ; keep photo.jpg
  return filename.replace(/-\d+x\d+(?=\.[^.]+$)/i, "");
}

function buildMediaIndex(backupDir, mediaDir) {
  /** @type {Map<string, any>} */
  const byId = new Map();
  /** @type {Map<string, any>} */
  const byRelPath = new Map();
  /** @type {Map<string, any>} */
  const byBasename = new Map();

  const metaPath = path.join(mediaDir, "media_metadata.json");
  if (fs.existsSync(metaPath)) {
    const rows = JSON.parse(readText(metaPath));
    for (const row of rows) {
      const id = String(row.ID ?? row.id ?? "");
      const rel = String(row.file_path || row.filename || "").replace(/\\/g, "/");
      const localPath = rel ? path.join("media", rel).replace(/\\/g, "/") : null;
      const exists = localPath
        ? fs.existsSync(path.join(backupDir, localPath))
        : false;
      const alt =
        row.meta?._wp_attachment_image_alt?.[0] ||
        row.title ||
        "";
      const asset = {
        assetId: id ? `wp-${id}` : null,
        wpId: id ? Number(id) : null,
        title: row.title || "",
        alt: String(alt),
        mimeType: row.mime_type || null,
        fileName: row.filename || path.basename(rel),
        relativePath: rel,
        localPath: exists ? localPath : null,
        exists,
      };
      if (asset.wpId) byId.set(String(asset.wpId), asset);
      if (rel) byRelPath.set(rel.toLowerCase(), asset);
      if (asset.fileName) {
        const base = asset.fileName.toLowerCase();
        if (!byBasename.has(base)) byBasename.set(base, asset);
        const stripped = stripSizeSuffix(base);
        if (!byBasename.has(stripped)) byBasename.set(stripped, asset);
      }
    }
  }

  const urlsFile = fs
    .readdirSync(backupDir)
    .find((f) => /^export-media-urls-.*\.json$/i.test(f));
  if (urlsFile) {
    const rows = JSON.parse(readText(path.join(backupDir, urlsFile)));
    for (const row of rows) {
      const id = String(row.ID ?? "");
      const url = row.URL || "";
      const rel = normalizeUploadsPath(url);
      const existing = (id && byId.get(id)) || (rel && byRelPath.get(rel.toLowerCase()));
      const localPath = rel
        ? path.join("media", rel).replace(/\\/g, "/")
        : existing?.localPath || null;
      const exists = localPath
        ? fs.existsSync(path.join(backupDir, localPath))
        : false;

      const usedInUrls = String(row["Used In (URLs)"] || "")
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const usedInPosts = String(row["Used In (posts)"] || "")
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const asset = {
        assetId: id ? `wp-${id}` : existing?.assetId || null,
        wpId: id ? Number(id) : existing?.wpId || null,
        title: row.Title || existing?.title || "",
        alt: row["Alt Text"] || existing?.alt || "",
        mimeType: row["MIME Type"] || existing?.mimeType || null,
        fileName: row["File Name"] || existing?.fileName || (rel ? path.basename(rel) : ""),
        relativePath: rel || existing?.relativePath || null,
        localPath: exists ? localPath : existing?.localPath || null,
        exists: exists || existing?.exists || false,
        wpUrl: url || null,
        uploadedToParent: row["Uploaded To (Parent)"] || "",
        uploadedToUrl: row["Uploaded To URL"] || "",
        usedInCount: Number(row["Used In (count)"] || 0) || 0,
        usedInPosts,
        usedInUrls,
      };

      if (asset.wpId) byId.set(String(asset.wpId), { ...existing, ...asset });
      if (asset.relativePath) {
        byRelPath.set(asset.relativePath.toLowerCase(), {
          ...(byRelPath.get(asset.relativePath.toLowerCase()) || {}),
          ...asset,
        });
      }
      if (asset.fileName) {
        const base = asset.fileName.toLowerCase();
        byBasename.set(base, { ...(byBasename.get(base) || {}), ...asset });
        byBasename.set(stripSizeSuffix(base), {
          ...(byBasename.get(stripSizeSuffix(base)) || {}),
          ...asset,
        });
      }
    }
  }

  // Fill any files on disk not in metadata
  function walk(dir, relBase = "") {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      if (name === "media_metadata.json") continue;
      const full = path.join(dir, name);
      const rel = path.join(relBase, name).replace(/\\/g, "/");
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full, rel);
        continue;
      }
      const key = rel.toLowerCase();
      if (byRelPath.has(key)) continue;
      const asset = {
        assetId: `file-${Buffer.from(rel).toString("hex").slice(0, 16)}`,
        wpId: null,
        title: name,
        alt: "",
        mimeType: null,
        fileName: name,
        relativePath: rel,
        localPath: path.join("media", rel).replace(/\\/g, "/"),
        exists: true,
        wpUrl: null,
      };
      byRelPath.set(key, asset);
      const base = name.toLowerCase();
      if (!byBasename.has(base)) byBasename.set(base, asset);
      if (!byBasename.has(stripSizeSuffix(base))) {
        byBasename.set(stripSizeSuffix(base), asset);
      }
    }
  }
  walk(mediaDir);

  return { byId, byRelPath, byBasename };
}

function resolveMedia(mediaIndex, { src, wpId, backupDir }) {
  if (wpId && mediaIndex.byId.has(String(wpId))) {
    const a = mediaIndex.byId.get(String(wpId));
    return refineLocal(a, backupDir);
  }
  const rel = normalizeUploadsPath(src);
  if (rel) {
    const direct = mediaIndex.byRelPath.get(rel.toLowerCase());
    if (direct) return refineLocal(direct, backupDir);
    const strippedRel = rel.replace(/-\d+x\d+(?=\.[^.]+$)/i, "");
    const stripped = mediaIndex.byRelPath.get(strippedRel.toLowerCase());
    if (stripped) return refineLocal(stripped, backupDir);
    const base = path.basename(rel).toLowerCase();
    const byBase =
      mediaIndex.byBasename.get(base) ||
      mediaIndex.byBasename.get(stripSizeSuffix(base));
    if (byBase) return refineLocal(byBase, backupDir);
  }
  if (src) {
    const base = path.basename(src.split("?")[0]).toLowerCase();
    const byBase =
      mediaIndex.byBasename.get(base) ||
      mediaIndex.byBasename.get(stripSizeSuffix(base));
    if (byBase) return refineLocal(byBase, backupDir);
  }
  return null;
}

function refineLocal(asset, backupDir) {
  if (!asset) return null;
  if (asset.localPath && fs.existsSync(path.join(backupDir, asset.localPath))) {
    return { ...asset, exists: true };
  }
  if (asset.relativePath) {
    const localPath = path.join("media", asset.relativePath).replace(/\\/g, "/");
    if (fs.existsSync(path.join(backupDir, localPath))) {
      return { ...asset, localPath, exists: true };
    }
  }
  return { ...asset, exists: Boolean(asset.exists) };
}

function textContent(el) {
  return decodeEntities(el?.text?.replace(/\s+/g, " ").trim() || "");
}

function extractWpImageId(className = "") {
  const m = String(className).match(/wp-image-(\d+)/);
  return m ? Number(m[1]) : null;
}

function youtubeIdFromSrc(src = "") {
  try {
    const u = new URL(src, "https://www.youtube.com");
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const embedIdx = parts.indexOf("embed");
    if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    const shortsIdx = parts.indexOf("shorts");
    if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
  } catch {
    /* ignore */
  }
  return null;
}

function structureHtml(html, mediaIndex, backupDir) {
  const body = [];
  const assetsUsed = new Set();
  const links = [];
  const unresolvedImages = [];

  if (!html?.trim()) {
    return { body, assetsUsed: [], links, unresolvedImages };
  }

  const root = parse(`<div id="cw-root">${html}</div>`, {
    blockTextElements: { script: true, style: true, pre: true },
  });
  const container = root.querySelector("#cw-root");
  if (!container) {
    return {
      body: [{ type: "html", html }],
      assetsUsed: [],
      links,
      unresolvedImages,
    };
  }

  const pushImage = (imgEl, extra = {}) => {
    const src = imgEl.getAttribute("src") || "";
    const wpId = extractWpImageId(imgEl.getAttribute("class") || "");
    const resolved = resolveMedia(mediaIndex, { src, wpId, backupDir });
    const alt = imgEl.getAttribute("alt") || resolved?.alt || "";
    const node = {
      type: "image",
      alt,
      wpSrc: src || null,
      wpImageId: wpId || resolved?.wpId || null,
      assetId: resolved?.assetId || null,
      localPath: resolved?.localPath || null,
      existsLocally: Boolean(resolved?.exists),
      ...extra,
    };
    if (resolved?.assetId) assetsUsed.add(resolved.assetId);
    if (!resolved?.localPath) {
      unresolvedImages.push({ src, wpId, alt });
    }
    body.push(node);
  };

  const walk = (el) => {
    for (const child of el.childNodes || []) {
      if (child.nodeType === 3) {
        const t = decodeEntities(String(child.text || "").replace(/\s+/g, " ").trim());
        if (t) body.push({ type: "paragraph", text: t });
        continue;
      }
      if (child.nodeType !== 1) continue;
      const tag = child.tagName?.toLowerCase?.() || "";

      if (["script", "style", "noscript"].includes(tag)) continue;

      if (/^h[1-6]$/.test(tag)) {
        body.push({
          type: "heading",
          level: Number(tag.slice(1)),
          text: textContent(child),
        });
        continue;
      }

      if (tag === "p") {
        const imgs = child.querySelectorAll?.("img") || [];
        if (imgs.length && textContent(child) === textContent(imgs[0])) {
          for (const img of imgs) pushImage(img);
          continue;
        }
        const text = textContent(child);
        if (text) body.push({ type: "paragraph", text });
        for (const img of imgs) pushImage(img);
        for (const a of child.querySelectorAll?.("a") || []) {
          const href = a.getAttribute("href");
          if (href) links.push({ href, text: textContent(a) });
        }
        continue;
      }

      if (tag === "ul" || tag === "ol") {
        const items = [...(child.querySelectorAll?.(":scope > li") || [])].map(
          (li) => textContent(li),
        ).filter(Boolean);
        body.push({
          type: "list",
          ordered: tag === "ol",
          items,
        });
        continue;
      }

      if (tag === "blockquote") {
        body.push({ type: "quote", text: textContent(child) });
        continue;
      }

      if (tag === "img") {
        pushImage(child);
        continue;
      }

      if (tag === "figure") {
        const img = child.querySelector?.("img");
        const caption = child.querySelector?.("figcaption");
        if (img) {
          pushImage(img, {
            caption: caption ? textContent(caption) : null,
          });
        } else {
          body.push({ type: "html", html: child.toString() });
        }
        continue;
      }

      if (tag === "table") {
        body.push({ type: "table", html: child.toString() });
        continue;
      }

      if (tag === "iframe" || tag === "video") {
        const src = child.getAttribute("src") || "";
        const yt = youtubeIdFromSrc(src);
        body.push({
          type: yt ? "youtube" : "embed",
          src,
          youtubeId: yt,
          html: child.toString(),
        });
        continue;
      }

      if (tag === "a") {
        const href = child.getAttribute("href") || "";
        const img = child.querySelector?.("img");
        if (img) {
          pushImage(img, { linkHref: href || null });
        } else {
          const text = textContent(child);
          if (href) links.push({ href, text });
          if (text) body.push({ type: "paragraph", text });
        }
        continue;
      }

      if (tag === "hr") {
        body.push({ type: "divider" });
        continue;
      }

      // Recurse into wrappers (div/section/span/elementor markup)
      if (child.childNodes?.length) {
        walk(child);
      }
    }
  };

  walk(container);

  // Also catch CSS background images in Elementor-ish markup
  for (const el of container.querySelectorAll?.("[style]") || []) {
    const style = el.getAttribute("style") || "";
    const m = style.match(/url\((['"]?)(.*?)\1\)/i);
    if (!m?.[2]) continue;
    const src = m[2];
    if (!/wp-content\/uploads|\.(jpe?g|png|webp|gif)(\?|$)/i.test(src)) continue;
    const resolved = resolveMedia(mediaIndex, { src, backupDir });
    const node = {
      type: "image",
      alt: el.getAttribute("aria-label") || "",
      wpSrc: src,
      wpImageId: resolved?.wpId || null,
      assetId: resolved?.assetId || null,
      localPath: resolved?.localPath || null,
      existsLocally: Boolean(resolved?.exists),
      source: "css-background",
    };
    if (resolved?.assetId) assetsUsed.add(resolved.assetId);
    // Avoid dumping thousands of duplicates — only if not already present
    if (!body.some((b) => b.type === "image" && b.wpSrc === src)) {
      body.push(node);
      if (!resolved?.localPath) unresolvedImages.push({ src, wpId: null, alt: "" });
    }
  }

  return {
    body,
    assetsUsed: [...assetsUsed],
    links,
    unresolvedImages,
  };
}

function yoastSeo(meta, mediaIndex, backupDir) {
  const ogImageUrl = meta["_yoast_wpseo_opengraph-image"] || "";
  const twitterImageUrl = meta["_yoast_wpseo_twitter-image"] || "";
  const ogId = meta["_yoast_wpseo_opengraph-image-id"] || "";
  const twId = meta["_yoast_wpseo_twitter-image-id"] || "";

  const resolve = (url, id) =>
    resolveMedia(mediaIndex, {
      src: url,
      wpId: id ? Number(id) : null,
      backupDir,
    });

  const og = resolve(ogImageUrl, ogId);
  const tw = resolve(twitterImageUrl, twId);

  return {
    title: decodeEntities(meta["_yoast_wpseo_title"] || ""),
    metaDesc: decodeEntities(meta["_yoast_wpseo_metadesc"] || ""),
    focusKeyword: decodeEntities(meta["_yoast_wpseo_focuskw"] || ""),
    canonical: meta["_yoast_wpseo_canonical"] || "",
    breadcrumbsTitle: decodeEntities(meta["_yoast_wpseo_bctitle"] || ""),
    openGraph: {
      title: decodeEntities(meta["_yoast_wpseo_opengraph-title"] || ""),
      description: decodeEntities(
        meta["_yoast_wpseo_opengraph-description"] || "",
      ),
      imageUrl: ogImageUrl || null,
      image: og
        ? {
            assetId: og.assetId,
            localPath: og.localPath,
            alt: og.alt,
            existsLocally: og.exists,
          }
        : null,
    },
    twitter: {
      title: decodeEntities(meta["_yoast_wpseo_twitter-title"] || ""),
      description: decodeEntities(
        meta["_yoast_wpseo_twitter-description"] || "",
      ),
      imageUrl: twitterImageUrl || null,
      image: tw
        ? {
            assetId: tw.assetId,
            localPath: tw.localPath,
            alt: tw.alt,
            existsLocally: tw.exists,
          }
        : null,
    },
    robotsNoindex: meta["_yoast_wpseo_meta-robots-noindex"] || "",
    robotsNofollow: meta["_yoast_wpseo_meta-robots-nofollow"] || "",
  };
}

function main() {
  const { backup } = parseArgs(process.argv);
  if (!backup) {
    die(
      'Usage: node scripts/structure-wordpress-backup.mjs --backup "C:/path/to/backup"',
    );
  }
  const backupDir = path.resolve(backup);
  if (!fs.existsSync(backupDir)) die(`Backup not found: ${backupDir}`);

  const xmlFile = fs
    .readdirSync(backupDir)
    .find((f) => f.toLowerCase().endsWith(".xml"));
  if (!xmlFile) die(`No WXR .xml found in ${backupDir}`);

  const mediaDir = path.join(backupDir, "media");
  if (!fs.existsSync(mediaDir)) {
    console.warn("Warning: media/ folder missing — image localPath may be null");
  }

  console.log("Building media index…");
  const mediaIndex = buildMediaIndex(backupDir, mediaDir);
  console.log(
    `Media indexed: ${mediaIndex.byId.size} by id, ${mediaIndex.byRelPath.size} by path`,
  );

  console.log("Reading WXR…");
  const xml = readText(path.join(backupDir, xmlFile));
  const baseUrl =
    (xml.match(/<wp:base_blog_url>([^<]+)<\/wp:base_blog_url>/) || [])[1] ||
    (xml.match(/<link>([^<]+)<\/link>/) || [])[1] ||
    "";

  const rawItems = xml.split("<item>").slice(1).map((chunk) => {
    const end = chunk.indexOf("</item>");
    return chunk.slice(0, end >= 0 ? end : chunk.length);
  });

  const outRoot = path.join(backupDir, "structured");
  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(outRoot, "pages"), { recursive: true });
  fs.mkdirSync(path.join(outRoot, "posts"), { recursive: true });

  const usageIndex = {};
  const attachments = [];
  const summary = {
    pages: 0,
    posts: 0,
    attachments: 0,
    skipped: 0,
    imagesResolved: 0,
    imagesUnresolved: 0,
  };

  const usedSlugs = { page: new Map(), post: new Map() };

  for (const item of rawItems) {
    const type = cdata(item, "wp:post_type");
    if (type === "attachment") {
      const id = Number(cdata(item, "wp:post_id") || 0);
      const url =
        cdata(item, "wp:attachment_url") ||
        plainTag(item, "guid") ||
        "";
      const meta = extractPostMeta(item);
      const resolved = resolveMedia(mediaIndex, {
        src: url,
        wpId: id,
        backupDir,
      });
      attachments.push({
        wpId: id,
        title: decodeEntities(cdata(item, "title")),
        url,
        mimeType: meta["_wp_attachment_mime_type"] || null,
        alt: meta["_wp_attachment_image_alt"] || resolved?.alt || "",
        assetId: resolved?.assetId || (id ? `wp-${id}` : null),
        localPath: resolved?.localPath || null,
        existsLocally: Boolean(resolved?.exists),
        parentPostId: Number(cdata(item, "wp:post_parent") || 0) || null,
      });
      summary.attachments++;
      continue;
    }

    if (type !== "page" && type !== "post") {
      summary.skipped++;
      continue;
    }

    const status = cdata(item, "wp:status");
    if (status !== "publish") {
      summary.skipped++;
      continue;
    }

    const id = Number(cdata(item, "wp:post_id") || 0);
    const title = decodeEntities(cdata(item, "title"));
    let slug = cdata(item, "wp:post_name") || slugify(title);
    const link = plainTag(item, "link");
    const uri = uriFromLink(link, baseUrl);
    const meta = extractPostMeta(item);
    const html = cdata(item, "content:encoded");
    const excerpt = cdata(item, "excerpt:encoded");

    const thumbId = meta._thumbnail_id ? Number(meta._thumbnail_id) : null;
    const featured = thumbId
      ? resolveMedia(mediaIndex, { wpId: thumbId, src: null, backupDir })
      : null;

    const structured = structureHtml(html, mediaIndex, backupDir);
    summary.imagesResolved += structured.body.filter(
      (b) => b.type === "image" && b.existsLocally,
    ).length;
    summary.imagesUnresolved += structured.unresolvedImages.length;

    const seo = yoastSeo(meta, mediaIndex, backupDir);
    const assetsUsed = new Set(structured.assetsUsed);
    if (featured?.assetId) assetsUsed.add(featured.assetId);
    if (seo.openGraph.image?.assetId) assetsUsed.add(seo.openGraph.image.assetId);

    for (const assetId of assetsUsed) {
      if (!usageIndex[assetId]) usageIndex[assetId] = [];
      usageIndex[assetId].push({
        type,
        wpId: id,
        slug,
        uri,
        roles: [
          featured?.assetId === assetId ? "featured" : null,
          seo.openGraph.image?.assetId === assetId ? "og" : null,
          "body",
        ].filter(Boolean),
      });
    }

    // Unique filename per type
    const slugMap = usedSlugs[type];
    let fileSlug = slug || `id-${id}`;
    if (slugMap.has(fileSlug)) {
      fileSlug = `${fileSlug}-${id}`;
    }
    slugMap.set(fileSlug, id);

    const doc = {
      type,
      wpId: id,
      title,
      slug,
      uri,
      link,
      status,
      date: cdata(item, "wp:post_date") || plainTag(item, "pubDate"),
      modified: cdata(item, "wp:post_modified") || "",
      authorLogin: cdata(item, "dc:creator"),
      parentId: Number(cdata(item, "wp:post_parent") || 0) || null,
      categories: extractCategories(item),
      tags: extractTags(item),
      excerpt: decodeEntities(excerpt),
      seo,
      featuredImage: featured
        ? {
            assetId: featured.assetId,
            wpId: featured.wpId,
            localPath: featured.localPath,
            alt: featured.alt || title,
            existsLocally: featured.exists,
            wpUrl: featured.wpUrl || null,
          }
        : null,
      body: structured.body,
      links: structured.links,
      assetsUsed: [...assetsUsed],
      unresolvedImages: structured.unresolvedImages,
      flags: {
        hasElementorMeta: meta._elementor_edit_mode === "builder",
        elementorDataExported: Boolean(meta._elementor_data?.trim?.()),
        rawHtmlLength: html.length,
      },
      rawHtml: html,
    };

    const folder = type === "page" ? "pages" : "posts";
    writeJson(path.join(outRoot, folder, `${fileSlug}.json`), doc);
    if (type === "page") summary.pages++;
    else summary.posts++;
  }

  writeJson(path.join(outRoot, "attachments.json"), attachments);
  writeJson(path.join(outRoot, "usage-index.json"), usageIndex);

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: {
      backupDir,
      xmlFile,
      baseUrl,
    },
    counts: summary,
    notes: [
      "Body structure is derived from content:encoded HTML (WXR).",
      "Elementor _elementor_data was empty in this export; rendered HTML is used instead.",
      "localPath is relative to the backup folder (e.g. media/2024/03/file.jpg).",
      "Keep rawHtml for lossless fallback during CMS import.",
    ],
  };
  writeJson(path.join(outRoot, "manifest.json"), manifest);

  console.log("\nDone.");
  console.log(JSON.stringify(manifest.counts, null, 2));
  console.log(`Output: ${outRoot}`);
}

main();

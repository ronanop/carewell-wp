/**
 * Sync WordPress posts → Sanity via WPGraphQL.
 *
 * Usage:
 *   node scripts/import-posts-from-graphql.mjs
 *   node scripts/import-posts-from-graphql.mjs --only /hyperbaric-oxygen-therapy-in-delhi-is-it-the-right-treatment-for-you/
 *   node scripts/import-posts-from-graphql.mjs --limit 5
 *
 * Reads WORDPRESS_GRAPHQL_ENDPOINT + Sanity creds from .env / .env.local
 */

import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { parse } from "node-html-parser";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ||
  "https://www.carewellmedicalcentre.com/graphql";

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function parseArgs(argv) {
  const out = { only: [], limit: 0, skipAssets: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--only") out.only.push(normalizeUri(argv[++i]));
    if (argv[i] === "--limit") out.limit = Number(argv[++i]) || 0;
    if (argv[i] === "--skip-assets") out.skipAssets = true;
  }
  return out;
}

function normalizeUri(input) {
  if (!input) return "/";
  try {
    if (/^https?:\/\//i.test(input)) {
      const { pathname } = new URL(input);
      input = pathname;
    }
  } catch {
    /* keep */
  }
  let u = input.startsWith("/") ? input : `/${input}`;
  if (!u.endsWith("/")) u += "/";
  return u.toLowerCase();
}

function stripHtml(html) {
  if (!html) return "";
  return parse(html).text.replace(/\s+/g, " ").trim();
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function youtubeIdFromSrc(src) {
  if (!src) return null;
  try {
    const u = new URL(src, "https://www.youtube.com");
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const embedIdx = parts.indexOf("embed");
    if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
  } catch {
    /* ignore */
  }
  return null;
}

function textContent(el) {
  return (el?.text || "").replace(/\s+/g, " ").trim();
}

function textBlock(style, text) {
  return {
    _type: "block",
    _key: key(),
    style: style || "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text: text || "", marks: [] }],
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
    children: [{ _type: "span", _key: key(), text: item, marks: [] }],
  }));
}

function structureHtml(html) {
  const body = [];
  if (!html?.trim()) return body;

  const root = parse(`<div id="cw-root">${html}</div>`, {
    blockTextElements: { script: true, style: true, pre: true },
  });
  const container = root.querySelector("#cw-root");
  if (!container) return [{ type: "html", html }];

  const pushImage = (imgEl, extra = {}) => {
    body.push({
      type: "image",
      alt: imgEl.getAttribute("alt") || "",
      src: imgEl.getAttribute("src") || "",
      caption: extra.caption || undefined,
    });
  };

  const walk = (el) => {
    for (const child of el.childNodes || []) {
      if (child.nodeType === 3) {
        const t = String(child.text || "")
          .replace(/\s+/g, " ")
          .trim();
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
        const text = textContent(child);
        if (text) body.push({ type: "paragraph", text });
        for (const img of imgs) pushImage(img);
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        const items = [...(child.querySelectorAll?.(":scope > li") || [])]
          .map((li) => textContent(li))
          .filter(Boolean);
        body.push({ type: "list", ordered: tag === "ol", items });
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
        } else if (child.toString().trim()) {
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
      if (child.childNodes?.length) walk(child);
    }
  };

  walk(container);
  return body;
}

async function graphql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

const POSTS_QUERY = `
query Posts($first: Int!, $after: String) {
  posts(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      databaseId
      title
      uri
      slug
      date
      modified
      excerpt
      content
      author { node { name description } }
      categories { nodes { name } }
      tags { nodes { name } }
      featuredImage {
        node { sourceUrl altText }
      }
      seo {
        title
        metaDesc
        canonical
        metaRobotsNoindex
        opengraphTitle
        opengraphDescription
      }
    }
  }
}
`;

async function fetchAllPosts({ only, limit }) {
  const onlySet = new Set(only.map(normalizeUri));
  const out = [];
  let after = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await graphql(POSTS_QUERY, { first: 50, after });
    const conn = data.posts;
    for (const node of conn.nodes || []) {
      const uri = normalizeUri(node.uri || `/${node.slug}/`);
      if (onlySet.size && !onlySet.has(uri)) continue;
      out.push(node);
      if (limit > 0 && out.length >= limit) return out;
    }
    hasNextPage = Boolean(conn.pageInfo?.hasNextPage);
    after = conn.pageInfo?.endCursor || null;
    if (onlySet.size && out.length >= onlySet.size) break;
  }
  return out;
}

async function uploadFromUrl(client, url, filenameHint) {
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const filename =
    filenameHint ||
    path.basename(new URL(url).pathname) ||
    `wp-${Date.now()}.jpg`;
  const asset = await client.assets.upload("image", buf, {
    filename,
    contentType,
  });
  return asset._id;
}

async function mapBody(nodes, client, { skipAssets }) {
  const out = [];
  const urlCache = new Map();

  for (const node of nodes || []) {
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
        if (skipAssets || !node.src) break;
        let assetId = urlCache.get(node.src);
        if (!assetId) {
          try {
            assetId = await uploadFromUrl(client, node.src);
            if (assetId) urlCache.set(node.src, assetId);
          } catch (err) {
            console.warn(`  skip image: ${err.message}`);
            break;
          }
        }
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
      case "html":
        if (node.html?.trim()) {
          out.push({
            _type: "embed",
            _key: key(),
            html: node.html,
            url: node.src || undefined,
          });
        }
        break;
      case "table":
        out.push({
          _type: "htmlTable",
          _key: key(),
          html: node.html || "",
        });
        break;
      default:
        break;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !token) {
    throw new Error("SANITY_PROJECT_ID and SANITY_API_TOKEN required");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    useCdn: false,
    token,
  });

  console.log(`Fetching posts from ${ENDPOINT}…`);
  const posts = await fetchAllPosts(args);
  console.log(`Selected ${posts.length} posts`);

  let created = 0;
  let patched = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const wp = posts[i];
    const uri = normalizeUri(wp.uri || `/${wp.slug}/`);
    const legacyId = wp.databaseId;
    console.log(`[${i + 1}/${posts.length}] ${uri}`);

    try {
      const excerpt = stripHtml(wp.excerpt);
      const structured = structureHtml(wp.content || "");
      const body = await mapBody(structured, client, {
        skipAssets: args.skipAssets,
      });
      const plain = stripHtml(wp.content || "");

      let mainImage;
      const featUrl = wp.featuredImage?.node?.sourceUrl;
      if (featUrl && !args.skipAssets) {
        try {
          const assetId = await uploadFromUrl(client, featUrl);
          if (assetId) {
            mainImage = {
              _type: "image",
              asset: { _type: "reference", _ref: assetId },
              alt: wp.featuredImage?.node?.altText || wp.title || "",
            };
          }
        } catch (err) {
          console.warn(`  featured image skip: ${err.message}`);
        }
      }

      const doc = {
        _type: "post",
        title: wp.title,
        slug: { _type: "slug", current: wp.slug || String(legacyId) },
        uri,
        legacyId,
        publishedAt: wp.date || undefined,
        modifiedAt: wp.modified || undefined,
        excerpt: excerpt || undefined,
        categories: (wp.categories?.nodes || [])
          .map((c) => c.name)
          .filter(Boolean),
        tags: (wp.tags?.nodes || []).map((t) => t.name).filter(Boolean),
        authorName: wp.author?.node?.name || "Dr. Sandeep Bhasin",
        readTimeMinutes: estimateReadTime(plain),
        mainImage,
        seo: wp.seo
          ? {
              title: wp.seo.title || undefined,
              description: wp.seo.metaDesc || undefined,
              canonical: wp.seo.canonical || undefined,
              noIndex: /nofollow|noindex/i.test(
                String(wp.seo.metaRobotsNoindex || ""),
              ),
              ogTitle: wp.seo.opengraphTitle || undefined,
              ogDescription: wp.seo.opengraphDescription || undefined,
            }
          : undefined,
        body,
        rawHtml: wp.content || undefined,
        midArticleCta: {
          enabled: true,
          headline: "Have questions? Book a free 15-min consultation",
          buttonLabel: "Book free consultation",
        },
      };

      const existingId = await client.fetch(
        `*[_type == "post" && legacyId == $legacyId][0]._id`,
        { legacyId },
      );

      if (existingId) {
        await client.patch(existingId).set(doc).commit();
        patched++;
      } else {
        await client.create(doc);
        created++;
      }
    } catch (err) {
      failed++;
      console.error(`  FAILED: ${err.message || err}`);
    }
  }

  const counts = await client.fetch(`{ "posts": count(*[_type == "post"]) }`);
  console.log({ created, patched, failed, counts });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

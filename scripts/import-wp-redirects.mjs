/**
 * Import WordPress Redirection plugin rules into Sanity `redirect` documents.
 *
 * Managed afterwards in Sanity Studio → Redirects. Middleware applies enabled
 * rules on the public site (cached ~1 minute; live miss lookup for new paths).
 *
 * Usage:
 *   node scripts/import-wp-redirects.mjs
 *   node scripts/import-wp-redirects.mjs --dump "C:/path/to/dump.sql.gz" --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createClient } from "@sanity/client";

import {
  resolveSanityWriteToken,
  sanityProjectConfig,
} from "./lib/sanityEnv.mjs";

const DEFAULT_DUMP =
  "C:/Users/HP/Downloads/u713546709_9kkrJ.carewellmedicalcentre-com.20260906110636.sql.gz";

const OWN_HOSTS = new Set([
  "carewellmedicalcentre.com",
  "www.carewellmedicalcentre.com",
  "carewellmedicalcentre.in",
  "www.carewellmedicalcentre.in",
]);

function parseArgs(argv) {
  const out = { dump: DEFAULT_DUMP, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--dump") out.dump = argv[++i];
    if (argv[i] === "--dry-run") out.dryRun = true;
  }
  return out;
}

function normalizePath(pathname) {
  const pathOnly = pathname.split("?")[0].split("#")[0];
  if (!pathOnly.startsWith("/")) return `/${pathOnly}`;
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) return pathOnly;
  if (pathOnly === "/") return pathOnly;
  return `${pathOnly}/`;
}

function normalizeTo(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const url = new URL(value);
      if (OWN_HOSTS.has(url.hostname.toLowerCase())) {
        return `${normalizePath(url.pathname)}${url.search}`;
      }
      return value;
    } catch {
      return value;
    }
  }
  const [pathPart, query = ""] = value.split("?");
  const normalized = normalizePath(pathPart.startsWith("/") ? pathPart : `/${pathPart}`);
  return query ? `${normalized}?${query}` : normalized;
}

function extractInsert(sql, table) {
  const marker = `INSERT INTO \`${table}\``;
  const start = sql.indexOf(marker);
  if (start < 0) return "";
  const end = sql.indexOf(";\n", start);
  return end === -1 ? sql.slice(start) : sql.slice(start, end);
}

function parseTuples(statement) {
  const valuesAt = statement.indexOf("VALUES");
  if (valuesAt < 0) return [];
  const rows = [];
  let i = statement.indexOf("(", valuesAt);
  while (i !== -1 && i < statement.length) {
    const parsed = parseTuple(statement, i);
    if (!parsed) break;
    rows.push(parsed.values);
    i = parsed.next;
    while (i < statement.length && /[\s,]/.test(statement[i])) i += 1;
    if (statement[i] !== "(") break;
  }
  return rows;
}

function parseTuple(sql, start) {
  if (sql[start] !== "(") return null;
  const values = [];
  let i = start + 1;
  while (i < sql.length) {
    while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r") i += 1;
    if (sql[i] === ")") return { values, next: i + 1 };
    const parsed = parseValue(sql, i);
    values.push(parsed.value);
    i = parsed.next;
    while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r") i += 1;
    if (sql[i] === ",") i += 1;
    else if (sql[i] === ")") return { values, next: i + 1 };
  }
  return { values, next: i };
}

function parseValue(sql, i) {
  if (sql.startsWith("NULL", i)) return { value: null, next: i + 4 };
  if (sql[i] === "'") {
    let out = "";
    i += 1;
    while (i < sql.length) {
      const ch = sql[i];
      if (ch === "\\") {
        const next = sql[i + 1];
        if (next === "n") out += "\n";
        else if (next === "r") out += "\r";
        else if (next === "t") out += "\t";
        else if (next === "0") out += "\0";
        else out += next ?? "";
        i += 2;
        continue;
      }
      if (ch === "'") {
        if (sql[i + 1] === "'") {
          out += "'";
          i += 2;
          continue;
        }
        return { value: out, next: i + 1 };
      }
      out += ch;
      i += 1;
    }
    return { value: out, next: i };
  }
  let j = i;
  while (j < sql.length && sql[j] !== "," && sql[j] !== ")") j += 1;
  const raw = sql.slice(i, j).trim();
  if (raw === "") return { value: null, next: j };
  const num = Number(raw);
  return { value: Number.isNaN(num) ? raw : num, next: j };
}

function rowToRedirect(row) {
  // wp_redirection_items:
  // id, url, match_url, match_data, regex, position, last_count, last_access,
  // group_id, status, action_type, action_code, action_data, match_type, title
  const [
    id,
    url,
    ,
    ,
    regex,
    position,
    ,
    ,
    ,
    status,
    actionType,
    actionCode,
    actionData,
  ] = row;

  return {
    wpId: Number(id),
    from: typeof url === "string" ? url : "",
    to: typeof actionData === "string" ? actionData : "",
    regex: Number(regex) === 1,
    position: Number(position) || 0,
    enabled: status === "enabled",
    actionType: String(actionType || ""),
    actionCode: Number(actionCode) || 0,
  };
}

function loadRedirectRows(dumpPath) {
  const abs = path.resolve(dumpPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Dump not found: ${abs}`);
  }
  const gz = fs.readFileSync(abs);
  const sql = zlib.gunzipSync(gz).toString("utf8");
  const statement = extractInsert(sql, "wp_redirection_items");
  if (!statement) {
    throw new Error("wp_redirection_items INSERT not found in dump");
  }
  return parseTuples(statement).map(rowToRedirect);
}

function buildDocs(rows) {
  const skipped = [];
  const candidates = [];

  for (const row of rows) {
    if (row.regex || row.actionType !== "url" || !row.from || !row.to) {
      skipped.push({ wpId: row.wpId, reason: "not an exact URL redirect" });
      continue;
    }
    if (row.actionCode !== 301 && row.actionCode !== 302) {
      skipped.push({ wpId: row.wpId, reason: `unsupported code ${row.actionCode}` });
      continue;
    }
    const from = normalizePath(row.from);
    const to = normalizeTo(row.to);
    if (!from || !to) {
      skipped.push({ wpId: row.wpId, reason: "empty path" });
      continue;
    }
    if (from === to) {
      skipped.push({ wpId: row.wpId, reason: "self-redirect" });
      continue;
    }
    candidates.push({
      _id: `redirect-wp-${row.wpId}`,
      _type: "redirect",
      from,
      to,
      permanent: row.actionCode === 301,
      isEnabled: row.enabled,
      position: row.position,
      wpId: row.wpId,
    });
  }

  candidates.sort((a, b) => a.position - b.position || a.wpId - b.wpId);

  const byFrom = new Map();
  const docs = [];
  for (const doc of candidates) {
    const existing = byFrom.get(doc.from);
    if (existing) {
      skipped.push({
        wpId: doc.wpId,
        reason: `duplicate of / rule ${existing.wpId} (${doc.from})`,
      });
      continue;
    }
    byFrom.set(doc.from, doc);
    const { position: _position, wpId: _wpId, ...sanityDoc } = doc;
    docs.push(sanityDoc);
  }

  return { docs, skipped };
}

async function main() {
  const args = parseArgs(process.argv);
  const rows = loadRedirectRows(args.dump);
  const { docs, skipped } = buildDocs(rows);
  const enabled = docs.filter((doc) => doc.isEnabled).length;

  console.log(`Parsed ${rows.length} WordPress redirect rows`);
  console.log(`Importing ${docs.length} (${enabled} enabled, ${docs.length - enabled} disabled)`);
  console.log(`Skipped ${skipped.length}`);
  if (skipped.length) {
    const reasons = {};
    for (const item of skipped) {
      const key = item.reason.replace(/rule \d+.*/, "rule …");
      reasons[key] = (reasons[key] || 0) + 1;
    }
    console.log("Skip reasons:", reasons);
  }
  console.log("Sample:");
  for (const doc of docs.slice(0, 8)) {
    console.log(`  ${doc.isEnabled ? "on " : "off"} ${doc.from} -> ${doc.to}`);
  }

  if (args.dryRun) {
    console.log("Dry run — nothing written");
    return;
  }

  const { projectId, dataset, env } = sanityProjectConfig();
  const token = resolveSanityWriteToken(env);
  if (!token) {
    throw new Error("SANITY_WRITE_TOKEN (or SANITY_API_TOKEN) is required");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    token,
    useCdn: false,
  });

  const existing = await client.fetch(
    `*[_type == "redirect" && !(_id in path("drafts.**"))]{_id, from}`,
  );
  const owned = new Set(
    (existing || [])
      .filter((doc) => String(doc._id).startsWith("redirect-wp-"))
      .map((doc) => doc._id),
  );
  const foreignFrom = new Map(
    (existing || [])
      .filter((doc) => !String(doc._id).startsWith("redirect-wp-"))
      .map((doc) => [normalizePath(doc.from || ""), doc._id]),
  );

  const toWrite = [];
  for (const doc of docs) {
    const foreignId = foreignFrom.get(doc.from);
    if (foreignId) {
      console.log(`Keep existing ${foreignId} for ${doc.from}`);
      continue;
    }
    toWrite.push(doc);
    owned.delete(doc._id);
  }

  const batchSize = 50;
  for (let i = 0; i < toWrite.length; i += batchSize) {
    const batch = toWrite.slice(i, i + batchSize);
    const tx = client.transaction();
    for (const doc of batch) tx.createOrReplace(doc);
    await tx.commit();
    console.log(`Wrote ${Math.min(i + batch.length, toWrite.length)}/${toWrite.length}`);
  }

  if (owned.size) {
    const stale = [...owned];
    const tx = client.transaction();
    for (const id of stale) tx.delete(id);
    await tx.commit();
    console.log(`Removed ${stale.length} stale WordPress redirect docs`);
  }

  console.log("Done. Manage them in Sanity Studio → Redirects.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

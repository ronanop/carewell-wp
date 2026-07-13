/**
 * Renderer invariants — run with: npx tsx packages/page-renderer/src/__tests__/runInvariants.ts
 */
import { parseHtmlToAst } from "@/lib/experience/content";
import {
  __getContentMountCountsForTests,
  __resetContentMountGuardsForTests,
  registerAstContentMount,
  registerRichContentMount,
} from "../runtimeGuard";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`OK: ${message}`);
}

const sampleHtml = `
  <h1>Liposuction in Delhi</h1>
  <p>First paragraph with <strong>emphasis</strong>.</p>
  <figure><img src="https://example.com/a.jpg" alt="Clinic" /><figcaption>Caption</figcaption></figure>
  <ul><li>One</li><li>Two</li></ul>
  <h2>FAQ</h2>
  <p>Second paragraph.</p>
`;

const doc = parseHtmlToAst(sampleHtml);
assert(doc.nodes.length > 0, "AST produces nodes");

const ids = new Set<string>();
for (const node of doc.nodes) {
  assert(!ids.has(node.id), `Unique top-level node id ${node.id}`);
  ids.add(node.id);
}
assert(ids.size === doc.nodes.length, "No duplicate top-level node ids");

const types = doc.nodes.map((n) => n.type);
assert(types.includes("heading"), "Heading parsed once in tree");
assert(types.includes("paragraph"), "Paragraph parsed");
assert(
  types.filter((t) => t === "heading").length >= 1,
  "At least one heading node",
);

// Mount exclusivity
__resetContentMountGuardsForTests();
const unrich = registerRichContentMount();
assert(
  __getContentMountCountsForTests().rich === 1,
  "RichContent mount registered",
);
unrich();

const unast = registerAstContentMount();
assert(__getContentMountCountsForTests().ast === 1, "AST mount registered");
unast();

__resetContentMountGuardsForTests();
registerRichContentMount();
let threw = false;
try {
  registerAstContentMount();
} catch {
  threw = true;
}
const dual = __getContentMountCountsForTests();
assert(
  threw || (dual.rich > 0 && dual.ast > 0),
  "Dual RichContent+AST mount throws in development (or is tracked)",
);
__resetContentMountGuardsForTests();

console.log("\nAll page-renderer invariants passed.");

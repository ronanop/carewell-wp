import type { ContentDocument, ContentNode } from "@/types/content-ast";

export type LayoutSuggestion = {
  id: string;
  severity: "info" | "warning" | "tip";
  message: string;
  actionLabel?: string;
  /** Optional transform / fix id for one-click apply later */
  actionId?: string;
  nodeId?: string;
};

/**
 * Lightweight layout intelligence — analyzes the content AST for improvements.
 * One-click apply hooks land in a later milestone.
 */
export function analyzeLayout(doc: ContentDocument): LayoutSuggestion[] {
  const suggestions: LayoutSuggestion[] = [];
  const headings: ContentNode[] = [];
  let paragraphRun = 0;

  function walk(nodes: ContentNode[]) {
    for (const node of nodes) {
      if (node.type === "heading") {
        headings.push(node);
        paragraphRun = 0;
        const level = node.attributes.level ?? 2;
        if (level === 1 && headings.filter((h) => h.attributes.level === 1).length > 1) {
          suggestions.push({
            id: `h1-dup-${node.id}`,
            severity: "warning",
            message: "Multiple H1 headings detected — keep a single page title.",
            nodeId: node.id,
          });
        }
      }

      if (node.type === "paragraph") {
        paragraphRun += 1;
        if (paragraphRun >= 3) {
          suggestions.push({
            id: `paras-to-cards-${node.id}`,
            severity: "tip",
            message: "Several paragraphs in a row — consider converting into cards or an accordion.",
            actionLabel: "Convert to accordion",
            actionId: "paragraphs-to-accordion",
            nodeId: node.id,
          });
          paragraphRun = 0;
        }
      } else if (node.type !== "list-item") {
        paragraphRun = 0;
      }

      if (node.type === "image" && !node.attributes.alt) {
        suggestions.push({
          id: `alt-${node.id}`,
          severity: "warning",
          message: "This image is missing alt text.",
          actionLabel: "Add alt text",
          nodeId: node.id,
        });
      }

      if (
        node.type === "image" &&
        node.attributes.width &&
        node.attributes.width < 320
      ) {
        suggestions.push({
          id: `img-small-${node.id}`,
          severity: "info",
          message: "This image may be too small for a hero or feature slot.",
          nodeId: node.id,
        });
      }

      if (node.type === "table") {
        suggestions.push({
          id: `table-pricing-${node.id}`,
          severity: "tip",
          message: "This table may read better as pricing cards on mobile.",
          actionLabel: "Convert to pricing cards",
          actionId: "table-to-pricing",
          nodeId: node.id,
        });
      }

      walk(node.children);
    }
  }

  walk(doc.nodes);

  // Deduplicate tip spam
  const seen = new Set<string>();
  return suggestions.filter((item) => {
    const key = `${item.actionId ?? item.id}:${item.severity}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

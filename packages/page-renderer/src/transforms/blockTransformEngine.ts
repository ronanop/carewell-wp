import type { ContentNode, ContentNodeType } from "@/types/content-ast";

export type BlockTransformSuggestion = {
  id: string;
  label: string;
  description: string;
  from: ContentNodeType[];
  to: ContentNodeType;
};

const CATALOG: BlockTransformSuggestion[] = [
  {
    id: "paragraph-to-callout",
    label: "Convert to Callout",
    description: "Turn this paragraph into a tip / info callout.",
    from: ["paragraph"],
    to: "callout",
  },
  {
    id: "paragraph-to-quote",
    label: "Convert to Quote",
    description: "Turn this paragraph into a doctor / patient quote.",
    from: ["paragraph"],
    to: "quote",
  },
  {
    id: "image-to-gallery",
    label: "Convert to Gallery",
    description: "Promote this image into a gallery block.",
    from: ["image", "figure"],
    to: "gallery",
  },
  {
    id: "heading-paragraph-to-feature",
    label: "Convert to Feature Card",
    description: "Combine heading + paragraph into a feature card group.",
    from: ["heading", "paragraph"],
    to: "group",
  },
];

/** Suggest transforms for the currently selected node(s). */
export function suggestBlockTransforms(
  nodes: ContentNode[],
): BlockTransformSuggestion[] {
  if (!nodes.length) return [];
  const types = new Set(nodes.map((n) => n.type));
  return CATALOG.filter((item) => item.from.some((t) => types.has(t)));
}

/**
 * Apply a transform. Returns a new node; caller persists via contentOverrides.
 * Foundation for smart editing — expand per transform id over time.
 */
export function applyBlockTransform(
  node: ContentNode,
  transformId: string,
): ContentNode {
  const suggestion = CATALOG.find((item) => item.id === transformId);
  if (!suggestion) return node;

  if (transformId === "paragraph-to-callout") {
    return {
      ...node,
      type: "callout",
      attributes: { ...node.attributes, calloutTone: "info" },
      source: "studio",
    };
  }
  if (transformId === "paragraph-to-quote") {
    return { ...node, type: "quote", source: "studio" };
  }
  if (transformId === "image-to-gallery") {
    return {
      ...node,
      type: "gallery",
      children: [{ ...node, type: "image" }],
      source: "studio",
    };
  }
  return { ...node, type: suggestion.to, source: "studio" };
}

import { stableNodeId } from "@/lib/experience/content/stableId";
import type { ContentNode, ContentNodeType } from "@/types/content-ast";

export function createStudioContentNode(
  type: ContentNodeType,
  text = "",
): ContentNode {
  const id = stableNodeId(["studio", type, Date.now(), Math.random()]);
  const base: ContentNode = {
    id,
    type,
    source: "studio",
    fingerprint: id,
    children: [],
    attributes: {},
    styles: {},
    bindings: {},
    animations: {},
    responsive: {},
    visibility: "always",
    metadata: { order: 0 },
  };

  switch (type) {
    case "heading":
      return {
        ...base,
        runs: [{ text: text || "Heading" }],
        attributes: { level: 2 },
      };
    case "paragraph":
      return {
        ...base,
        runs: [{ text: text || "Start typing…" }],
      };
    case "quote":
      return {
        ...base,
        runs: [{ text: text || "Quote" }],
      };
    case "button":
      return {
        ...base,
        runs: [{ text: text || "Learn more" }],
        attributes: {
          href: "#",
          buttonVariant: "primary",
          buttonSize: "md",
        },
      };
    case "divider":
      return base;
    case "callout":
      return {
        ...base,
        runs: [{ text: text || "Helpful note for patients." }],
        attributes: { calloutTone: "info" },
      };
    case "image":
      return {
        ...base,
        attributes: {
          src: "",
          alt: "",
          loading: "lazy",
        },
      };
    case "list":
      return {
        ...base,
        attributes: { listStyle: "bulleted" },
        children: [
          {
            ...createStudioContentNode("paragraph", "List item"),
            type: "list-item",
            runs: [{ text: "List item" }],
            children: [],
          },
        ],
      };
    default:
      return {
        ...base,
        type: "paragraph",
        runs: [{ text: text || "New block" }],
      };
  }
}

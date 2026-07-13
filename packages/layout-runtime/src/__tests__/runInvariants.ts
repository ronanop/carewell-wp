import assert from "node:assert/strict";

import { createPageLayoutTree } from "@carewell/layout-engine";
import { resolveLayoutRuntime } from "@carewell/layout-runtime";
import {
  panImagePosition,
  reduceInteraction,
  INITIAL_INTERACTION,
  setProperty,
  createPropertyGraph,
  getProperty,
} from "@carewell/direct-manipulation";

const sections = [
  { id: "hero-1", type: "hero" },
  { id: "content-1", type: "content" },
  { id: "cta-1", type: "cta" },
];

const flat = resolveLayoutRuntime({ sections, isEditor: false });
assert.equal(flat.root.kind, "page");
assert.deepEqual(flat.sectionOrder, ["hero-1", "content-1", "cta-1"]);

let tree = createPageLayoutTree(sections);
tree = {
  ...tree,
  root: {
    ...tree.root,
    children: [
      {
        id: "row-1",
        kind: "row",
        name: "Row",
        children: [
          {
            id: "col-a",
            kind: "column",
            children: [tree.root.children[0]!],
          },
          {
            id: "col-b",
            kind: "column",
            children: [tree.root.children[1]!, tree.root.children[2]!],
          },
        ],
      },
    ],
  },
};

const nested = resolveLayoutRuntime({
  sections,
  layoutTree: tree,
  isEditor: true,
});
assert.equal(nested.root.children[0]?.kind, "row");
assert.equal(nested.root.children[0]?.style.display, "flex");
assert.deepEqual(nested.sectionOrder, ["hero-1", "content-1", "cta-1"]);

const frame = panImagePosition(
  {
    objectPositionX: 50,
    objectPositionY: 50,
    scale: 1,
    objectFit: "cover",
    crop: null,
    frameWidth: 400,
    frameHeight: 300,
    borderRadius: 0,
    opacity: 1,
    rotate: 0,
  },
  10,
  -5,
);
assert.equal(frame.objectPositionX, 60);
assert.equal(frame.objectPositionY, 45);

let interaction = INITIAL_INTERACTION;
interaction = reduceInteraction(interaction, {
  type: "select",
  target: { kind: "image", id: "img-1" },
});
assert.equal(interaction.primary?.id, "img-1");
interaction = reduceInteraction(interaction, { type: "set-mode", mode: "crop" });
assert.equal(interaction.mode, "crop");

let graph = createPropertyGraph();
graph = setProperty(graph, "Hero.imageTransform.objectPositionX", 40);
assert.equal(getProperty(graph, "Hero.imageTransform.objectPositionX"), 40);

console.log("OK: layout-runtime nested row");
console.log("OK: direct-manipulation image pan");
console.log("OK: interaction + property graph");
console.log("All Phase 4.5 runtime invariants passed.");

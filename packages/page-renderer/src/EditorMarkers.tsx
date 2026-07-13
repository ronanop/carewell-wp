/**
 * Layout-neutral markers for Experience Studio hit-testing.
 * Uses display:contents so markers never affect typography, spacing, or flow.
 */
"use client";

import type { ReactNode } from "react";

import type { ContentNode } from "@/types/content-ast";
import type { SectionConfig } from "@/types/presentation-config";

export function SectionMarker({
  section,
  children,
}: {
  section: SectionConfig;
  children: ReactNode;
}) {
  return (
    <div
      data-presentation-section={section.id}
      data-presentation-section-type={section.type}
      data-editor-marker="section"
      className="contents"
    >
      {children}
    </div>
  );
}

export function ContentNodeMarker({
  node,
  children,
}: {
  node: ContentNode;
  children: ReactNode;
}) {
  return (
    <div
      data-content-node={node.id}
      data-content-type={node.type}
      data-editor-marker="content"
      className="contents"
    >
      {children}
    </div>
  );
}

import { RichContent } from "@/components/content/RichContent";
import type { ContentNode } from "@/types/content-ast";
import type { ContentOverrides } from "@/types/content-ast";

import { ContentMountGuard } from "./ContentMountGuard";
import { RenderMode } from "./RenderMode";

import "@/components/content/rich-content.css";

export type ContentNodeMarkContext = {
  node: ContentNode;
  children: React.ReactNode;
};

export type ContentRendererProps = {
  mode: RenderMode;
  html: string;
  className?: string;
  contentOverrides?: ContentOverrides | null;
  /**
   * EDITOR only — mark nodes for overlay hit-testing.
   * Markers must not alter layout (display:contents).
   * No-op after Experience Studio cutover (AST path removed).
   */
  markNode?: (ctx: ContentNodeMarkContext) => React.ReactNode;
};

/**
 * Content body renderer — RichContent only after WP/Experience cutover.
 */
export function ContentRenderer({
  mode,
  html,
  className,
}: ContentRendererProps) {
  return (
    <>
      <ContentMountGuard kind="rich" />
      <div data-content-renderer="rich" data-render-mode={mode}>
        <RichContent html={html} className={className} />
      </div>
    </>
  );
}

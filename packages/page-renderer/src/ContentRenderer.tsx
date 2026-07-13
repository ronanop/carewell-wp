import { ContentContainer } from "@/components/content/ContentContainer";
import { ContentTree } from "@/components/content/ast/ContentTree";
import { RichContent } from "@/components/content/RichContent";
import {
  applyContentOverrides,
  parseHtmlToAst,
} from "@/lib/experience/content";
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
   */
  markNode?: (ctx: ContentNodeMarkContext) => React.ReactNode;
};

/**
 * Single content body renderer.
 * PUBLIC → RichContent only
 * EDITOR / PREVIEW → AST only (RichContent never mounts)
 */
export function ContentRenderer({
  mode,
  html,
  className,
  contentOverrides = null,
  markNode,
}: ContentRendererProps) {
  const useAst = mode === RenderMode.EDITOR || mode === RenderMode.PREVIEW;

  if (useAst) {
    const document = applyContentOverrides(
      parseHtmlToAst(html),
      contentOverrides,
    );

    return (
      <>
        <ContentMountGuard kind="ast" />
        <ContentContainer>
          <div
            className="rich-content"
            data-content-renderer="ast"
            data-render-mode={mode}
          >
            <ContentTree
              nodes={document.nodes}
              className={className}
              wrapNode={
                mode === RenderMode.EDITOR && markNode
                  ? ({ node, children }) => markNode({ node, children })
                  : undefined
              }
            />
          </div>
        </ContentContainer>
      </>
    );
  }

  return (
    <>
      <ContentMountGuard kind="rich" />
      <div data-content-renderer="rich" data-render-mode={mode}>
        <RichContent html={html} className={className} />
      </div>
    </>
  );
}

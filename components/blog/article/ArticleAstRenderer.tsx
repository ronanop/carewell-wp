"use client";

import { memo, useMemo, type ReactNode } from "react";

import { SemanticArticleRenderer } from "@/components/blog/article/SemanticArticleRenderer";
import { analyzeArticleSemantics } from "@/lib/experience/blog/semantic/analyzeArticle";
import {
  buildComposerSignals,
  composeEditorialLayout,
} from "@/lib/experience/blog/layout/compose";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";
import type { ArticleDocument } from "@/types/article-ast";
import type { ContentNode } from "@/types/content-ast";
import type { PresentationConfig } from "@/types/presentation-config";
import type { SemanticAnalysisResult } from "@/types/semantic-article";
import type { LayoutComposition } from "@/types/editorial-layout";

export type ArticleAstRendererProps = {
  article: ArticleDocument;
  config: PresentationConfig;
  className?: string;
  semantic?: SemanticAnalysisResult;
  layout?: LayoutComposition;
  articleTitle?: string;
  wrapNode?: (ctx: { node: ContentNode; children: ReactNode }) => ReactNode;
};

/**
 * Article AST entry — Semantic Analysis → Layout Composer → Editorial Registry.
 */
export const ArticleAstRenderer = memo(function ArticleAstRenderer({
  article,
  config,
  className,
  semantic: semanticProp,
  layout: layoutProp,
  articleTitle,
  wrapNode,
}: ArticleAstRendererProps) {
  const blogConfig = config as BlogPresentationConfig;

  const semantic = useMemo(
    () => semanticProp ?? analyzeArticleSemantics(article),
    [article, semanticProp],
  );

  const layout = useMemo(() => {
    if (layoutProp) return layoutProp;
    return composeEditorialLayout({
      sections: semantic.sections,
      signals: buildComposerSignals({
        sections: semantic.sections,
        faqCount: article.faqs.length,
        readingMinutes: article.readingTimeMinutes,
      }),
      overrides: {
        templateId: blogConfig.layoutTemplateId,
        heroLayout: blogConfig.heroLayout,
        spacingPreset: blogConfig.spacingPreset,
      },
    });
  }, [layoutProp, semantic, article, blogConfig]);

  return (
    <SemanticArticleRenderer
      article={article}
      layout={layout}
      config={blogConfig}
      articleTitle={articleTitle}
      className={className}
      wrapNode={wrapNode}
    />
  );
});

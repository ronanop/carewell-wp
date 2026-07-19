"use client";

import { memo, useEffect, type ReactNode } from "react";

import { ContentTree } from "@/components/content/ast/ContentTree";
import { EditorialImage } from "@/components/blog/media/EditorialImage";
import { InlineConsultationCta } from "@/components/blog/editorial/InlineCta";
import { ensureDefaultEditorialComponents } from "@/lib/experience/blog/editorial/registerDefaults";
import {
  getEditorialComponent,
  meetsConfidence,
} from "@/lib/experience/blog/editorial/registry";
import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import { getEditorialPreset } from "@/lib/experience/blog/editorial/presets";
import { ensureServiceEditorialComponents } from "@/lib/experience/service/registerServiceComponents";
import { MAX_INLINE_CONSULTATION_CTAS } from "@/lib/experience/layout/compose";
import { cn } from "@/lib/utils";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";
import type { ArticleDocument } from "@/types/article-ast";
import type { ContentNode } from "@/types/content-ast";
import type {
  LayoutComposition,
  ComposedSection,
  SectionSpacingTokens,
} from "@/types/editorial-layout";
import type { EditorialPreset } from "@/types/semantic-article";

// Sole registration site for blog + service editorial packs (client bundle).
// Server renderers must not import registerDefaults — see ServiceExperienceRenderer.
ensureDefaultEditorialComponents();
ensureServiceEditorialComponents();

export type SemanticArticleRendererProps = {
  article: ArticleDocument;
  layout: LayoutComposition;
  config: BlogPresentationConfig;
  articleTitle?: string;
  className?: string;
  wrapNode?: (ctx: { node: ContentNode; children: ReactNode }) => ReactNode;
};

const SPACING_CLASS: Record<string, string> = {
  compact: "py-6 md:py-8",
  comfortable: "py-10 md:py-12",
  luxury: "py-14 md:py-20",
  magazine: "py-12 md:py-16",
  medical: "py-8 md:py-10",
};

const TOKEN_TOP: Record<SectionSpacingTokens["top"], string> = {
  tight: "pt-4 md:pt-5",
  snug: "pt-6 md:pt-7",
  normal: "pt-8 md:pt-10",
  relaxed: "pt-12 md:pt-14",
  loose: "pt-14 md:pt-18",
};

const TOKEN_BOTTOM: Record<SectionSpacingTokens["bottom"], string> = {
  tight: "pb-4 md:pb-5",
  snug: "pb-6 md:pb-7",
  normal: "pb-8 md:pb-10",
  relaxed: "pb-12 md:pb-14",
  loose: "pb-14 md:pb-18",
};

const BG_CLASS: Record<string, string> = {
  none: "",
  light: "bg-background text-foreground",
  muted:
    "rounded-[var(--radius-3xl)] bg-muted/40 px-5 text-foreground md:px-8",
  cream:
    "rounded-[var(--radius-3xl)] bg-surface-cream px-5 text-foreground md:px-8",
  editorial:
    "rounded-[var(--radius-3xl)] bg-surface-editorial px-5 text-foreground md:px-8",
  accent:
    "rounded-[var(--radius-3xl)] bg-primary/[0.04] px-5 text-foreground md:px-8 ring-1 ring-primary/10",
  dark: [
    "composed-section--dark",
    "rounded-[var(--radius-3xl)] bg-[#0A2540] px-5 py-2 text-white md:px-8",
    "[&_.editorial-section__title]:!text-white",
    "[&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white",
    "[&_.content-ast]:!text-white/90 [&_p]:!text-white/90 [&_li]:!text-white/90",
    "[&_a]:!text-white [&_a:hover]:!text-white/80",
    "[&_.text-foreground]:!text-white [&_.text-muted-foreground]:!text-white/75",
  ].join(" "),
  card: "rounded-[var(--radius-3xl)] border border-border bg-surface p-5 text-foreground shadow-editorial md:p-8",
  split:
    "rounded-[var(--radius-3xl)] bg-gradient-to-br from-muted/50 to-surface px-5 text-foreground md:px-8",
};

const WIDTH_CLASS: Record<string, string> = {
  narrow: "max-w-xl mx-auto",
  measure: "max-w-none",
  wide: "max-w-4xl",
  full: "max-w-none w-full",
};

const MODE_CLASS: Record<string, string> = {
  editorial: "composed-mode--editorial",
  minimal: "composed-mode--minimal",
  "premium-card": "composed-mode--premium-card",
  split: "composed-mode--split",
  highlight: "composed-mode--highlight",
  "soft-surface": "composed-mode--soft",
  cream: "composed-mode--cream",
  "light-tint": "composed-mode--tint",
  "full-width": "composed-mode--full",
  compact: "composed-mode--compact",
  "wide-reading": "composed-mode--wide",
};

const IMPORTANCE_CLASS: Record<string, string> = {
  primary: "composed-importance--primary",
  secondary: "composed-importance--secondary",
  tertiary: "composed-importance--tertiary [&_.editorial-section__title]:text-lg",
};

const CARD_CLASS: Record<string, string> = {
  minimal: "[&_.cw-card]:shadow-none [&_.cw-card]:border-border/60",
  editorial: "[&_.cw-card]:shadow-editorial",
  medical: "[&_.cw-card]:border-primary/12 [&_.cw-card]:bg-primary/[0.02]",
  glass: "[&_.cw-card]:bg-surface-glass [&_.cw-card]:shadow-glass",
  highlight: "[&_.cw-card]:border-primary/20 [&_.cw-card]:bg-primary/[0.04]",
  comparison: "[&_.cw-card]:ring-1 [&_.cw-card]:ring-border",
  statistics: "[&_.cw-card]:text-center",
  warning: "[&_.cw-card]:border-amber-500/25 [&_.cw-card]:bg-amber-50/50",
  research: "[&_.cw-card]:border-border [&_.cw-card]:bg-muted/30",
  timeline: "[&_.cw-card]:border-l-2 [&_.cw-card]:border-l-primary/40",
  none: "",
};

function withInlineCtaCap(sections: ComposedSection[]): ComposedSection[] {
  let shown = 0;
  return sections.map((composed) => {
    if (!composed.showInlineCta) return composed;
    if (shown >= MAX_INLINE_CONSULTATION_CTAS) {
      return { ...composed, showInlineCta: false };
    }
    shown += 1;
    return composed;
  });
}

function imageFitForPlacement(
  placement: ComposedSection["imagePlacement"],
): "original" | "contain" | "editorial-portrait" {
  if (placement === "floating") return "editorial-portrait";
  if (placement === "gallery" || placement === "before-after") return "contain";
  return "original";
}

/**
 * Semantic + Layout Composer renderer — magazine rhythm, never loses content.
 */
export const SemanticArticleRenderer = memo(function SemanticArticleRenderer({
  article,
  layout,
  config,
  articleTitle = "",
  className,
  wrapNode,
}: SemanticArticleRendererProps) {
  const preset = getEditorialPreset(config.editorialPreset);
  const polish = (
    config as BlogPresentationConfig & {
      presentationPolish?: { readingMeasure?: string };
    }
  ).presentationPolish;
  const measure =
    polish?.readingMeasure === "narrow"
      ? "measure-narrow"
      : polish?.readingMeasure === "wide"
        ? "measure-wide"
        : "measure-comfortable";

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const composed of layout.sections) {
      const el = document.querySelector(
        `[data-semantic-id="${composed.section.id}"]`,
      );
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.35)) {
            emitEditorialEvent({
              type: "section_viewed",
              sectionId: composed.section.id,
              sectionType: composed.section.type,
            });
            obs.disconnect();
          }
        },
        { threshold: [0.35] },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [layout.sections]);

  const sections = withInlineCtaCap(layout.sections);

  return (
    <div
      className={cn(
        "semantic-article editorial-engine",
        preset.className,
        `density-${preset.density}`,
        `heading-${preset.typography.headingScale}`,
        `spacing-${preset.typography.paragraphSpacing}`,
        `width-${preset.typography.readingWidth}`,
        `template-${layout.templateId}`,
        measure,
        className,
      )}
      data-content-enhancer-article
      data-editorial-preset={preset.id}
      data-layout-template={layout.templateId}
    >
      <div className="editorial-measure space-y-1 md:space-y-2">
        {sections.map((composed) => (
          <ComposedSectionView
            key={composed.section.id}
            composed={composed}
            article={article}
            config={config}
            preset={preset}
            articleTitle={articleTitle}
            wrapNode={wrapNode}
          />
        ))}
      </div>
    </div>
  );
});

function ComposedSectionView({
  composed,
  article,
  config,
  preset,
  articleTitle,
  wrapNode,
}: {
  composed: ComposedSection;
  article: ArticleDocument;
  config: BlogPresentationConfig;
  preset: EditorialPreset;
  articleTitle: string;
  wrapNode?: SemanticArticleRendererProps["wrapNode"];
}) {
  const { section } = composed;
  const registration = getEditorialComponent(section.type);
  const useSpecialist =
    registration &&
    meetsConfidence(section.confidence, registration.minConfidence ?? "medium");

  const bodyNodes =
    section.type === "FAQ" && section.faqs.length > 0
      ? []
      : section.nodes.filter((n) => {
          if (
            useSpecialist &&
            section.listItems.length > 0 &&
            (section.type === "BENEFITS" ||
              section.type === "RISKS" ||
              section.type === "SIDE_EFFECTS" ||
              section.type === "KEY_TAKEAWAYS" ||
              section.type === "RECOVERY" ||
              section.type === "AFTERCARE" ||
              section.type === "PROCEDURE" ||
              section.type === "STEP_BY_STEP" ||
              section.type === "ELIGIBILITY") &&
            (n.type === "list" || (n.type === "heading" && section.title))
          ) {
            return n.type === "heading" ? false : n.type !== "list";
          }
          if (useSpecialist && n.type === "heading" && section.title) {
            return false;
          }
          return true;
        });

  const fallback = (
    <ContentTree
      nodes={
        bodyNodes.length
          ? bodyNodes
          : section.nodes.filter((n) => n.type !== "heading" || !section.title)
      }
      wrapNode={({ node, children }) => {
        const meta = article.blockMeta[node.id];
        let enhanced: ReactNode = children;

        if (node.type === "heading" && meta?.anchorId) {
          enhanced = (
            <div id={meta.anchorId} className="scroll-mt-28">
              {children}
            </div>
          );
        } else if (
          (node.type === "image" || node.type === "figure") &&
          node.attributes.src
        ) {
          enhanced = (
            <EditorialImage
              src={String(node.attributes.src)}
              alt={String(node.attributes.alt ?? "")}
              width={
                typeof node.attributes.width === "number"
                  ? node.attributes.width
                  : null
              }
              height={
                typeof node.attributes.height === "number"
                  ? node.attributes.height
                  : null
              }
              caption={
                typeof node.attributes.caption === "string"
                  ? node.attributes.caption
                  : null
              }
              fit={imageFitForPlacement(composed.imagePlacement)}
              placement={composed.imagePlacement}
            />
          );
        } else if (node.type === "quote") {
          enhanced = (
            <blockquote className="editorial-pullquote relative border-l-[3px] border-primary py-2 pl-6 font-heading text-xl italic leading-relaxed">
              <span
                className="absolute -left-1 -top-3 font-serif text-5xl text-primary/20"
                aria-hidden
              >
                “
              </span>
              {children}
            </blockquote>
          );
        } else if (node.type === "table") {
          enhanced = (
            <div className="editorial-table-wrap overflow-x-auto rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
              {children}
            </div>
          );
        }

        return wrapNode ? wrapNode({ node, children: enhanced }) : enhanced;
      }}
    />
  );

  const body =
    useSpecialist && registration ? (
      (() => {
        const Component = registration.component;
        return (
          <Component
            section={section}
            config={config}
            preset={preset}
            fallback={fallback}
          />
        );
      })()
    ) : (
      <section
        id={section.anchorId ?? undefined}
        data-semantic-type={section.type}
        data-semantic-id={section.id}
        data-fallback="content-tree"
        className="scroll-mt-28"
      >
        {fallback}
      </section>
    );

  const tokens = composed.spacingTokens;

  return (
    <div
      className={cn(
        "composed-section cw-reveal",
        tokens
          ? cn(TOKEN_TOP[tokens.top], TOKEN_BOTTOM[tokens.bottom])
          : SPACING_CLASS[composed.spacing],
        BG_CLASS[composed.background],
        WIDTH_CLASS[composed.width],
        composed.presentationMode && MODE_CLASS[composed.presentationMode],
        composed.importance && IMPORTANCE_CLASS[composed.importance],
        composed.cardStyle && CARD_CLASS[composed.cardStyle],
        composed.separator === "line" && "border-t border-border/70",
        composed.separator === "fade" &&
          "relative border-t border-transparent before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/45 before:to-transparent",
        composed.separator === "space" && "mt-2",
      )}
      data-variant={composed.variant}
      data-weight={composed.visualWeight}
      data-background={composed.background}
      data-mode={composed.presentationMode}
      data-importance={composed.importance}
      data-in-view="true"
    >
      {body}
      {composed.showInlineCta ? (
        <div className="mt-8 md:mt-10">
          <InlineConsultationCta
            title={articleTitle || section.title || "your goals"}
            placement={`after-${section.type.toLowerCase()}`}
            copy={composed.ctaCopy}
          />
        </div>
      ) : null}
    </div>
  );
}

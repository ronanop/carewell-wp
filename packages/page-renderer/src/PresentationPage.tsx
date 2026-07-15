import dynamic from "next/dynamic";
import { Fragment, memo, type ReactNode } from "react";
import {
  resolveLayoutRuntime,
  type LayoutBreakpoint,
  type ResolvedLayoutNode,
} from "@carewell/layout-runtime";

import { ContentCTA } from "@/components/content/ContentCTA";
import { EditorialSection } from "@/components/content/EditorialSection";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import {
  ConsultationMobileSheet,
  ConsultationSidebarCard,
} from "@/components/leads/ConsultationSidebar";
import { cn } from "@/lib/utils";
import type {
  PresentationPage as PresentationPageData,
  SectionConfig,
} from "@/types/presentation-config";

import {
  ContentRenderer,
  type ContentNodeMarkContext,
} from "./ContentRenderer";
import { LayoutFrame } from "./LayoutFrame";
import { RenderMode } from "./RenderMode";
import { HeroRenderer } from "./sections/HeroRenderer";
import { MediaSectionRenderer } from "./sections/MediaSectionRenderer";

import "@/components/content/content-enhancer.css";

const AnimatedSection = dynamic(() =>
  import("@/components/content/AnimatedSection").then(
    (mod) => mod.AnimatedSection,
  ),
);

export type SectionMarkContext = {
  section: SectionConfig;
  children: ReactNode;
};

export type PresentationPageProps = {
  page: PresentationPageData;
  mode?: RenderMode;
  /** Hide site chrome (nav/footer). Prefer mode-driven behavior. */
  hideChrome?: boolean;
  /** Viewport for responsive layout resolution (editor device preview). */
  breakpoint?: LayoutBreakpoint;
  /**
   * EDITOR: mark sections for overlay hit-testing.
   * Must not affect layout — use display:contents markers.
   */
  markSection?: (ctx: SectionMarkContext) => ReactNode;
  /** EDITOR: mark content AST nodes for overlay hit-testing. */
  markContentNode?: (ctx: ContentNodeMarkContext) => ReactNode;
  /** EDITOR: consultation sidebar selected */
  consultationSelected?: boolean;
  /** EDITOR: select system consultation chrome */
  onSelectConsultation?: () => void;
};

function shellClassFor(section: SectionConfig): string {
  return cn(
    section.spacing === "compact" && "py-6",
    section.spacing === "default" && "py-10",
    section.spacing === "spacious" && "py-16",
    section.background === "muted" && "bg-muted/50",
    section.background === "surface" && "bg-surface",
    section.background === "tint" && "bg-primary/5",
    section.visibility === "desktop" && "hidden md:block",
    section.visibility === "mobile" && "md:hidden",
  );
}

/**
 * Canonical page renderer — shared by public site, Experience Studio, and preview.
 * LayoutRuntime resolves structure; this component only paints.
 */
export const PresentationPage = memo(function PresentationPage({
  page,
  mode = RenderMode.PUBLIC,
  hideChrome = false,
  breakpoint = "desktop",
  markSection,
  markContentNode,
  consultationSelected = false,
  onSelectConsultation,
}: PresentationPageProps) {
  const { config, resolved } = page;
  const isEditor = mode === RenderMode.EDITOR;
  const consultation = page.chrome?.consultation ?? null;

  const sectionsById = new Map(
    config.sections.map((section) => [section.id, section]),
  );

  const layout = resolveLayoutRuntime({
    sections: config.sections.map((s) => ({ id: s.id, type: s.type })),
    layoutTree: config.layoutTree ?? null,
    breakpoint,
    isEditor,
    themeVariant: config.theme.variant,
  });

  // WordPress body HTML must mount exactly once.
  const contentMount = { mounted: false };

  function renderSectionBody(section: SectionConfig): ReactNode {
    if (!section.enabled && !isEditor) return null;
    if (section.type === "hero" && !isEditor && !config.hero.enabled) {
      return null;
    }

    const shellClass = shellClassFor(section);
    let body: ReactNode = null;

    if (section.type === "hero") {
      body = (
        <HeroRenderer
          title={page.title}
          config={config}
          image={resolved.heroImage}
          className={shellClass}
        />
      );
    } else if (section.type === "trust" && config.hero.showTrustBadges) {
      body = (
        <section
          className={cn("border-b border-border", shellClass)}
          data-presentation-section-type="trust"
        >
          <div className="container-content flex flex-wrap gap-2">
            {[
              "15+ years experience",
              "South Delhi clinic",
              "Board-certified care",
            ].map((item) => (
              <span
                key={item}
                className="rounded-lg bg-muted px-3 py-1.5 text-small text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      );
    } else if (section.type === "content") {
      if (contentMount.mounted) {
        body = isEditor ? (
          <section
            className={cn(
              shellClass,
              "border border-dashed border-amber-300/80 bg-amber-50/40",
            )}
            data-presentation-section-type="content"
            data-content-duplicate="true"
          >
            <div className="container-content py-6 text-small text-amber-950">
              <p className="font-medium">Duplicate content section</p>
              <p className="mt-1 text-muted-foreground">
                The WordPress page body is already rendered above. Remove this
                extra section from Layers — it does not mount HTML again.
              </p>
            </div>
          </section>
        ) : null;
      } else {
        contentMount.mounted = true;
        body = (
          <div
            className={shellClass}
            data-presentation-section-type="content"
            data-content-body="primary"
          >
            {config.navigation.breadcrumbStyle !== "hidden" ? (
              <nav
                aria-label="Breadcrumb"
                className={cn(
                  "border-b border-border",
                  config.navigation.breadcrumbStyle === "dark" &&
                    "bg-neutral-900 text-neutral-200",
                  config.navigation.breadcrumbStyle === "light" &&
                    "bg-muted/40 text-muted-foreground",
                )}
              >
                <ol className="container-content flex flex-wrap gap-2 py-3 text-small">
                  {page.breadcrumbs.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                      {index > 0 ? <span aria-hidden>/</span> : null}
                      <a href={item.href} className="hover:underline">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
            <ReadingProgress />
            <EditorialSection
              className={cn(
                config.content.readingWidth === "article" &&
                  "max-w-3xl mx-auto",
                config.content.readingWidth === "landing" &&
                  "max-w-5xl mx-auto",
                config.content.readingWidth === "wide" && "max-w-6xl mx-auto",
              )}
              aria-label="Page content"
            >
              <div data-content-enhancer-article>
                {mode === RenderMode.PUBLIC ? (
                  <AnimatedSection revealChapters>
                    <ContentRenderer
                      mode={mode}
                      html={page.contentHtml}
                      contentOverrides={config.contentOverrides}
                    />
                  </AnimatedSection>
                ) : (
                  <ContentRenderer
                    mode={mode}
                    html={page.contentHtml}
                    contentOverrides={config.contentOverrides}
                    markNode={markContentNode}
                  />
                )}
              </div>
            </EditorialSection>
          </div>
        );
      }
    } else if (section.type === "cta") {
      body = (
        <div className={shellClass} data-presentation-section-type="cta">
          <ContentCTA pageTitle={page.title} />
        </div>
      );
    } else {
      const media = page.resolved.sectionMedia[section.id] ?? [];
      const hasBody =
        media.length > 0 ||
        Boolean(section.settings.heading) ||
        Boolean(section.settings.supportingText);

      if (hasBody || isEditor) {
        body = hasBody ? (
          <MediaSectionRenderer
            section={section}
            page={page}
            config={config}
            className={shellClass}
          />
        ) : (
          <section
            className={shellClass}
            data-presentation-section-type={section.type}
          >
            <div className="container-content py-6 text-small text-muted-foreground">
              <span className="font-medium capitalize text-foreground">
                {section.type}
              </span>
            </div>
          </section>
        );
      }
    }

    if (!body) return null;

    return markSection ? markSection({ section, children: body }) : body;
  }

  function renderLayoutNode(node: ResolvedLayoutNode): ReactNode {
    if (node.kind === "section" && node.sectionId) {
      const section = sectionsById.get(node.sectionId);
      if (!section) return null;
      return <Fragment key={node.id}>{renderSectionBody(section)}</Fragment>;
    }

    return (
      <LayoutFrame key={node.id} node={node} isEditor={isEditor}>
        {node.children.map((child) => renderLayoutNode(child))}
      </LayoutFrame>
    );
  }

  function renderNodes(nodes: ResolvedLayoutNode[]): ReactNode {
    return nodes.map((node) => renderLayoutNode(node));
  }

  const FULL_BLEED_SECTION_TYPES = new Set(["cta"]);

  /**
   * Chrome regions:
   * - top: hero/trust (full width)
   * - main: editorial body (shares column with sticky consultation)
   * - bleed: full-viewport bands (CTA) — must not sit in the sidebar grid
   */
  function partitionChromeRegions(root: ResolvedLayoutNode): {
    top: ResolvedLayoutNode[];
    main: ResolvedLayoutNode[];
    bleed: ResolvedLayoutNode[];
  } {
    const children = root.children ?? [];
    let splitAt = 0;
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      if (child?.kind === "section" && child.sectionId) {
        const section = sectionsById.get(child.sectionId);
        if (section && (section.type === "hero" || section.type === "trust")) {
          splitAt = i + 1;
          continue;
        }
      }
      break;
    }

    const body = children.slice(splitAt);
    let bleedStart = body.length;
    while (bleedStart > 0) {
      const child = body[bleedStart - 1];
      if (child?.kind === "section" && child.sectionId) {
        const section = sectionsById.get(child.sectionId);
        if (section && FULL_BLEED_SECTION_TYPES.has(section.type)) {
          bleedStart -= 1;
          continue;
        }
      }
      break;
    }

    return {
      top: children.slice(0, splitAt),
      main: body.slice(0, bleedStart),
      bleed: body.slice(bleedStart),
    };
  }

  const layoutBody = (() => {
    if (!consultation) {
      return renderLayoutNode(layout.root);
    }

    const { top, main, bleed } = partitionChromeRegions(layout.root);
    const hasTop = top.length > 0;

    const sidebarProps = {
      chrome: consultation,
      isEditor,
      selected: consultationSelected,
      onSelect: onSelectConsultation,
    };

    const sidebarAside = (
      <aside
        className="hidden lg:block"
        style={{
          width: consultation.desktopWidthPx,
          minWidth: consultation.minWidthPx,
          maxWidth: consultation.maxWidthPx,
        }}
        data-chrome-region="consultation-desktop"
        aria-label="Consultation sidebar"
      >
        <div className="sticky" style={{ top: consultation.stickyOffsetPx }}>
          <ConsultationSidebarCard {...sidebarProps} />
        </div>
      </aside>
    );

    const tabletSidebar = (
      <div
        className="container-content hidden py-6 md:block lg:hidden"
        data-chrome-region="consultation-tablet"
      >
        <div className="mx-auto max-w-[360px]">
          <ConsultationSidebarCard {...sidebarProps} />
        </div>
      </div>
    );

    return (
      <>
        {hasTop ? (
          <div data-chrome-region="top-band">{renderNodes(top)}</div>
        ) : null}

        {tabletSidebar}

        <div
          className="lg:container-content lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10"
          data-chrome-region="body-with-sidebar"
        >
          <div className="min-w-0" data-chrome-region="main-content">
            {renderNodes(main)}
          </div>
          {sidebarAside}
        </div>

        {/* Full-bleed bands (CTA) — outside sidebar grid, edge to edge */}
        {bleed.length ? (
          <div data-chrome-region="full-bleed">{renderNodes(bleed)}</div>
        ) : null}

        <ConsultationMobileSheet {...sidebarProps} />
      </>
    );
  })();

  return (
    <div
      className={cn(
        "presentation-root",
        config.advanced.customCssClass,
        `theme-${config.theme.variant}`,
        `anim-${config.animation.preset}`,
        `reading-${config.content.readingWidth}`,
        `images-${config.content.imageStyle}`,
        `tables-${config.content.tableStyle}`,
        `buttons-${config.content.buttonStyle}`,
      )}
      style={{
        ["--presentation-delay" as string]: `${config.animation.delayMs}ms`,
      }}
      data-render-mode={mode}
      data-presentation-page
      data-page-type={page.pageType}
      data-layout-runtime="v2"
    >
      {hideChrome ? null : <NavbarPlaceholder />}

      <main className="flex-1" data-presentation-main>
        {layoutBody}
      </main>

      {!consultation &&
      !hideChrome &&
      (config.navigation.stickyMobileCta || config.navigation.stickyCta) &&
      (config.navigation.enableWhatsApp || config.navigation.enableCall) ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 p-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-lg gap-2">
            {config.navigation.enableWhatsApp ? (
              <a
                href="https://wa.me/919999999999"
                className="flex-1 rounded-lg bg-emerald-600 py-3 text-center text-small font-medium text-white no-underline"
              >
                WhatsApp
              </a>
            ) : null}
            {config.navigation.enableCall ? (
              <a
                href="tel:+911141055555"
                className="flex-1 rounded-lg bg-primary py-3 text-center text-small font-medium text-primary-foreground no-underline"
              >
                Call
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {hideChrome ? null : <FooterPlaceholder />}
    </div>
  );
});

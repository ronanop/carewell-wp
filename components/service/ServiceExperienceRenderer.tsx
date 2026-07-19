/**
 * ServiceExperienceRenderer — treatment pages via shared SemanticArticleRenderer.
 * Phase 8.0: same intelligence pipeline as blogs; service-specific chrome/hero.
 */

import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { SemanticArticleRenderer } from "@/components/blog/article/SemanticArticleRenderer";
import { TreatmentHero } from "@/components/service/TreatmentHero";
import { ServiceTrustStrip } from "@/components/service/ServiceTrustStrip";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { MedicalDisclaimer } from "@/components/blog/editorial";
import { SpecialtyFooterCta } from "@/components/blog/SpecialtyFooterCta";
import { ContentCTA } from "@/components/content/ContentCTA";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { ConsultationMobileSheet } from "@/components/leads/ConsultationSidebar";
import { experienceConfigToBlogPresentationConfig } from "@/lib/experience/unified/migrate";
import type { ExperienceDocument } from "@/types/experience-document";
import type { BlogDocument } from "@/types/blog-document";
import type { BlogCategory } from "@/types/blog";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";

/**
 * Editorial component registration lives in SemanticArticleRenderer (client).
 * Do not call ensureDefault/ensureService helpers here — this module is a Server
 * Component imported by UnifiedExperienceRenderer for every catch-all page;
 * pulling "use client" section factories into the RSC webpack graph corrupts
 * HMR module IDs (__webpack_modules__[moduleId] is not a function).
 */

function toBlogSidebarDoc(
  doc: ExperienceDocument,
  blogConfig: BlogPresentationConfig,
): BlogDocument {
  // Service pages never show Reading / TOC / redundant WhatsApp & appointment cards
  // (consultation form already covers contact).
  const sidebar = {
    widgets: doc.sidebar.widgets.map((w) =>
      w.id === "progress" ||
      w.id === "toc" ||
      w.id === "whatsapp" ||
      w.id === "appointment"
        ? { ...w, enabled: false }
        : w,
    ),
  };

  return {
    uri: doc.uri,
    slug: doc.slug,
    title: doc.title,
    wordpressStatus: doc.wordpressStatus,
    pageType: doc.pageType,
    hero: doc.hero,
    author: doc.author,
    tags: doc.tags,
    categories: doc.categories,
    article: doc.article!,
    semantic: doc.semantic!,
    layout: doc.layout!,
    contentHtml: doc.contentHtml,
    toc: doc.toc,
    faqs: doc.faqs,
    comments: doc.comments,
    related: doc.related,
    previous: doc.previous,
    next: doc.next,
    popular: doc.popular,
    latest: doc.latest,
    breadcrumbs: doc.breadcrumbs,
    seo: doc.seo,
    config: blogConfig,
    sidebar,
    resolved: doc.resolved,
    presentationStatus: doc.presentationStatus,
    chrome: doc.chrome,
    leadContext: {
      blogUrl: doc.leadContext.pageUrl,
      blogTitle: doc.leadContext.pageTitle,
      category: doc.leadContext.category,
    },
  };
}

export function ServiceExperienceRenderer({
  document: doc,
  categories = [],
  hideChrome = false,
}: {
  document: ExperienceDocument;
  categories?: BlogCategory[];
  hideChrome?: boolean;
}) {
  if (!doc.article || !doc.semantic || !doc.layout) {
    return null;
  }

  const blogConfig = experienceConfigToBlogPresentationConfig(doc.config);
  const sidebarDoc = toBlogSidebarDoc(doc, blogConfig);
  const consultation = doc.chrome?.consultation ?? null;
  const ctaEnabled = doc.config.sections.some(
    (s) => s.type === "cta" && s.enabled,
  );

  return (
    <>
      <ReadingProgress />
      {!hideChrome ? <NavbarPlaceholder /> : null}

      <article className="min-h-screen bg-background">
        {doc.config.hero.enabled !== false ? (
          <TreatmentHero doc={doc} />
        ) : null}

        <ServiceTrustStrip treatmentName={doc.leadContext.category} />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.36fr)]">
            <div className="min-w-0">
              <SemanticArticleRenderer
                article={doc.article}
                layout={doc.layout}
                config={blogConfig}
                articleTitle={doc.title}
              />

              <MedicalDisclaimer />

              {ctaEnabled ? (
                <div className="mt-12 overflow-hidden rounded-2xl">
                  <ContentCTA pageTitle={doc.title} />
                </div>
              ) : null}

              <SpecialtyFooterCta
                categories={
                  doc.leadContext.specialtySlug
                    ? [
                        {
                          id: "specialty",
                          name: doc.leadContext.category ?? "Treatment",
                          slug: doc.leadContext.specialtySlug,
                          count: 0,
                          uri: doc.uri,
                          description: null,
                        },
                      ]
                    : []
                }
                className="mt-10"
              />
            </div>

            <BlogSidebar
              doc={sidebarDoc}
              categories={categories}
              fillConsultation
            />
          </div>
        </div>
      </article>

      {consultation ? (
        <ConsultationMobileSheet chrome={consultation} />
      ) : null}

      {!hideChrome ? <FooterPlaceholder /> : null}
    </>
  );
}

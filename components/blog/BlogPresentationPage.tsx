import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { SemanticArticleRenderer } from "@/components/blog/article/SemanticArticleRenderer";
import { EditorialHero } from "@/components/blog/EditorialHero";
import {
  BlogAuthorBox,
  BlogComments,
  BlogPrevNext,
  BlogRelatedPosts,
  BlogTags,
  BlogTableOfContents,
} from "@/components/blog/BlogChrome";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { MedicalDisclaimer } from "@/components/blog/editorial";
import { ConsultationMobileSheet } from "@/components/leads/ConsultationSidebar";
import { ContentCTA } from "@/components/content/ContentCTA";
import { SpecialtyFooterCta } from "@/components/blog/SpecialtyFooterCta";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";
import type { BlogDocument } from "@/types/blog-document";
import type { BlogCategory } from "@/types/blog";

export type BlogPresentationPageProps = {
  document: BlogDocument;
  categories?: BlogCategory[];
  hideChrome?: boolean;
};

/**
 * Blog Presentation Page — Layout Composer + premium editorial UX (Phase 6.2).
 */
export function BlogPresentationPage({
  document: doc,
  categories = [],
  hideChrome = false,
}: BlogPresentationPageProps) {
  const config = doc.config as BlogPresentationConfig;
  const relatedEnabled = config.sections.some(
    (s) => s.type === "related-blogs" && s.enabled,
  );
  const ctaEnabled = config.sections.some(
    (s) => s.type === "cta" && s.enabled,
  );
  const consultation = doc.chrome?.consultation ?? null;

  return (
    <>
      {!hideChrome ? <NavbarPlaceholder /> : null}

      <article className="min-h-screen bg-background">
        {config.hero.enabled ? <EditorialHero doc={doc} /> : null}

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 lg:hidden">
            <BlogTableOfContents items={doc.toc} searchable />
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.36fr)]">
            <div className="min-w-0">
              <SemanticArticleRenderer
                article={doc.article}
                layout={doc.layout}
                config={config}
                articleTitle={doc.title}
              />

              <BlogTags tags={doc.tags} />

              {doc.author ? <BlogAuthorBox author={doc.author} /> : null}

              <MedicalDisclaimer />

              <BlogPrevNext previous={doc.previous} next={doc.next} />

              {relatedEnabled ? (
                <BlogRelatedPosts posts={doc.related} />
              ) : null}

              <BlogComments comments={doc.comments} />

              {ctaEnabled ? (
                <div className="mt-12 overflow-hidden rounded-2xl">
                  <ContentCTA pageTitle={doc.title} />
                </div>
              ) : null}

              <SpecialtyFooterCta
                categories={doc.categories}
                className="mt-10"
              />
            </div>

            <BlogSidebar doc={doc} categories={categories} />
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

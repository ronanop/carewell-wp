import { notFound } from "next/navigation";
import Link from "next/link";

import { BlogPresentationPage } from "@/components/blog/BlogPresentationPage";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExperienceReviewPanel } from "@/components/admin/ExperienceReviewPanel";
import { BlogStudioPolishPanel } from "@/components/admin/blogs/BlogStudioPolishPanel";
import { getBlogDocumentPreview } from "@/lib/experience/engine/blogPresentationEngine";
import { createWordPressPostRepository } from "@/lib/experience/repositories/wordpressPostRepository";
import {
  createDefaultBlogPresentationConfig,
  parseBlogPresentationConfig,
} from "@/lib/experience/validations/blogPresentationConfig";
import { listBlogCategories } from "@/lib/blog/services/blogService";
import { BlogStudioActions } from "@/components/admin/blogs/BlogStudioActions";
import { blogDocumentToExperience } from "@/lib/experience/unified/adapters";
import { buildExperienceReviewReport } from "@/lib/experience/quality/reviewMode";

type BlogStudioRouteProps = {
  params: Promise<{ postId: string }>;
};

/**
 * Blog Studio — presentation preview + publish controls + Review Mode.
 * Visual Builder parity with page-studio; WordPress content remains read-only.
 */
export default async function BlogStudioPage({ params }: BlogStudioRouteProps) {
  const { postId } = await params;
  const posts = createWordPressPostRepository();
  const post = await posts.findById(postId);
  if (!post) notFound();

  const initialConfig = post.presentation
    ? parseBlogPresentationConfig(post.presentation.config)
    : createDefaultBlogPresentationConfig();

  const document = await getBlogDocumentPreview(postId, initialConfig);
  const categories = await listBlogCategories();
  const review = document
    ? buildExperienceReviewReport(blogDocumentToExperience(document))
    : null;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={post.title}
        description="Presentation overrides only — WordPress remains the content source of truth."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/blogs"
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              Back to blogs
            </Link>
            <a
              href={post.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              View live
            </a>
            <BlogStudioActions postId={postId} initialConfig={initialConfig} />
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          {document ? (
            <BlogPresentationPage
              document={document}
              categories={categories}
              hideChrome
            />
          ) : (
            <div className="p-10 text-center text-muted-foreground">
              Unable to load live WordPress content for preview. Sync again or check
              GraphQL connectivity.
            </div>
          )}
        </div>
        {review ? (
          <div className="space-y-4 xl:sticky xl:top-24">
            <ExperienceReviewPanel review={review} />
            <BlogStudioPolishPanel
              postId={postId}
              initialConfig={initialConfig}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

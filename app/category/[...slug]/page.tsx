import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/BlogChrome";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { getBlogCategoryPage } from "@/lib/blog/services/blogService";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";

export const revalidate = 1800;

type CategoryPageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ after?: string }>;
};

/**
 * Category archive — preserves WordPress /category/... URLs.
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const leaf = slug[slug.length - 1];
  const data = await getBlogCategoryPage(leaf);
  if (!data) {
    return { title: `Category | ${SITE_NAME}` };
  }
  const title = `${data.category.name} | Blog | ${SITE_NAME}`;
  return {
    title,
    description:
      data.category.description ||
      `Articles in ${data.category.name} from Care Well Medical Centre.`,
    alternates: {
      canonical: `${SITE_URL}${data.category.uri.replace(/\/$/, "")}`,
    },
  };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { after } = await searchParams;
  const leaf = slug[slug.length - 1];
  if (!leaf) notFound();

  const data = await getBlogCategoryPage(leaf, { after: after ?? null, first: 12 });
  if (!data) notFound();

  const { category, posts, pageInfo } = data;
  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <>
      <NavbarPlaceholder />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Category
            </p>
            <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">
              {category.name}
            </h1>
            {category.description ? (
              <p className="mt-3 max-w-2xl text-muted-foreground">
                {category.description}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {category.count} article{category.count === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {featured ? (
            <div className="mb-10">
              <BlogCard post={featured} featured />
            </div>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {!posts.length ? (
            <p className="text-muted-foreground">No articles in this category yet.</p>
          ) : null}

          {pageInfo.hasNextPage && pageInfo.endCursor ? (
            <div className="mt-10 text-center">
              <a
                href={`/category/${slug.join("/")}?after=${encodeURIComponent(pageInfo.endCursor)}`}
                className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium hover:border-primary/40"
              >
                Load more
              </a>
            </div>
          ) : null}
        </div>
      </main>
      <FooterPlaceholder />
    </>
  );
}

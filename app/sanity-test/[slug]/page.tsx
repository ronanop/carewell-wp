import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SanityPortableText } from "@/components/sanity/SanityPortableText";
import { sanityClient, urlFor } from "@/lib/sanity/client";
import { SANITY_PAGE_BY_SLUG } from "@/lib/sanity/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type SanityPage = {
  _id: string;
  title: string;
  slug: string;
  uri?: string;
  excerpt?: string;
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
  };
  mainImage?: {
    alt?: string;
    asset?: {
      url?: string;
      metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } };
    };
  };
  body?: unknown[];
};

async function getPage(slug: string) {
  return sanityClient.fetch<SanityPage | null>(SANITY_PAGE_BY_SLUG, { slug });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: "Not found" };

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt || undefined,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function SanityTestPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  const hero = page.mainImage?.asset
    ? urlFor(page.mainImage).width(1400).height(700).fit("crop").url()
    : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="mb-4 text-xs font-medium tracking-wide text-amber-700 uppercase">
        Sanity test preview ·{" "}
        <Link href="/sanity-test" className="underline">
          all test pages
        </Link>
      </p>

      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {page.title}
        </h1>
        {page.uri ? (
          <p className="mt-2 text-sm text-slate-500">WP path: {page.uri}</p>
        ) : null}
        {page.excerpt ? (
          <p className="mt-4 text-lg text-slate-600">{page.excerpt}</p>
        ) : null}
      </header>

      {hero ? (
        <div className="mb-10 overflow-hidden rounded-xl">
          <Image
            src={hero}
            alt={page.mainImage?.alt || page.title}
            width={1400}
            height={700}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      ) : null}

      <article>
        <SanityPortableText value={page.body} />
      </article>
    </main>
  );
}

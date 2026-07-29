import Image from "next/image";
import type { Metadata } from "next";

import { SanityPortableText } from "@/components/sanity/SanityPortableText";
import { urlFor } from "@/lib/sanity/client";
import type { SanityPageDoc } from "@/lib/sanity/page";
import { SITE_NAME } from "@/lib/seo/constants";

export function buildSanityPageMetadata(page: SanityPageDoc): Metadata {
  const title = page.seo?.title || `${page.title} | ${SITE_NAME}`;
  const description =
    page.seo?.description ||
    page.excerpt ||
    `${page.title} at Care Well Medical Centre.`;
  return {
    title,
    description,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function SanityPageTemplate({ page }: { page: SanityPageDoc }) {
  const hero = page.mainImage?.asset
    ? urlFor(page.mainImage).width(1400).height(700).fit("crop").url()
    : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {page.title}
        </h1>
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

import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { SANITY_PAGES_LIST } from "@/lib/sanity/queries";

type PageRow = {
  _id: string;
  title: string;
  slug: string;
  uri?: string;
};

export default async function SanityTestIndexPage() {
  const pages = await sanityClient.fetch<PageRow[]>(SANITY_PAGES_LIST);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-2 text-xs font-medium tracking-wide text-amber-700 uppercase">
        Sanity test only — WordPress site unchanged
      </p>
      <h1 className="mb-2 text-3xl font-semibold text-slate-900">
        Sanity pages (preview)
      </h1>
      <p className="mb-8 text-slate-600">
        Pick a page to render from Sanity. Try{" "}
        <Link
          className="text-teal-700 underline"
          href="/sanity-test/anti-aging"
        >
          /sanity-test/anti-aging
        </Link>{" "}
        or{" "}
        <Link
          className="text-teal-700 underline"
          href="/sanity-test/gynecomastia"
        >
          /sanity-test/gynecomastia
        </Link>
        .
      </p>
      <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
        {pages.map((page) => (
          <li key={page._id}>
            <Link
              href={`/sanity-test/${page.slug}`}
              className="block px-4 py-3 hover:bg-slate-50"
            >
              <span className="font-medium text-slate-900">{page.title}</span>
              <span className="mt-0.5 block text-sm text-slate-500">
                {page.uri || `/${page.slug}/`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

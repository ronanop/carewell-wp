import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DevServiceSectionsIndexPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6 py-16 text-slate-900">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Development only
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Service section galleries</h1>
        <p className="mt-2 text-sm text-slate-600">
          All 35+ section templates with mock content so you can review and edit
          components in one place.
        </p>
      </div>
      <div className="grid gap-3">
        <Link
          href="/dev/service-sections/desktop"
          className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-[#1557A0]"
        >
          <p className="font-semibold text-[#1557A0]">Desktop gallery</p>
          <p className="mt-1 text-sm text-slate-600">
            Wide canvas · lg breakpoints · full section stack
          </p>
        </Link>
        <Link
          href="/dev/service-sections/mobile"
          className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-[#1557A0]"
        >
          <p className="font-semibold text-[#1557A0]">Mobile gallery</p>
          <p className="mt-1 text-sm text-slate-600">
            390px phone frame · mobile layout of every section
          </p>
        </Link>
      </div>
    </main>
  );
}

import { notFound } from "next/navigation";
import {
  getSanityServicesList,
  servicePublicPath,
  type SanityServiceListItem,
} from "@/lib/sanity/service";

export const dynamic = "force-dynamic";

function hubFromPath(path: string): string {
  const segments = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  return segments[0] || "uncategorized";
}

function formatHubLabel(hub: string): string {
  return hub
    .split("-")
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function groupByHub(
  services: SanityServiceListItem[],
): { hub: string; items: { service: SanityServiceListItem; path: string }[] }[] {
  const map = new Map<
    string,
    { service: SanityServiceListItem; path: string }[]
  >();

  for (const service of services) {
    const path = servicePublicPath(service);
    const hub = hubFromPath(path);
    const list = map.get(hub) ?? [];
    list.push({ service, path });
    map.set(hub, list);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hub, items]) => ({
      hub,
      items: items.sort((a, b) => a.path.localeCompare(b.path)),
    }));
}

export default async function DevServicePagesReviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const services = await getSanityServicesList();
  const groups = groupByHub(services);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-slate-900 sm:px-6">
      <header className="border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Development only
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#1557A0]">
          Sanity service pages
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Open each public URI in a new tab for QA. Paths match SEO URIs
          (trailing slash, no{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">
            /sanity/service/
          </code>{" "}
          prefix).
        </p>
        <p className="mt-3 text-sm font-medium text-slate-800">
          {services.length} service
          {services.length === 1 ? "" : "s"} · {groups.length} hub
          {groups.length === 1 ? "" : "s"}
        </p>
      </header>

      {services.length === 0 ? (
        <p className="mt-8 text-sm text-slate-600">
          No Sanity <code className="text-xs">service</code> documents found.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map(({ hub, items }) => (
            <section key={hub} aria-labelledby={`hub-${hub}`}>
              <h2
                id={`hub-${hub}`}
                className="sticky top-0 z-10 -mx-4 border-b border-slate-100 bg-white/95 px-4 py-2 text-sm font-semibold text-[#1557A0] backdrop-blur sm:-mx-0 sm:px-0"
              >
                {formatHubLabel(hub)}
                <span className="ml-2 font-normal text-slate-500">
                  ({items.length})
                </span>
              </h2>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3 font-medium">Title</th>
                      <th className="py-2 pr-3 font-medium">URI</th>
                      <th className="py-2 pr-3 font-medium">Slug</th>
                      <th className="py-2 pr-3 font-medium tabular-nums">
                        FAQs
                      </th>
                      <th className="py-2 font-medium">Hero</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ service, path }) => (
                      <tr
                        key={service._id}
                        className="border-b border-slate-100 hover:bg-slate-50/80"
                      >
                        <td className="py-2.5 pr-3 align-top font-medium text-slate-900">
                          <a
                            href={path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1557A0] underline-offset-2 hover:underline"
                          >
                            {service.title || "(untitled)"}
                          </a>
                        </td>
                        <td className="py-2.5 pr-3 align-top">
                          <a
                            href={path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all font-mono text-xs text-slate-700 underline-offset-2 hover:text-[#1557A0] hover:underline"
                          >
                            {path}
                          </a>
                        </td>
                        <td className="py-2.5 pr-3 align-top font-mono text-xs text-slate-500">
                          {service.slug || "—"}
                        </td>
                        <td className="py-2.5 pr-3 align-top tabular-nums text-slate-600">
                          {service.faqCount ?? 0}
                        </td>
                        <td className="py-2.5 align-top text-slate-600">
                          {service.hasHero ? "yes" : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

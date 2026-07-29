import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RelatedService, SectionBaseProps } from "./types";

export type RelatedServicesSectionProps = SectionBaseProps & {
  /** CMS: related.eyebrow */
  eyebrow?: string;
  /** CMS: related.heading */
  title?: string;
  /** CMS: related.services[]-> */
  services?: RelatedService[] | null;
};

function isLinkable(service: RelatedService): service is RelatedService & {
  slug: string;
} {
  return Boolean(service?._id && (service.slug?.trim() || service.uri?.trim()));
}

function serviceHref(service: RelatedService): string {
  const uri = service.uri?.trim();
  if (uri) {
    const path = uri.startsWith("/") ? uri : `/${uri}`;
    return path.endsWith("/") ? path : `${path}/`;
  }
  const slug = service.slug?.trim();
  return slug ? `/${slug}/` : "/";
}

/**
 * Related service card list.
 * React owns layout/chrome; CMS owns eyebrow, heading, and card copy from refs.
 * Empty / unlinkable services → null. Flex-wrap + justify-center centers leftover cards.
 * Links use original WP `uri` when present (SEO paths), else `/{slug}/`.
 */
export function RelatedServicesSection({
  id = "related",
  eyebrow,
  title,
  services,
  className,
}: RelatedServicesSectionProps) {
  const list = (services ?? []).filter(isLinkable);
  if (!list.length) return null;

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn(
        "relative border-y border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_80%_0%,rgba(21,87,160,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(eyebrow || title) && (
          <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            {eyebrow ? (
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id={`${id}-heading`}
                className={cn(
                  "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
                  eyebrow ? "mt-2" : undefined,
                )}
              >
                {title}
              </h2>
            ) : null}
          </header>
        )}

        <ul className="mx-auto flex list-none flex-wrap justify-center gap-4 p-0">
          {list.map((rel) => (
            <li
              key={rel._id}
              className="min-w-0 w-full max-w-[17.5rem] basis-[min(100%,17.5rem)]"
            >
              <Link
                href={serviceHref(rel)}
                className={cn(
                  "group flex h-full flex-col rounded-xl border border-slate-200/90 bg-white p-5",
                  "shadow-[0_1px_2px_rgba(10,46,82,0.04)]",
                  "transition-[border-color,box-shadow,transform] duration-200",
                  "hover:-translate-y-0.5 hover:border-[#1557A0]/45",
                  "hover:shadow-[0_12px_28px_-16px_rgba(21,87,160,0.35)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
                )}
              >
                <p className="font-heading text-lg font-semibold tracking-tight text-[#0A2E52] text-balance">
                  {rel.title?.trim() || "Service"}
                </p>
                {rel.excerpt?.trim() ? (
                  <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {rel.excerpt.trim()}
                  </p>
                ) : (
                  <span className="flex-1" aria-hidden />
                )}
                <span
                  className={cn(
                    "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1557A0]",
                    "transition-colors group-hover:text-[#0A2E52]",
                  )}
                >
                  View service
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronDown, List } from "lucide-react";

import type { PortableTextTocItem } from "@/lib/sanity/portableTextToc";
import { cn } from "@/lib/utils";

export function BlogTableOfContents({
  items,
  className,
}: {
  items: PortableTextTocItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  let h2Count = 0;

  return (
    <nav
      aria-labelledby="blog-toc-heading"
      className={cn(
        "mb-10 overflow-hidden rounded-2xl border border-border/80 bg-surface-editorial",
        className,
      )}
    >
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2.5 border-b border-border/70 bg-surface/60 px-5 py-3.5 marker:content-none [&::-webkit-details-marker]:hidden sm:px-6 hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/35">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <List className="size-4" aria-hidden />
          </span>
          <h2
            id="blog-toc-heading"
            className="min-w-0 flex-1 font-heading text-base font-semibold text-[#0A2540] sm:text-lg"
          >
            Table of contents
          </h2>
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-surface text-primary transition duration-200 group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden
          >
            <ChevronDown className="size-4" strokeWidth={2.25} />
          </span>
        </summary>

        <ol className="space-y-1 px-5 py-4 sm:px-6 sm:py-5">
          {items.map((item) => {
            const number = item.level === 2 ? ++h2Count : null;

            return (
              <li
                key={item.id}
                className={cn(
                  item.level === 3 && "pl-4",
                  item.level === 4 && "pl-8",
                )}
              >
                <Link
                  href={`#${item.id}`}
                  className="flex gap-3 rounded-lg px-2 py-2 text-small leading-snug text-muted-foreground no-underline transition-colors hover:bg-primary/5 hover:text-primary hover:no-underline"
                >
                  {number ? (
                    <span className="mt-0.5 w-5 shrink-0 font-heading text-xs font-bold tabular-nums text-primary/70">
                      {String(number).padStart(2, "0")}
                    </span>
                  ) : (
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/40"
                      aria-hidden
                    />
                  )}
                  <span className="text-balance">{item.text}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </details>
    </nav>
  );
}

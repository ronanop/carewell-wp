import Link from "next/link";

import type { UriBreadcrumbItem } from "@/lib/wordpress/routeUtils";

export interface WordPressPageBreadcrumbProps {
  items: readonly UriBreadcrumbItem[];
}

/**
 * Hierarchical breadcrumb for WordPress-backed pages.
 */
export function WordPressPageBreadcrumb({
  items,
}: WordPressPageBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-border/60 bg-muted/30"
    >
      <div className="container-content py-3.5">
        <ol className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-muted-foreground/60">
                  »
                </span>
              ) : null}
              {item.current ? (
                <span
                  className="font-medium text-[#0A2540]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="no-underline transition-colors hover:text-[#0A2540] hover:no-underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

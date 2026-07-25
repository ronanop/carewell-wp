import Link from "next/link";

import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";
import { cn } from "@/lib/utils";

type AboutBreadcrumbProps = {
  /** Use inside full-bleed dark heroes. */
  tone?: "default" | "on-dark";
};

export function AboutBreadcrumb({ tone = "default" }: AboutBreadcrumbProps) {
  const items = buildUriBreadcrumbs("/about/");
  const onDark = tone === "on-dark";

  return (
    <nav aria-label="Breadcrumb" className={cn(!onDark && "border-b border-border/60 bg-muted/30")}>
      <div className={cn(!onDark && "container-content py-3.5", onDark && "py-0")}>
        <ol
          className={cn(
            "flex flex-wrap items-center gap-2 text-small",
            onDark ? "text-white/65" : "text-muted-foreground",
          )}
        >
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? (
                <span
                  aria-hidden
                  className={onDark ? "text-white/35" : "text-muted-foreground/60"}
                >
                  /
                </span>
              ) : null}
              {item.current ? (
                <span
                  className={cn(
                    "font-medium",
                    onDark ? "text-white" : "text-[#0A2540]",
                  )}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "no-underline transition-colors hover:no-underline",
                    onDark
                      ? "text-white/65 hover:text-white"
                      : "hover:text-[#0A2540]",
                  )}
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

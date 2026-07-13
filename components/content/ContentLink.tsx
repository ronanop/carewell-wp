import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { isExternalLink } from "@/components/content/content-utils";

/**
 * Content hyperlink with external-link safety defaults.
 */
export interface ContentLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  /** Public site origin used to classify internal vs external links. */
  siteOrigin?: string;
}

/**
 * Anchor styled for long-form content. External http(s) links open safely.
 */
export function ContentLink({
  href,
  children,
  className,
  siteOrigin,
  rel,
  target,
  ...rest
}: ContentLinkProps) {
  const external = isExternalLink(href, siteOrigin);
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel =
    rel ??
    (resolvedTarget === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <a
      href={href}
      className={cn(
        "text-primary underline decoration-1 underline-offset-[0.2em] transition-colors hover:text-primary/80 focus-visible:rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
        className,
      )}
      target={resolvedTarget}
      rel={resolvedRel}
      {...rest}
    >
      {children}
    </a>
  );
}

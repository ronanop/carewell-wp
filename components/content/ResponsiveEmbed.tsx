import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Responsive 16:9 embed frame for trusted iframes (YouTube, Maps, etc.).
 * Used when composing embeds outside raw Gutenberg HTML.
 */
export interface ResponsiveEmbedProps {
  children: ReactNode;
  className?: string;
  /** Accessible label for the embed region. */
  title?: string;
}

/**
 * Aspect-ratio wrapper that prevents iframe overflow.
 */
export function ResponsiveEmbed({
  children,
  className,
  title = "Embedded media",
}: ResponsiveEmbedProps) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-[var(--radius-md)] bg-muted",
        className,
      )}
      role="group"
      aria-label={title}
    >
      <div className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0">
        {children}
      </div>
    </div>
  );
}

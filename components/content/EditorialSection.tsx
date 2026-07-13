import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface EditorialSectionProps {
  children: ReactNode;
  className?: string;
  /** Accessible name for the article region. */
  "aria-label"?: string;
}

/**
 * Editorial shell — reading rhythm, chapter spacing, brand presentation class.
 */
export function EditorialSection({
  children,
  className,
  "aria-label": ariaLabel = "Article",
}: EditorialSectionProps) {
  return (
    <section
      className={cn(
        "content-enhancer bg-background",
        "pb-16 pt-2 md:pb-20 md:pt-4",
        className,
      )}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}

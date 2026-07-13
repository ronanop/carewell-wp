import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Constrains long-form WordPress content to the editorial reading measure.
 */
export interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  /** Semantic wrapper element. */
  as?: "article" | "section" | "div";
}

/**
 * Reading-width container for Gutenberg HTML (680–760px).
 */
export function ContentContainer({
  children,
  className,
  as: Tag = "div",
}: ContentContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[var(--container-article)] px-4 md:px-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

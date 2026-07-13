import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Semantic content heading for composed (non-Gutenberg) sections.
 */
export interface ContentHeadingProps {
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
  id?: string;
}

const headingTag = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

/**
 * Heading element styled consistently with `.rich-content` typography.
 */
export function ContentHeading({
  level = 2,
  children,
  className,
  id,
}: ContentHeadingProps) {
  const Tag = headingTag[level];

  return (
    <Tag id={id} className={cn("text-balance text-foreground", className)}>
      {children}
    </Tag>
  );
}

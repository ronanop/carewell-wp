import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FigureCaptionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Caption under editorial figures — muted, centered, compact.
 */
export function FigureCaption({ children, className }: FigureCaptionProps) {
  return (
    <figcaption
      className={cn(
        "mt-3 text-center text-small leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </figcaption>
  );
}

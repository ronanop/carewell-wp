import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { tableOverflowHandling } from "@/components/content/content-utils";

/**
 * Horizontally scrollable table shell for long medical comparison tables.
 */
export interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
  caption?: string;
}

/**
 * Wraps a native `<table>` so wide content never overflows the viewport.
 */
export function ResponsiveTable({
  children,
  className,
  caption,
}: ResponsiveTableProps) {
  const { wrapperClass } = tableOverflowHandling();

  return (
    <div
      className={cn(
        wrapperClass,
        "w-full max-w-full overflow-x-auto [-webkit-overflow-scrolling:touch]",
        className,
      )}
      role="region"
      aria-label={caption ?? "Data table"}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

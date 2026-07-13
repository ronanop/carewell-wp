import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TableWrapperProps {
  children: ReactNode;
  className?: string;
  caption?: string;
}

/**
 * Card-style scrollable table shell for medical comparison tables.
 */
export function TableWrapper({
  children,
  className,
  caption,
}: TableWrapperProps) {
  return (
    <div
      className={cn("content-table-wrapper", className)}
      role="region"
      aria-label={caption ?? "Data table"}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

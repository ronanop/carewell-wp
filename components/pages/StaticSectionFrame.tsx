import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { StaticPageMode } from "@/types/static-page-descriptor";

/**
 * Transparent frame around handcrafted sections for Studio overlays.
 * EditorOverlayLayer selects via data-presentation-section (event delegation).
 */
export function StaticSectionFrame({
  id,
  type,
  mode,
  children,
  className,
}: {
  id: string;
  type: string;
  mode: StaticPageMode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-presentation-section={id}
      data-presentation-section-type={type}
      data-static-page-mode={mode}
      className={cn("relative", className)}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

import { FigureCaption } from "@/components/content/FigureCaption";
import { cn } from "@/lib/utils";

export interface ImageWrapperProps {
  children: ReactNode;
  caption?: ReactNode;
  className?: string;
}

/**
 * Curated image frame — radius, border, shadow, hover zoom via CSS.
 */
export function ImageWrapper({
  children,
  caption,
  className,
}: ImageWrapperProps) {
  return (
    <figure className={cn("content-image-wrapper", className)}>
      <div className="content-image-frame">{children}</div>
      {caption ? <FigureCaption>{caption}</FigureCaption> : null}
    </figure>
  );
}

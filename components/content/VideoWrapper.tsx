import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface VideoWrapperProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

/**
 * 16:9 embed shell for YouTube, Maps, and other trusted iframes.
 */
export function VideoWrapper({
  children,
  className,
  title = "Embedded media",
}: VideoWrapperProps) {
  return (
    <div
      className={cn("content-video-wrapper", className)}
      role="group"
      aria-label={title}
    >
      <div className="content-video-frame">{children}</div>
    </div>
  );
}

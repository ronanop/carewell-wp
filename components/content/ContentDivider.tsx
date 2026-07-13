import { cn } from "@/lib/utils";

export interface ContentDividerProps {
  className?: string;
}

/**
 * Subtle luxury divider replacing plain `<hr>` styling in editorial layouts.
 */
export function ContentDivider({ className }: ContentDividerProps) {
  return (
    <hr
      className={cn("content-divider", className)}
      aria-hidden
    />
  );
}

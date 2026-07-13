import { cn } from "@/lib/utils";
import type { WpImageAlignment } from "@/components/content/content-utils";

/**
 * Figure + image + optional caption matching Gutenberg image blocks.
 */
export interface ImageFigureProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  alignment?: WpImageAlignment;
  width?: number;
  height?: number;
}

/**
 * Presentational image figure with design-token radius and caption support.
 */
export function ImageFigure({
  src,
  alt,
  caption,
  className,
  alignment = "aligncenter",
  width,
  height,
}: ImageFigureProps) {
  return (
    <figure className={cn("wp-block-image", alignment, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- WordPress media URLs; next/image domain allowlist is page-level */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="h-auto max-w-full rounded-[var(--radius-lg)]"
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

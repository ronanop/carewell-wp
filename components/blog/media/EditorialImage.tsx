"use client";

import Image from "next/image";
import { useState } from "react";

import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import { cn } from "@/lib/utils";
import type {
  EditorialImageFit,
  EditorialImagePosition,
  ImagePlacement,
} from "@/types/editorial-layout";

export type EditorialImageProps = {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  caption?: string | null;
  credit?: string | null;
  fit?: EditorialImageFit;
  position?: EditorialImagePosition;
  placement?: ImagePlacement;
  rounded?: boolean;
  shadow?: boolean;
  priority?: boolean;
  className?: string;
  enableLightbox?: boolean;
};

/**
 * EditorialImage — never crops unless fit === "cover".
 */
export function EditorialImage({
  src,
  alt,
  width,
  height,
  caption,
  credit,
  fit = "original",
  position = "center",
  placement = "inline",
  rounded = true,
  shadow = true,
  priority = false,
  className,
  enableLightbox = true,
}: EditorialImageProps) {
  const [open, setOpen] = useState(false);
  const isCover = fit === "cover" || fit === "fill";

  const objectPos =
    position === "top"
      ? "center top"
      : position === "bottom"
        ? "center bottom"
        : position === "left"
          ? "left center"
          : position === "right"
            ? "right center"
            : "center";

  const shell = cn(
    "editorial-image group relative",
    placement === "full-width" && "w-full max-w-none",
    placement === "editorial-offset" && "md:-mx-8 lg:-mx-12",
    placement === "floating" && "md:float-right md:ml-6 md:max-w-[42%]",
    placement === "side-by-side" && "w-full",
    className,
  );

  return (
    <figure className={shell} data-placement={placement} data-fit={fit}>
      <button
        type="button"
        className={cn(
          "relative block w-full overflow-hidden bg-muted/40 text-left",
          rounded && "rounded-2xl",
          shadow && "shadow-md ring-1 ring-border/40",
          !isCover && "flex items-center justify-center",
        )}
        onClick={() => {
          if (!enableLightbox) return;
          setOpen(true);
          emitEditorialEvent({ type: "image_opened", src });
        }}
        aria-label={enableLightbox ? `View image: ${alt}` : undefined}
      >
        {isCover ? (
          <span className="relative block aspect-[16/10] w-full">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              className={fit === "fill" ? "object-fill" : "object-cover"}
              style={{ objectPosition: objectPos }}
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </span>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width ?? 1200}
            height={height ?? 800}
            priority={priority}
            className={cn(
              "h-auto w-full transition duration-500 group-hover:scale-[1.01]",
              fit === "contain" && "object-contain",
            )}
            style={{ objectPosition: objectPos }}
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        )}
      </button>
      {(caption || credit) && (
        <figcaption className="mt-2.5 text-center text-xs leading-relaxed text-muted-foreground">
          {caption}
          {credit ? <span className="block opacity-70">{credit}</span> : null}
        </figcaption>
      )}

      {open ? (
        <div
          role="dialog"
          aria-modal
          aria-label="Image lightbox"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-full object-contain"
          />
        </div>
      ) : null}
    </figure>
  );
}

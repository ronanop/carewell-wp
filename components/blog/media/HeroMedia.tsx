"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type {
  EditorialImageFit,
  EditorialImagePosition,
  HeroMediaConfig,
} from "@/types/editorial-layout";
import { DEFAULT_HERO_MEDIA } from "@/types/editorial-layout";

export type HeroMediaProps = {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  config?: Partial<HeroMediaConfig> | null;
  priority?: boolean;
  className?: string;
  showOriginalBadge?: boolean;
};

function resolveFit(
  fit: EditorialImageFit,
  orientation: "portrait" | "landscape" | "square",
): EditorialImageFit {
  if (fit === "responsive") {
    return orientation === "portrait"
      ? "editorial-portrait"
      : orientation === "square"
        ? "contain"
        : "editorial-landscape";
  }
  return fit;
}

function objectPosition(
  position: EditorialImagePosition,
  x?: number,
  y?: number,
): string {
  if (position === "custom") {
    return `${x ?? 50}% ${y ?? 50}%`;
  }
  const map: Record<Exclude<EditorialImagePosition, "custom">, string> = {
    top: "center top",
    center: "center center",
    bottom: "center bottom",
    left: "left center",
    right: "right center",
  };
  return map[position];
}

/**
 * Hero Media — preserves original composition by default (Phase 7.1).
 * Never uses object-cover unless fit === "cover" explicitly.
 */
export function HeroMedia({
  src,
  alt,
  width,
  height,
  config,
  priority = true,
  className,
  showOriginalBadge = false,
}: HeroMediaProps) {
  const cfg: HeroMediaConfig = { ...DEFAULT_HERO_MEDIA, ...config };
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(
    width && height ? { w: width, h: height } : null,
  );

  const orientation = useMemo(() => {
    const w = natural?.w ?? width ?? 16;
    const h = natural?.h ?? height ?? 9;
    const ratio = w / h;
    if (ratio < 0.95) return "portrait" as const;
    if (ratio > 1.05) return "landscape" as const;
    return "square" as const;
  }, [natural, width, height]);

  const fit = resolveFit(cfg.fit, orientation);
  const isCover = fit === "cover" || fit === "fill";
  const pos = objectPosition(cfg.position, cfg.positionX, cfg.positionY);
  const scale = cfg.scale ?? 1;

  if (!isCover) {
    const maxH =
      cfg.containerHeight === "sm"
        ? "max-h-[280px]"
        : cfg.containerHeight === "md"
          ? "max-h-[420px]"
          : cfg.containerHeight === "lg"
            ? "max-h-[560px]"
            : cfg.containerHeight === "xl"
              ? "max-h-[720px]"
              : "max-h-[min(72vh,640px)]";

    return (
      <div
        className={cn("hero-media relative w-full", className)}
        data-fit={fit}
        data-orientation={orientation}
      >
        <div
          className={cn(
            "relative mx-auto flex w-full items-center justify-center overflow-hidden bg-muted/25",
            maxH,
            "rounded-[var(--radius-3xl)]",
            cfg.shadow && "shadow-editorial ring-1 ring-border/40",
          )}
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={natural?.w ?? width ?? 1200}
            height={natural?.h ?? height ?? 800}
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 42vw"
            className={cn(
              "h-auto w-full",
              (fit === "contain" ||
                fit === "editorial-portrait" ||
                fit === "original" ||
                fit === "editorial-landscape") &&
                "object-contain",
              fit === "editorial-portrait" &&
                "max-h-[min(72vh,640px)] w-auto max-w-full",
              fit === "editorial-landscape" && "max-h-[min(56vh,520px)]",
            )}
            style={{ objectPosition: pos }}
            onLoad={(e) => {
              const img = e.currentTarget;
              setNatural({ w: img.naturalWidth, h: img.naturalHeight });
            }}
          />
          {cfg.overlayEnabled ? (
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
              style={{ opacity: cfg.overlayOpacity ?? 0.2 }}
              aria-hidden
            />
          ) : null}
          {cfg.backgroundBlur ? (
            <div
              className="pointer-events-none absolute inset-0 backdrop-blur-[1px]"
              aria-hidden
            />
          ) : null}
        </div>
        {showOriginalBadge && natural ? (
          <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
            Original {natural.w}×{natural.h} · {orientation} · fit:{fit}
          </p>
        ) : null}
      </div>
    );
  }

  const aspect =
    cfg.aspectRatio ??
    (orientation === "portrait"
      ? "3/4"
      : orientation === "square"
        ? "1/1"
        : "16/10");

  return (
    <div
      className={cn("hero-media relative w-full", className)}
      data-fit={fit}
      data-orientation={orientation}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted rounded-[var(--radius-3xl)]",
          cfg.shadow && "shadow-editorial ring-1 ring-border/40",
        )}
        style={{
          aspectRatio: aspect,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 42vw"
          className={fit === "fill" ? "object-fill" : "object-cover"}
          style={{ objectPosition: pos }}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }}
        />
        {cfg.overlayEnabled ? (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"
            style={{ opacity: cfg.overlayOpacity ?? 0.2 }}
            aria-hidden
          />
        ) : null}
      </div>
      {showOriginalBadge ? (
        <p className="mt-2 text-center text-[0.6875rem] text-amber-700">
          Cover mode active — image may be cropped
        </p>
      ) : null}
    </div>
  );
}

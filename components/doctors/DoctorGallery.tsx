"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils";
import type { DoctorGalleryItem } from "@/types/doctor";

interface DoctorGalleryProps {
  items: DoctorGalleryItem[];
}

function MediaSlot({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  /** Local placeholder paths stay visual-only until WordPress media is wired. */
  const isReadyAsset =
    src.startsWith("http") || !src.includes("/placeholders/");

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
      {isReadyAsset ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A2540] via-[#123A5C] to-[#1B6B8A]"
          role="img"
          aria-label={alt}
          data-image-src={src}
        >
          <span className="text-small font-medium tracking-wide text-white/80">
            {label}
          </span>
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-white">
        {label}
      </span>
    </div>
  );
}

export function DoctorGallery({ items }: DoctorGalleryProps) {
  const titleId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((item) => item.id === activeId) ?? null;

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, close]);

  return (
    <section className="bg-background" aria-labelledby="gallery-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Results</p>
          <h2
            id="gallery-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Patient Transformation Gallery
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Before-and-after examples illustrating typical treatment journeys.
            Image slots are ready for WordPress media.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "group w-full overflow-hidden rounded-2xl border border-border/60 bg-white text-left shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                  "transition-shadow hover:shadow-[0_8px_30px_rgb(10_37_64/0.1)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
                aria-label={`View ${item.treatment} before and after`}
              >
                <div className="grid grid-cols-2">
                  <div className="border-r border-border/50">
                    <MediaSlot
                      src={item.beforeSrc}
                      alt={item.altBefore}
                      label="Before"
                    />
                  </div>
                  <MediaSlot
                    src={item.afterSrc}
                    alt={item.altAfter}
                    label="After"
                  />
                </div>
                <div className="border-t border-border/60 px-5 py-4">
                  <p className="font-heading text-body font-semibold text-[#0A2540]">
                    {item.treatment}
                  </p>
                  <p className="mt-1 text-small text-muted-foreground">
                    Open lightbox preview
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white p-4 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                id={titleId}
                className="font-heading text-h4 font-semibold text-[#0A2540]"
              >
                {active.treatment}
              </h3>
              <button
                type="button"
                onClick={close}
                className="flex size-10 items-center justify-center rounded-full text-[#0A2540] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close gallery lightbox"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-xl border border-border/60">
                <MediaSlot
                  src={active.beforeSrc}
                  alt={active.altBefore}
                  label="Before"
                />
                <figcaption className="border-t border-border/60 px-3 py-2 text-center text-small text-muted-foreground">
                  Before
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-xl border border-border/60">
                <MediaSlot
                  src={active.afterSrc}
                  alt={active.altAfter}
                  label="After"
                />
                <figcaption className="border-t border-border/60 px-3 py-2 text-center text-small text-muted-foreground">
                  After
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

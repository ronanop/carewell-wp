"use client";

import { useEffect, useRef, useState } from "react";

type LazyMapEmbedProps = {
  src: string;
  title: string;
  className?: string;
};

/**
 * Loads Google Maps iframe only when near the viewport.
 * Prevents maps.googleapis.com from competing with LCP on first paint.
 */
export function LazyMapEmbed({ src, title, className }: LazyMapEmbedProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || active) return;

    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div ref={hostRef} className={className ?? "absolute inset-0 h-full w-full"}>
      {active ? (
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full max-w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div
          className="absolute inset-0 bg-[#E8EEF2]"
          aria-hidden
        />
      )}
    </div>
  );
}

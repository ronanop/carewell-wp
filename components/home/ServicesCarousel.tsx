"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ServicesCarouselProps = {
  label: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

const SCROLL_EPSILON = 2;
/** Viewport Y (px) the section must cross to enter the scroll-pin zone. */
const PIN_LOCK_Y = 72;
const SNAP_RESTORE_MS = 140;

function normalizeWheelDelta(event: WheelEvent): number {
  let delta = event.deltaY;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= window.innerHeight;
  }
  return delta;
}

export function ServicesCarousel({
  label,
  title,
  description,
  children,
}: ServicesCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const snapRestoreTimerRef = useRef<number | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;

    setCanScrollPrev(el.scrollLeft > SCROLL_EPSILON);
    setCanScrollNext(el.scrollLeft < maxScroll - SCROLL_EPSILON);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, children]);

  /**
   * Scroll-pin: while the section intersects the lock line near the top of the
   * viewport, convert vertical wheel deltas into horizontal track scrolling.
   * Release at clear start/end thresholds so the page can continue vertically.
   * Skipped when prefers-reduced-motion is set (buttons still work).
   *
   * Sticky spacers are avoided because `.homepage-compact` uses overflow-x clip
   * + CSS zoom; getBoundingClientRect-based pin detection stays accurate under zoom.
   */
  useEffect(() => {
    if (reducedMotion) return;

    const scroller = scrollerRef.current;

    const clearSnapRestore = () => {
      if (snapRestoreTimerRef.current !== null) {
        window.clearTimeout(snapRestoreTimerRef.current);
        snapRestoreTimerRef.current = null;
      }
    };

    const inPinZone = () => {
      const root = rootRef.current;
      if (!root) return false;
      const rect = root.getBoundingClientRect();
      return rect.top <= PIN_LOCK_Y && rect.bottom >= PIN_LOCK_Y + 48;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;

      const track = scrollerRef.current;
      if (!track || !inPinZone()) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= SCROLL_EPSILON) return;

      const deltaY = normalizeWheelDelta(event);
      if (deltaY === 0) return;

      const atStart = track.scrollLeft <= SCROLL_EPSILON;
      const atEnd = track.scrollLeft >= maxScroll - SCROLL_EPSILON;

      if ((deltaY > 0 && atEnd) || (deltaY < 0 && atStart)) {
        return;
      }

      event.preventDefault();

      track.style.scrollSnapType = "none";
      clearSnapRestore();
      snapRestoreTimerRef.current = window.setTimeout(() => {
        track.style.scrollSnapType = "";
        snapRestoreTimerRef.current = null;
      }, SNAP_RESTORE_MS);

      track.scrollLeft = Math.min(
        maxScroll,
        Math.max(0, track.scrollLeft + deltaY)
      );
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      clearSnapRestore();
      if (scroller) scroller.style.scrollSnapType = "";
    };
  }, [reducedMotion, children]);

  const getScrollAmount = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;

    const card = el.querySelector<HTMLElement>("[data-service-slide]");
    if (!card) return el.clientWidth * 0.85;

    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  }, []);

  const scrollByDirection = useCallback(
    (direction: -1 | 1) => {
      const el = scrollerRef.current;
      if (!el) return;

      el.scrollBy({
        left: direction * getScrollAmount(),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [getScrollAmount, reducedMotion]
  );

  return (
    <div ref={rootRef}>
      <div className="container-content flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="max-w-3xl">
          {label}
          {title}
          {description}
        </div>

        <div
          className="flex shrink-0 items-center gap-2 self-end"
          role="group"
          aria-label="Service cards"
        >
          <button
            type="button"
            aria-label="Previous services"
            disabled={!canScrollPrev}
            onClick={() => scrollByDirection(-1)}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full",
              "border border-[#0A2540]/15 bg-surface text-[#0A2540] shadow-sm",
              "transition-[opacity,background-color,box-shadow] duration-200",
              "hover:bg-primary/5 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-35"
            )}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next services"
            disabled={!canScrollNext}
            onClick={() => scrollByDirection(1)}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full",
              "border border-primary/20 bg-primary text-primary-foreground shadow-sm",
              "transition-[opacity,background-color,box-shadow] duration-200",
              "hover:bg-primary/90 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-35"
            )}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          "mt-10 flex w-full gap-4 overflow-x-auto px-4 pb-3 pt-2 md:gap-5 md:px-5 lg:gap-6",
          "snap-x snap-mandatory",
          "motion-reduce:scroll-auto",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
        style={{ perspective: "1000px" }}
      >
        {Children.map(children, (child) => (
          <div
            data-service-slide
            className={cn(
              "min-w-0 shrink-0 snap-start",
              "w-[85%]",
              "md:w-[45%]",
              "lg:w-[30%]",
              "[zoom:0.85]"
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

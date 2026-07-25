"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import { StaggerReveal } from "@/components/ui/StaggerReveal";

type ServicesCarouselProps = {
  label: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

/** Movement (px) before a touch gesture locks to an axis. */
const SWIPE_AXIS_LOCK_PX = 10;
/** Horizontal distance (px) required to commit to the next/prev slide. */
const SWIPE_COMMIT_PX = 48;
/** Ignore synthetic clicks after a meaningful horizontal drag. */
const CLICK_SUPPRESS_PX = 8;

export function ServicesCarousel({
  label,
  title,
  description,
  children,
}: ServicesCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    axis: "x" | "y" | null;
    offset: number;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    axis: null,
    offset: 0,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [slideStep, setSlideStep] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const slides = Children.toArray(children);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const slide = track.querySelector<HTMLElement>("[data-service-slide]");
    if (!slide) {
      setSlideStep(0);
      setMaxIndex(0);
      setActiveIndex(0);
      return;
    }

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = slide.getBoundingClientRect().width + gap;
    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const nextMax =
      step > 0 ? Math.max(0, Math.round(maxOffset / step)) : 0;

    setSlideStep(step);
    setMaxIndex(nextMax);
    setActiveIndex((index) => Math.min(index, nextMax));
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);

    return () => observer.disconnect();
  }, [measure, slides.length]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(maxIndex, index)));
      setDragOffset(0);
    },
    [maxIndex]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const commitDrag = useCallback(() => {
    const offset = dragRef.current.offset;
    dragRef.current.pointerId = null;
    dragRef.current.axis = null;
    dragRef.current.offset = 0;
    setIsDragging(false);

    if (Math.abs(offset) > CLICK_SUPPRESS_PX) {
      suppressClickRef.current = true;
    }

    if (offset > SWIPE_COMMIT_PX) {
      goTo(activeIndex - 1);
      return;
    }
    if (offset < -SWIPE_COMMIT_PX) {
      goTo(activeIndex + 1);
      return;
    }
    setDragOffset(0);
  }, [activeIndex, goTo]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (maxIndex <= 0) return;

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        axis: null,
        offset: 0,
      };
      setDragOffset(0);
    },
    [maxIndex]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (drag.axis === null) {
        if (
          Math.abs(dx) < SWIPE_AXIS_LOCK_PX &&
          Math.abs(dy) < SWIPE_AXIS_LOCK_PX
        ) {
          return;
        }

        // Vertical intent: abandon carousel gesture so page can scroll.
        if (Math.abs(dy) > Math.abs(dx)) {
          drag.pointerId = null;
          drag.axis = "y";
          drag.offset = 0;
          setIsDragging(false);
          setDragOffset(0);
          return;
        }

        drag.axis = "x";
        setIsDragging(true);
        if (viewportRef.current) {
          viewportRef.current.style.touchAction = "none";
        }
        try {
          viewportRef.current?.setPointerCapture(event.pointerId);
        } catch {
          // Ignore capture errors on unsupported targets.
        }
      }

      if (drag.axis !== "x") return;

      event.preventDefault();

      // Resist drag past the ends.
      let nextOffset = dx;
      if ((activeIndex <= 0 && dx > 0) || (activeIndex >= maxIndex && dx < 0)) {
        nextOffset = dx * 0.35;
      }

      drag.offset = nextOffset;
      setDragOffset(nextOffset);
    },
    [activeIndex, maxIndex]
  );

  const endPointerGesture = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, commit: boolean) => {
      if (dragRef.current.pointerId !== event.pointerId) return;

      if (viewportRef.current) {
        viewportRef.current.style.touchAction = "pan-y";
      }

      if (commit && dragRef.current.axis === "x") {
        commitDrag();
      } else {
        dragRef.current.pointerId = null;
        dragRef.current.axis = null;
        dragRef.current.offset = 0;
        setIsDragging(false);
        setDragOffset(0);
      }

      try {
        viewportRef.current?.releasePointerCapture(event.pointerId);
      } catch {
        // Already released.
      }
    },
    [commitDrag]
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      endPointerGesture(event, true);
    },
    [endPointerGesture]
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      endPointerGesture(event, false);
    },
    [endPointerGesture]
  );

  const onClickCapture = useCallback((event: ReactMouseEvent) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const translateX = -(activeIndex * slideStep) + dragOffset;
  const canScrollPrev = activeIndex > 0;
  const canScrollNext = activeIndex < maxIndex;

  return (
    <div>
      <div className="container-content flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <StaggerReveal className="max-w-3xl" stepMs={70}>
          {label}
          {title}
          {description}
        </StaggerReveal>

        <div
          className="flex shrink-0 items-center gap-2 self-end"
          role="group"
          aria-label="Service cards"
        >
          <button
            type="button"
            aria-label="Previous services"
            disabled={!canScrollPrev}
            onClick={goPrev}
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
            onClick={goNext}
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

      <div className="mt-8 px-4 pb-3 pt-2 sm:mt-10 md:px-5">
        <div
          ref={viewportRef}
          className={cn(
            "w-full overflow-hidden [container-type:inline-size]",
            isDragging && "cursor-grabbing"
          )}
          style={{ perspective: "1000px", touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClickCapture={onClickCapture}
          role="region"
          aria-roledescription="carousel"
          aria-label="Services"
        >
          <div
            ref={trackRef}
            className={cn(
              "flex w-max gap-3 sm:gap-4 md:gap-5 lg:gap-6",
              !isDragging &&
                !reducedMotion &&
                "transition-transform duration-300 ease-out",
              !isDragging && reducedMotion && "transition-none"
            )}
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              willChange: isDragging ? "transform" : undefined,
            }}
          >
            {slides.map((child, index) => (
              <div
                key={index}
                data-service-slide
                className={cn(
                  "min-w-0 shrink-0",
                  "w-[min(17.5rem,82cqi)]",
                  "sm:w-[85cqi]",
                  "md:w-[45cqi]",
                  "lg:w-[30cqi]",
                  "lg:[zoom:0.85]"
                )}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "@/lib/utils";

type ServicesCarouselProps = {
  label: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  /** Section root — vertically centered on horizontal carousel engagement. */
  sectionRef?: RefObject<HTMLElement | null>;
};

const SCROLL_EPSILON = 2;
/** Viewport Y (px) the section must cross to enter the scroll-pin zone. */
const PIN_LOCK_Y = 72;
const SNAP_RESTORE_MS = 140;
/** Movement (px) before a touch gesture locks to an axis. */
const TOUCH_AXIS_LOCK_PX = 8;
/** Skip re-centering when section mid-point is already this close to viewport center. */
const CENTER_THRESHOLD_PX = 100;
/** Idle gap after last horizontal engagement before a new center session can run. */
const ENGAGEMENT_IDLE_MS = 900;
/**
 * Minimum visible fraction of the align target required before auto-center may run.
 * Stricter on narrow viewports so mobile vertical scroll is not yanked back.
 */
const CENTER_VISIBLE_RATIO_DESKTOP = 0.45;
const CENTER_VISIBLE_RATIO_MOBILE = 0.55;
const MOBILE_VIEWPORT_MAX_PX = 768;

function normalizeWheelDelta(event: WheelEvent): number {
  let delta = event.deltaY;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= window.innerHeight;
  }
  return delta;
}

function syncTrackTouchAction(track: HTMLDivElement) {
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll <= SCROLL_EPSILON) {
    track.style.touchAction = "pan-y";
    return;
  }

  const atStart = track.scrollLeft <= SCROLL_EPSILON;
  const atEnd = track.scrollLeft >= maxScroll - SCROLL_EPSILON;

  // Mid-carousel: horizontal only so the page cannot steal the gesture.
  // At either end: allow vertical so continued swipe can leave the section.
  track.style.touchAction =
    atStart || atEnd ? "pan-x pan-y" : "pan-x";
}

function isNearVerticalCenter(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const elCenter = rect.top + rect.height / 2;
  const viewCenter = window.innerHeight / 2;
  return Math.abs(elCenter - viewCenter) <= CENTER_THRESHOLD_PX;
}

function requiredCenterVisibleRatio(): number {
  return window.innerWidth < MOBILE_VIEWPORT_MAX_PX
    ? CENTER_VISIBLE_RATIO_MOBILE
    : CENTER_VISIBLE_RATIO_DESKTOP;
}

/**
 * True when a substantial portion of the section is on-screen and its vertical
 * center is not far outside the viewport (user has not scrolled past).
 */
function isSubstantiallyInView(el: HTMLElement, minRatio?: number): boolean {
  const ratio = minRatio ?? requiredCenterVisibleRatio();
  const rect = el.getBoundingClientRect();
  const viewH = window.innerHeight;
  if (rect.height <= 0 || viewH <= 0) return false;

  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, viewH);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  if (visibleHeight / rect.height < ratio) return false;

  // Reject when the section's midpoint has left the viewport by a large margin
  // (scrolled past up or down) even if a thin sliver still intersects.
  const elCenter = rect.top + rect.height / 2;
  const margin = viewH * 0.15;
  return elCenter > -margin && elCenter < viewH + margin;
}

export function ServicesCarousel({
  label,
  title,
  description,
  children,
  sectionRef,
}: ServicesCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const snapRestoreTimerRef = useRef<number | null>(null);
  const centeredThisSessionRef = useRef(false);
  const engagementIdleTimerRef = useRef<number | null>(null);
  /** Section is substantially in view — updated by IntersectionObserver + live checks. */
  const sectionSubstantiallyVisibleRef = useRef(false);
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
    syncTrackTouchAction(el);
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
      el.style.touchAction = "";
    };
  }, [updateScrollState, children]);

  const clearSnapRestore = useCallback(() => {
    if (snapRestoreTimerRef.current !== null) {
      window.clearTimeout(snapRestoreTimerRef.current);
      snapRestoreTimerRef.current = null;
    }
  }, []);

  const suspendSnapDuringDrag = useCallback(
    (track: HTMLDivElement) => {
      track.style.scrollSnapType = "none";
      clearSnapRestore();
      snapRestoreTimerRef.current = window.setTimeout(() => {
        track.style.scrollSnapType = "";
        snapRestoreTimerRef.current = null;
      }, SNAP_RESTORE_MS);
    },
    [clearSnapRestore]
  );

  const inPinZone = useCallback(() => {
    const root = rootRef.current;
    if (!root) return false;

    const alignTarget = sectionRef?.current ?? root;
    // Do not steal vertical wheel once the user has scrolled past the section.
    if (!isSubstantiallyInView(alignTarget)) return false;

    const rect = root.getBoundingClientRect();
    const nearTop =
      rect.top <= PIN_LOCK_Y && rect.bottom >= PIN_LOCK_Y + 48;
    // After vertical centering, keep pin active while the section spans mid-viewport.
    const viewCenter = window.innerHeight / 2;
    const nearCenter = rect.top < viewCenter && rect.bottom > viewCenter;
    return nearTop || nearCenter;
  }, [sectionRef]);

  const getAlignTarget = useCallback(() => {
    return sectionRef?.current ?? rootRef.current;
  }, [sectionRef]);

  const endEngagementSession = useCallback(() => {
    if (engagementIdleTimerRef.current !== null) {
      window.clearTimeout(engagementIdleTimerRef.current);
      engagementIdleTimerRef.current = null;
    }
    centeredThisSessionRef.current = false;
  }, []);

  /**
   * Once per horizontal-engagement session: smooth-scroll the section to vertical
   * center — only when the section is already substantially in view. Skips entirely
   * once the user has scrolled past. Idle / leave-viewport clears the session so a
   * later intentional re-entry can center again.
   */
  const noteHorizontalEngagement = useCallback(() => {
    const target = getAlignTarget();
    if (!target) return;

    // Live geometry check — do not rely on a stale observer flag alone.
    if (!isSubstantiallyInView(target)) {
      sectionSubstantiallyVisibleRef.current = false;
      endEngagementSession();
      return;
    }
    sectionSubstantiallyVisibleRef.current = true;

    if (engagementIdleTimerRef.current !== null) {
      window.clearTimeout(engagementIdleTimerRef.current);
    }
    engagementIdleTimerRef.current = window.setTimeout(() => {
      centeredThisSessionRef.current = false;
      engagementIdleTimerRef.current = null;
    }, ENGAGEMENT_IDLE_MS);

    if (centeredThisSessionRef.current) return;
    centeredThisSessionRef.current = true;

    if (isNearVerticalCenter(target)) return;

    target.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [endEngagementSession, getAlignTarget, reducedMotion]);

  // Keep gesture handlers on refs so effect deps stay fixed-length (HMR-safe).
  const clearSnapRestoreRef = useRef(clearSnapRestore);
  const suspendSnapDuringDragRef = useRef(suspendSnapDuringDrag);
  const inPinZoneRef = useRef(inPinZone);
  const noteHorizontalEngagementRef = useRef(noteHorizontalEngagement);
  const endEngagementSessionRef = useRef(endEngagementSession);
  clearSnapRestoreRef.current = clearSnapRestore;
  suspendSnapDuringDragRef.current = suspendSnapDuringDrag;
  inPinZoneRef.current = inPinZone;
  noteHorizontalEngagementRef.current = noteHorizontalEngagement;
  endEngagementSessionRef.current = endEngagementSession;

  useEffect(() => {
    return () => {
      if (engagementIdleTimerRef.current !== null) {
        window.clearTimeout(engagementIdleTimerRef.current);
      }
    };
  }, []);

  /**
   * Track substantial visibility of the align target. Leaving the viewport ends
   * the center session so a later re-entry can center once on intentional interaction.
   */
  useEffect(() => {
    const target = getAlignTarget();
    if (!target || typeof IntersectionObserver === "undefined") return;

    const thresholds = [0, 0.25, 0.4, 0.45, 0.5, 0.55, 0.75, 1];

    const observer = new IntersectionObserver(
      ([entry]) => {
        const minRatio = requiredCenterVisibleRatio();
        const visible =
          entry.isIntersecting &&
          entry.intersectionRatio >= minRatio &&
          isSubstantiallyInView(target, minRatio);

        sectionSubstantiallyVisibleRef.current = visible;
        if (!visible) {
          endEngagementSessionRef.current();
        }
      },
      { threshold: thresholds }
    );

    observer.observe(target);
    // Seed from live geometry (observer may fire async).
    sectionSubstantiallyVisibleRef.current = isSubstantiallyInView(target);

    return () => observer.disconnect();
  }, [getAlignTarget, children]);

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

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;

      const track = scrollerRef.current;
      if (!track || !inPinZoneRef.current()) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= SCROLL_EPSILON) return;

      const deltaY = normalizeWheelDelta(event);
      if (deltaY === 0) return;

      const atStart = track.scrollLeft <= SCROLL_EPSILON;
      const atEnd = track.scrollLeft >= maxScroll - SCROLL_EPSILON;

      if ((deltaY > 0 && atEnd) || (deltaY < 0 && atStart)) {
        // User intends vertical page scroll — do not yank section back to center.
        endEngagementSessionRef.current();
        return;
      }

      event.preventDefault();
      suspendSnapDuringDragRef.current(track);
      noteHorizontalEngagementRef.current();

      track.scrollLeft = Math.min(
        maxScroll,
        Math.max(0, track.scrollLeft + deltaY)
      );
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      clearSnapRestoreRef.current();
      if (scroller) scroller.style.scrollSnapType = "";
    };
  }, [reducedMotion, children]);

  /**
   * Touch: prefer native overflow scrolling (snap + momentum) via dynamic
   * touch-action. When the gesture starts at an edge with pan-x pan-y enabled,
   * claim clearly horizontal swipes into the track so vertical page scroll
   * cannot win before cards have been exhausted.
   */
  useEffect(() => {
    const track = scrollerRef.current;
    if (!track) return;

    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let axis: "x" | "y" | null = null;
    let activeTouchId: number | null = null;
    let manualDrag = false;

    const endGesture = () => {
      if (manualDrag) {
        suspendSnapDuringDragRef.current(track);
      }
      axis = null;
      activeTouchId = null;
      manualDrag = false;
      syncTrackTouchAction(track);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        endGesture();
        return;
      }
      const touch = event.touches[0];
      activeTouchId = touch.identifier;
      startX = touch.clientX;
      startY = touch.clientY;
      startScrollLeft = track.scrollLeft;
      axis = null;
      manualDrag = false;
      syncTrackTouchAction(track);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (activeTouchId === null) return;

      let touch: Touch | undefined;
      for (let i = 0; i < event.touches.length; i++) {
        if (event.touches[i].identifier === activeTouchId) {
          touch = event.touches[i];
          break;
        }
      }
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (axis === null) {
        if (
          Math.abs(dx) < TOUCH_AXIS_LOCK_PX &&
          Math.abs(dy) < TOUCH_AXIS_LOCK_PX
        ) {
          return;
        }
        axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        if (axis === "y") {
          endEngagementSessionRef.current();
        }
      }

      if (axis === "y") return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= SCROLL_EPSILON) return;

      const towardEnd = dx < 0;
      const towardStart = dx > 0;
      const startedAtStart = startScrollLeft <= SCROLL_EPSILON;
      const startedAtEnd = startScrollLeft >= maxScroll - SCROLL_EPSILON;
      const startedMid = !startedAtStart && !startedAtEnd;

      // Mid-track already uses touch-action: pan-x — keep native momentum.
      if (startedMid && !manualDrag) {
        noteHorizontalEngagementRef.current();
        return;
      }

      // At the matching edge going further out — release to vertical page scroll.
      if ((towardEnd && startedAtEnd) || (towardStart && startedAtStart)) {
        endEngagementSessionRef.current();
        return;
      }

      // Entering the carousel from an edge (or continuing a claimed drag).
      if (event.cancelable) {
        event.preventDefault();
      }
      manualDrag = true;
      track.style.scrollSnapType = "none";
      track.style.touchAction = "none";
      noteHorizontalEngagementRef.current();

      track.scrollLeft = Math.min(
        maxScroll,
        Math.max(0, startScrollLeft - dx)
      );
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", endGesture, { passive: true });
    track.addEventListener("touchcancel", endGesture, { passive: true });

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", endGesture);
      track.removeEventListener("touchcancel", endGesture);
    };
  }, [children]);

  // Trackpad / overflow horizontal scroll + prev/next buttons.
  useEffect(() => {
    const track = scrollerRef.current;
    if (!track) return;

    let lastScrollLeft = track.scrollLeft;

    const onScroll = () => {
      const next = track.scrollLeft;
      if (Math.abs(next - lastScrollLeft) > SCROLL_EPSILON) {
        noteHorizontalEngagementRef.current();
      }
      lastScrollLeft = next;
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [children]);

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

      noteHorizontalEngagement();
      el.scrollBy({
        left: direction * getScrollAmount(),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [getScrollAmount, noteHorizontalEngagement, reducedMotion]
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
          "overscroll-x-contain",
          "motion-reduce:scroll-auto",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
        style={{ perspective: "1000px", WebkitOverflowScrolling: "touch" }}
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

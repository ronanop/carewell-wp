"use client";

import { useEffect, useRef, type ReactNode } from "react";

const LG_MQ = "(min-width: 1024px)";
const FALLBACK_TOP_PX = 80;

type Mode = "flow" | "fixed" | "pinned-end";

function measureStickyTop(): number {
  const chrome = document.querySelector(
    ".sticky.top-0.z-sticky",
  ) as HTMLElement | null;
  if (chrome) {
    return Math.ceil(chrome.getBoundingClientRect().bottom) + 8;
  }
  return FALLBACK_TOP_PX;
}

/**
 * Desktop-only sticky booking rail.
 * On mobile, renders children in normal flow with zero scroll listeners
 * (avoids forced reflow competing with LCP).
 */
export function ServiceStickyBookingRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const railRef = useRef<HTMLAsideElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>("flow");
  const metricsRef = useRef({ left: 0, width: 320, top: FALLBACK_TOP_PX });

  useEffect(() => {
    const rail = railRef.current;
    const placeholder = placeholderRef.current;
    const card = cardRef.current;
    if (!rail || !placeholder || !card) return;

    // Mobile: no sticky math — leave the card in document flow.
    if (!window.matchMedia(LG_MQ).matches) return;

    const measureRail = () => {
      const rect = placeholder.getBoundingClientRect();
      metricsRef.current = {
        left: Math.round(rect.left),
        width: Math.round(placeholder.offsetWidth),
        top: measureStickyTop(),
      };
    };

    const applyFlow = () => {
      placeholder.style.height = "";
      card.style.cssText = "";
      modeRef.current = "flow";
    };

    const applyFixed = () => {
      const { left, width, top } = metricsRef.current;
      placeholder.style.height = `${card.offsetHeight}px`;
      card.style.position = "fixed";
      card.style.top = `${top}px`;
      card.style.bottom = "auto";
      card.style.left = `${left}px`;
      card.style.width = `${width}px`;
      card.style.zIndex = "30";
      card.style.margin = "0";
      card.style.transform = "translate3d(0,0,0)";
      card.style.backfaceVisibility = "hidden";
      modeRef.current = "fixed";
    };

    const applyPinnedEnd = () => {
      placeholder.style.height = `${card.offsetHeight}px`;
      card.style.position = "absolute";
      card.style.top = "auto";
      card.style.bottom = "0";
      card.style.left = "0";
      card.style.width = "100%";
      card.style.zIndex = "30";
      card.style.margin = "0";
      card.style.transform = "translate3d(0,0,0)";
      modeRef.current = "pinned-end";
    };

    const update = () => {
      if (!window.matchMedia(LG_MQ).matches) {
        if (modeRef.current !== "flow") applyFlow();
        return;
      }

      const contentCol = rail.parentElement?.querySelector(
        ".service-main-column",
      ) as HTMLElement | null;
      if (!contentCol) return;

      if (modeRef.current === "flow") {
        measureRail();
      }

      const top = metricsRef.current.top;
      const placeholderTop = placeholder.getBoundingClientRect().top;
      const contentBottom = contentCol.getBoundingClientRect().bottom;
      const height = card.offsetHeight;

      const shouldFix = placeholderTop <= top + 0.5;
      const shouldPinEnd = contentBottom <= top + height + 16;

      let next: Mode = "flow";
      if (shouldPinEnd) next = "pinned-end";
      else if (shouldFix) next = "fixed";

      if (next === modeRef.current) return;

      if (next === "fixed") {
        measureRail();
        applyFixed();
      } else if (next === "pinned-end") {
        applyPinnedEnd();
      } else {
        applyFlow();
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    const onResize = () => {
      if (!window.matchMedia(LG_MQ).matches) {
        applyFlow();
        return;
      }
      measureRail();
      const prev = modeRef.current;
      modeRef.current = "flow";
      if (prev === "fixed") applyFixed();
      else update();
    };

    measureRail();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => {
      if (modeRef.current === "flow") measureRail();
      if (modeRef.current === "fixed") {
        placeholder.style.height = `${card.offsetHeight}px`;
        card.style.left = `${metricsRef.current.left}px`;
        card.style.width = `${metricsRef.current.width}px`;
      }
      update();
    });
    const content = rail.parentElement?.querySelector(".service-main-column");
    if (content) ro.observe(content);
    ro.observe(card);
    ro.observe(rail);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  return (
    <aside
      ref={railRef}
      className={className}
      style={{ position: "relative" }}
    >
      <div ref={placeholderRef}>
        <div ref={cardRef}>{children}</div>
      </div>
    </aside>
  );
}

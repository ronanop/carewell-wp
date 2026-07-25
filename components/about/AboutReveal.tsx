"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type AboutRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Slight horizontal slide for alternating chapters. */
  from?: "up" | "left" | "right";
};

/**
 * Soft scroll reveal for About page chapters.
 * CSS + IntersectionObserver (no Framer) — respects prefers-reduced-motion.
 */
export function AboutReveal({
  children,
  className,
  delay = 0,
  from = "up",
}: AboutRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const offsetX = from === "left" ? -24 : from === "right" ? 24 : 0;
  const offsetY = from === "up" ? 20 : 0;

  const style: CSSProperties | undefined = reduceMotion
    ? undefined
    : {
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0,0,0)"
          : `translate3d(${offsetX}px, ${offsetY}px, 0)`,
        transitionProperty: "opacity, transform",
        transitionDuration: "550ms",
        transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        transitionDelay: visible ? `${delay}s` : "0s",
        willChange: visible ? "auto" : "opacity, transform",
      };

  return (
    <div ref={ref} className={cn(className)} style={style}>
      {children}
    </div>
  );
}

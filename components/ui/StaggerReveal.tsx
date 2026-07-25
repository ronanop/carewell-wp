"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * Animate on mount (hero / above-the-fold).
   * Default: reveal when scrolled into view.
   */
  immediate?: boolean;
  /** Semantic wrapper — keep `ul`/`ol` for list children. */
  as?: ElementType;
  /**
   * Stagger step in ms between direct children.
   * Applied via CSS variable `--stagger-step`.
   */
  stepMs?: number;
};

/**
 * Subtle fade-up for direct children, one-by-one.
 * CSS-driven delays — no Framer. Honors prefers-reduced-motion.
 */
export function StaggerReveal({
  children,
  className,
  immediate = false,
  as: Tag = "div",
  stepMs = 70,
}: StaggerRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
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

    if (immediate) {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, reduceMotion]);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "stagger-reveal",
        visible && "is-revealed",
        reduceMotion && "stagger-reveal--reduced",
        className,
      )}
      style={{ ["--stagger-step" as string]: `${stepMs}ms` }}
    >
      {children}
    </Tag>
  );
}

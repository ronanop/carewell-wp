"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1500;

type ParsedStat = {
  target: number;
  decimals: number;
  suffix: string;
  useGrouping: boolean;
};

function parseStatValue(raw: string): ParsedStat | null {
  const match = raw.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const [, numStr, suffix] = match;
  const target = Number.parseFloat(numStr.replace(/,/g, ""));
  if (Number.isNaN(target)) return null;

  const decimalPart = numStr.split(".")[1];
  return {
    target,
    decimals: decimalPart?.length ?? 0,
    suffix,
    useGrouping: numStr.includes(","),
  };
}

function formatStat(n: number, parsed: ParsedStat): string {
  const formatted = n.toLocaleString("en-US", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
    useGrouping: parsed.useGrouping,
  });
  return `${formatted}${parsed.suffix}`;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

type AnimatedStatProps = {
  value: string;
};

export function AnimatedStat({ value }: AnimatedStatProps) {
  const parsed = parseStatValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() =>
    parsed ? formatStat(0, parsed) : value
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    const stat = parseStatValue(value);
    if (!stat) {
      setDisplay(value);
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    setDisplay(formatStat(0, stat));

    const node = ref.current;
    if (!node) return;

    let frameId = 0;
    let startTime: number | null = null;

    const animate = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / DURATION_MS, 1);
      setDisplay(formatStat(stat.target * easeOutCubic(progress), stat));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();
        frameId = requestAnimationFrame(animate);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [value]);

  if (!parsed) {
    return <span>{value}</span>;
  }

  return <span ref={ref}>{display}</span>;
}

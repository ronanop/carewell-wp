import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "dark" | "brand";
};

const toneClass: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-white text-slate-900",
  muted: "bg-[#F6F7F9] text-slate-900",
  dark: "bg-[#0A2E52] text-white",
  brand: "bg-[#0B7B6B] text-white",
};

export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className,
  tone = "default",
}: Props) {
  return (
    <section id={id} className={cn("px-4 py-12 sm:py-16", toneClass[tone], className)}>
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p
            className={cn(
              "mb-2 text-xs font-semibold tracking-wide uppercase",
              tone === "dark" || tone === "brand"
                ? "text-white/70"
                : "text-[#1557A0]",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2
            className={cn(
              "mb-6 text-2xl font-semibold tracking-tight sm:text-3xl",
              tone === "dark" || tone === "brand"
                ? "text-white"
                : "text-slate-900",
            )}
          >
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}

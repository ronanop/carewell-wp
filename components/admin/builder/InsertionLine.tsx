"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function InsertionLine({
  label = "Insert here",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.85 }}
      animate={{ opacity: 1, scaleX: 1 }}
      className={cn("relative z-30 h-0", className)}
    >
      <div className="absolute inset-x-4 -top-0.5 flex items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.25)]" />
        <div className="h-0.5 flex-1 rounded-full bg-sky-500" />
        <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-white shadow-sm">
          {label}
        </span>
        <div className="h-0.5 flex-1 rounded-full bg-sky-500" />
        <span className="size-2.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.25)]" />
      </div>
    </motion.div>
  );
}

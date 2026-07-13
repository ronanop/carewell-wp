import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning";
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-small text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-h2 font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-[0.75rem] text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            tone === "success" && "bg-emerald-500/10 text-emerald-700",
            tone === "warning" && "bg-amber-500/10 text-amber-700",
            tone === "default" && "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}

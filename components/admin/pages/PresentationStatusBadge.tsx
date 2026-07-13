"use client";

import type { PresentationBadge } from "@/lib/experience/pages/pageList";
import { cn } from "@/lib/utils";

const BADGE_STYLES: Record<
  PresentationBadge,
  { label: string; className: string }
> = {
  configured: {
    label: "Configured",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  not_configured: {
    label: "Not Configured",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  outdated: {
    label: "Outdated",
    className: "bg-orange-50 text-orange-800 ring-orange-200",
  },
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700 ring-slate-200",
  },
  published: {
    label: "Published",
    className: "bg-primary/10 text-primary ring-primary/20",
  },
};

export function PresentationStatusBadge({
  badge,
}: {
  badge: PresentationBadge;
}) {
  const style = BADGE_STYLES[badge];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[0.6875rem] font-medium ring-1 ring-inset",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}

export function WpStatusBadge({ status }: { status: string }) {
  const published = status.toLowerCase() === "publish";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[0.6875rem] font-medium ring-1 ring-inset",
        published
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200",
      )}
    >
      {published ? "Published" : status}
    </span>
  );
}

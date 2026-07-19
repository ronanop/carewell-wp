"use client";

import { cn } from "@/lib/utils";
import type { ExperienceReviewReport } from "@/lib/experience/quality/reviewMode";

/**
 * Experience Review Mode panel — Studio-facing editorial quality scores.
 */
export function ExperienceReviewPanel({
  review,
  className,
}: {
  review: ExperienceReviewReport;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-[var(--radius-3xl)] border border-border bg-surface p-5 shadow-sm",
        className,
      )}
      aria-label="Experience review"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Review Mode
          </p>
          <p className="mt-1 font-heading text-lg font-semibold text-foreground">
            Grade {review.grade}
          </p>
        </div>
        <p className="font-heading text-3xl font-semibold tabular-nums text-primary">
          {review.overallScore}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {review.summary}
      </p>

      <ul className="mt-5 space-y-3">
        {review.dimensions.map((dim) => (
          <li key={dim.id}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-foreground">{dim.label}</span>
              <span className="tabular-nums text-muted-foreground">{dim.score}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-[var(--motion-duration-moderate)]",
                  dim.score >= 80
                    ? "bg-success-600"
                    : dim.score >= 60
                      ? "bg-primary"
                      : "bg-warning-500",
                )}
                style={{ width: `${dim.score}%` }}
              />
            </div>
            {dim.suggestions[0] ? (
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                {dim.suggestions[0]}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {review.warnings.length > 0 ? (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Warnings
          </p>
          <ul className="mt-2 space-y-1.5">
            {review.warnings.slice(0, 6).map((w) => (
              <li
                key={`${w.code}-${w.message}`}
                className="text-xs text-foreground/80"
              >
                <span
                  className={cn(
                    "mr-1.5 inline-block rounded px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase",
                    w.severity === "error"
                      ? "bg-error-50 text-error-600"
                      : w.severity === "warn"
                        ? "bg-warning-50 text-warning-700"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {w.severity}
                </span>
                {w.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

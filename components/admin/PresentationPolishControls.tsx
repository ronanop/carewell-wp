"use client";

import type { ExperiencePresentationPolish } from "@/types/editorial-layout";
import { cn } from "@/lib/utils";

/**
 * Studio controls for Phase 8.1 presentation polish.
 * Presentation overlay only — never edits WordPress HTML.
 */
export function PresentationPolishControls({
  value,
  onChange,
  className,
}: {
  value: ExperiencePresentationPolish;
  onChange: (next: ExperiencePresentationPolish) => void;
  className?: string;
}) {
  const patch = <K extends keyof ExperiencePresentationPolish>(
    key: K,
    next: ExperiencePresentationPolish[K],
  ) => onChange({ ...value, [key]: next });

  return (
    <fieldset
      className={cn(
        "space-y-4 rounded-[var(--radius-2xl)] border border-border bg-surface p-4",
        className,
      )}
    >
      <legend className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Presentation polish
      </legend>

      <label className="flex items-center justify-between gap-3 text-sm">
        <span>Prefer soft surfaces</span>
        <input
          type="checkbox"
          checked={value.preferSoftSurfaces !== false}
          onChange={(e) => patch("preferSoftSurfaces", e.target.checked)}
          className="size-4 accent-primary"
        />
      </label>

      <label className="flex items-center justify-between gap-3 text-sm">
        <span>Tight hero → content handoff</span>
        <input
          type="checkbox"
          checked={value.tightHeroHandoff !== false}
          onChange={(e) => patch("tightHeroHandoff", e.target.checked)}
          className="size-4 accent-primary"
        />
      </label>

      <label className="block text-sm">
        <span className="text-muted-foreground">Reading measure</span>
        <select
          className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          value={value.readingMeasure ?? "comfortable"}
          onChange={(e) =>
            patch(
              "readingMeasure",
              e.target.value as ExperiencePresentationPolish["readingMeasure"],
            )
          }
        >
          <option value="narrow">Narrow (~68ch)</option>
          <option value="comfortable">Comfortable (~72ch)</option>
          <option value="wide">Wide (~75ch)</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-muted-foreground">Default card style</span>
        <select
          className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          value={value.defaultCardStyle ?? "editorial"}
          onChange={(e) =>
            patch(
              "defaultCardStyle",
              e.target.value as ExperiencePresentationPolish["defaultCardStyle"],
            )
          }
        >
          <option value="minimal">Minimal</option>
          <option value="editorial">Editorial</option>
          <option value="medical">Medical</option>
          <option value="glass">Glass</option>
          <option value="highlight">Highlight</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-muted-foreground">Button hierarchy</span>
        <select
          className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          value={value.buttonHierarchy ?? "primary-secondary-tertiary"}
          onChange={(e) =>
            patch(
              "buttonHierarchy",
              e.target.value as ExperiencePresentationPolish["buttonHierarchy"],
            )
          }
        >
          <option value="primary-secondary-tertiary">
            Primary → Secondary → Tertiary
          </option>
          <option value="primary-only">Primary only</option>
        </select>
      </label>
    </fieldset>
  );
}

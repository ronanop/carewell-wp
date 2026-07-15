/**
 * Descriptor-driven property fields for Static Experience Studio (ADR-015).
 */

"use client";

import type { SectionPropSchema } from "@/types/static-page-descriptor";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-small";

export function DescriptorPropField({
  schema,
  value,
  onChange,
}: {
  schema: SectionPropSchema;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const stringValue =
    value === null || value === undefined ? "" : String(value);

  switch (schema.type) {
    case "textarea":
      return (
        <label className="block text-small">
          <span className="font-medium text-foreground">{schema.label}</span>
          {schema.description ? (
            <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
              {schema.description}
            </span>
          ) : null}
          <textarea
            className={inputClass}
            rows={3}
            value={stringValue}
            onChange={(event) => onChange(event.target.value || undefined)}
            placeholder="Handcrafted default"
          />
        </label>
      );
    case "boolean":
      return (
        <label className="flex items-center justify-between gap-3 text-small">
          <span className="font-medium text-foreground">{schema.label}</span>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
        </label>
      );
    case "number":
      return (
        <label className="block text-small">
          <span className="font-medium text-foreground">{schema.label}</span>
          <input
            type="number"
            className={inputClass}
            value={typeof value === "number" ? value : ""}
            onChange={(event) => {
              const raw = event.target.value;
              onChange(raw === "" ? undefined : Number(raw));
            }}
          />
        </label>
      );
    case "select":
      return (
        <label className="block text-small">
          <span className="font-medium text-foreground">{schema.label}</span>
          <select
            className={inputClass}
            value={stringValue}
            onChange={(event) => onChange(event.target.value || undefined)}
          >
            <option value="">Default</option>
            {(schema.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      );
    case "image":
    case "url":
    case "text":
    default:
      return (
        <label className="block text-small">
          <span className="font-medium text-foreground">{schema.label}</span>
          {schema.description ? (
            <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
              {schema.description}
            </span>
          ) : null}
          <input
            className={inputClass}
            value={stringValue}
            onChange={(event) => onChange(event.target.value || undefined)}
            placeholder="Handcrafted default"
          />
        </label>
      );
  }
}

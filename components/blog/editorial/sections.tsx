"use client";

import { memo, useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import { formatEditorialListItem, stripEmojiFromHtml } from "@/lib/content/editorialText";
import type { ArticleFaqItem } from "@/types/article-ast";
import type { EditorialSectionProps } from "@/lib/experience/blog/editorial/registry";

function SectionShell({
  section,
  children,
  className,
  tone = "default",
}: {
  section: EditorialSectionProps["section"];
  children: ReactNode;
  className?: string;
  tone?: "default" | "amber" | "primary" | "muted";
}) {
  return (
    <section
      id={section.anchorId ?? undefined}
      data-semantic-type={section.type}
      data-semantic-id={section.id}
      className={cn(
        "editorial-section scroll-mt-28",
        tone === "amber" && "editorial-section--amber",
        tone === "primary" && "editorial-section--primary",
        tone === "muted" && "editorial-section--muted",
        className,
      )}
    >
      {section.title ? (
        <h2 className="editorial-section__title font-heading text-h3 tracking-tight text-inherit">
          {section.title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function BenefitsGrid({ section, fallback }: EditorialSectionProps) {
  if (!section.listItems.length) return <>{fallback}</>;
  return (
    <SectionShell section={section} tone="primary">
      <ul className="mt-6 grid list-none gap-3 sm:grid-cols-2">
        {section.listItems.map((item) => {
          const label = formatEditorialListItem(item);
          if (!label) return null;
          return (
            <li
              key={item}
              className="cw-card flex gap-3 rounded-[var(--radius-2xl)] border-primary/15 bg-primary/[0.04] p-4 text-sm leading-relaxed text-foreground/90"
            >
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

export function WarningCards({ section, fallback }: EditorialSectionProps) {
  if (!section.listItems.length) return <>{fallback}</>;
  return (
    <SectionShell section={section} tone="amber">
      <ul className="mt-6 list-none space-y-3">
        {section.listItems.map((item) => {
          const label = formatEditorialListItem(item);
          if (!label) return null;
          return (
            <li
              key={item}
              className="flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-950"
            >
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-700"
                aria-hidden
              />
              <span>
                <span className="font-semibold text-amber-800">Note · </span>
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

export function RecoveryTimeline({ section, fallback }: EditorialSectionProps) {
  if (!section.listItems.length) return <>{fallback}</>;
  return (
    <SectionShell section={section}>
      <ol className="mt-6 list-none space-y-5 border-l border-border pl-6">
        {section.listItems.map((item, i) => {
          const label = formatEditorialListItem(item);
          if (!label) return null;
          return (
            <li key={item} className="relative">
              <span className="absolute -left-[1.7rem] flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">{label}</p>
            </li>
          );
        })}
      </ol>
    </SectionShell>
  );
}

export function ProcedureStepper(props: EditorialSectionProps) {
  return <RecoveryTimeline {...props} />;
}

export function KeyTakeawaysPanel({ section, fallback }: EditorialSectionProps) {
  if (!section.listItems.length) return <>{fallback}</>;
  return (
    <SectionShell section={section} className="rounded-2xl border border-border bg-surface/80 p-6 shadow-sm">
      <ul className="mt-4 list-none space-y-2.5">
        {section.listItems.map((item) => {
          const label = formatEditorialListItem(item);
          if (!label) return null;
          return (
            <li key={item} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

export function SummaryPanel({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell
      section={section}
      className="rounded-2xl bg-gradient-to-br from-surface to-muted/40 p-6 ring-1 ring-border"
    >
      <div className="editorial-prose mt-3 text-sm leading-relaxed text-foreground/85">
        {fallback}
      </div>
    </SectionShell>
  );
}

export function ResearchCards({ section, fallback }: EditorialSectionProps) {
  if (!section.listItems.length) {
    return (
      <SectionShell section={section} tone="muted">
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Research
          </p>
          <div className="mt-2 text-sm text-muted-foreground">{fallback}</div>
        </div>
      </SectionShell>
    );
  }
  return (
    <SectionShell section={section}>
      <ul className="mt-6 list-none space-y-3">
        {section.listItems.map((item) => {
          const label = formatEditorialListItem(item);
          if (!label) return null;
          return (
            <li
              key={item}
              className="flex gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Evidence
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {label}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

export function StatisticsGrid({ section, fallback }: EditorialSectionProps) {
  if (!section.listItems.length) return <>{fallback}</>;
  return (
    <SectionShell section={section}>
      <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.listItems.map((item) => {
          const label = formatEditorialListItem(item);
          if (!label) return null;
          return (
            <li
              key={item}
              className="rounded-2xl border border-border bg-surface p-5 text-center"
            >
              <p className="font-heading text-lg font-semibold text-primary">{label}</p>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

export function ComparisonTableSection({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section}>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border p-5 sm:p-6">
        {fallback}
      </div>
    </SectionShell>
  );
}

export function PricingComparison({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section} tone="primary">
      <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6">
        {fallback}
        <p className="mt-4 text-xs text-muted-foreground">
          Pricing varies by clinical assessment. Book a consultation for a personalised plan.
        </p>
      </div>
    </SectionShell>
  );
}

export function DoctorAdviceCard({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section}>
      <aside className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-semibold text-primary">
          DB
        </div>
        <div className="min-w-0 flex-1">
          {section.title ? null : (
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Clinical guidance
            </p>
          )}
          <div className="text-sm leading-relaxed text-foreground/85">{fallback}</div>
        </div>
      </aside>
    </SectionShell>
  );
}

export function MedicalWarningCard({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section} tone="amber">
      <aside
        className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 text-amber-950"
        role="note"
      >
        <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide">
          Important
        </p>
        <div className="text-sm leading-relaxed">{fallback}</div>
        {section.listItems.length > 0 ? (
          <ul className="mt-3 list-none space-y-2">
            {section.listItems.map((item) => {
              const label = formatEditorialListItem(item);
              if (!label) return null;
              return (
                <li key={item} className="flex gap-3 text-sm">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-700"
                    aria-hidden
                  />
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </aside>
    </SectionShell>
  );
}

export function MedicalFactCard({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section} tone="primary">
      <aside className="mt-4 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
        <p className="mb-2 font-heading text-sm font-semibold text-primary">
          Good to know
        </p>
        <div className="text-sm leading-relaxed text-foreground/90">{fallback}</div>
      </aside>
    </SectionShell>
  );
}

export function PremiumAccordion({ section }: EditorialSectionProps) {
  const faqs: ArticleFaqItem[] = section.faqs;
  if (!faqs.length) return null;

  return (
    <SectionShell section={{ ...section, title: section.title ?? "FAQs" }}>
      <FaqAccordionClient faqs={faqs} />
    </SectionShell>
  );
}

function FaqAccordionClient({ faqs }: { faqs: ArticleFaqItem[] }) {
  const [query, setQuery] = useState("");
  const [expandVersion, setExpandVersion] = useState(0);
  const [expandDefault, setExpandDefault] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answerHtml.replace(/<[^>]+>/g, " ").toLowerCase().includes(q),
    );
  }, [faqs, query]);

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search FAQs</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="cw-interactive h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className="cw-interactive h-11 rounded-xl border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => {
              setExpandDefault(true);
              setExpandVersion((v) => v + 1);
            }}
          >
            Expand all
          </button>
          <button
            type="button"
            className="cw-interactive h-11 rounded-xl border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => {
              setExpandDefault(false);
              setExpandVersion((v) => v + 1);
            }}
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-[var(--radius-3xl)] border border-border bg-surface shadow-sm">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No questions match “{query}”.
          </p>
        ) : (
          filtered.map((faq) => (
            <details
              key={`${faq.id}-${expandVersion}`}
              open={expandDefault || undefined}
              className="group px-5 py-4 transition-[background-color] duration-[var(--motion-duration-fast)] open:bg-surface-editorial/50"
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) {
                  emitEditorialEvent({
                    type: "faq_expanded",
                    faqId: faq.id,
                    question: faq.question,
                  });
                }
              }}
            >
              <summary className="cw-interactive cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span className="pr-2 text-[0.9375rem] leading-snug">
                    {formatEditorialListItem(faq.question) || faq.question}
                  </span>
                  <span
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition duration-[var(--motion-duration-normal)] group-open:rotate-45 group-open:border-primary/40 group-open:text-primary motion-reduce:transition-none"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <div
                className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: stripEmojiFromHtml(faq.answerHtml),
                }}
              />
            </details>
          ))
        )}
      </div>
    </div>
  );
}

export function CitationList({ section, fallback }: EditorialSectionProps) {
  if (!section.listItems.length) return <>{fallback}</>;
  return (
    <SectionShell section={section} tone="muted">
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        {section.listItems.map((item) => {
          const label = formatEditorialListItem(item);
          if (!label) return null;
          return <li key={item}>{label}</li>;
        })}
      </ol>
    </SectionShell>
  );
}

export function TimelineComponent(props: EditorialSectionProps) {
  return <RecoveryTimeline {...props} />;
}

export function VideoFeature({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section}>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted/30">
        {fallback}
      </div>
    </SectionShell>
  );
}

export function EditorialGallery({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section}>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{fallback}</div>
    </SectionShell>
  );
}

export function BeforeAfterSlider({ section, fallback }: EditorialSectionProps) {
  return (
    <SectionShell section={section}>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">{fallback}</div>
    </SectionShell>
  );
}

export function GenericEditorialSection({
  section,
  fallback,
}: EditorialSectionProps) {
  return (
    <SectionShell section={section}>
      <div className="editorial-prose mt-4">{fallback}</div>
    </SectionShell>
  );
}

export const QuoteSection = memo(function QuoteSection({
  section,
  fallback,
}: EditorialSectionProps) {
  return (
    <SectionShell section={section}>
      <blockquote className="relative my-4 border-l-[3px] border-primary py-2 pl-6 font-heading text-xl leading-relaxed italic text-foreground">
        <span className="absolute -left-1 -top-2 font-serif text-5xl text-primary/25" aria-hidden>
          “
        </span>
        {fallback}
      </blockquote>
    </SectionShell>
  );
});

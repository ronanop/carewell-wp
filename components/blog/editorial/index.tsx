"use client";

import { memo, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  formatEditorialListItem,
  stripEmojiFromHtml,
} from "@/lib/content/editorialText";
import type { ArticleFaqItem } from "@/types/article-ast";

export function QuoteBlock({
  children,
  author,
  source,
  accent = "primary",
  className,
}: {
  children: ReactNode;
  author?: string;
  source?: string;
  accent?: "primary" | "muted";
  className?: string;
}) {
  return (
    <blockquote
      className={cn(
        "my-8 border-l-[3px] py-1 pl-6 font-heading text-xl leading-relaxed text-foreground",
        accent === "primary" ? "border-primary" : "border-muted-foreground/40",
        className,
      )}
    >
      <div className="italic">{children}</div>
      {(author || source) && (
        <footer className="mt-3 font-sans text-sm not-italic text-muted-foreground">
          {author ? <cite className="font-medium not-italic text-foreground">{author}</cite> : null}
          {author && source ? " — " : null}
          {source}
        </footer>
      )}
    </blockquote>
  );
}

export function WarningBox({
  children,
  title = "Important",
  className,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "my-6 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 text-amber-950",
        className,
      )}
      role="note"
    >
      <p className="mb-2 font-heading text-sm font-semibold tracking-wide uppercase">
        {title}
      </p>
      <div className="text-sm leading-relaxed [&_p]:m-0">{children}</div>
    </aside>
  );
}

export function FactBox({
  children,
  title = "Good to know",
  className,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "my-6 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5",
        className,
      )}
    >
      <p className="mb-2 font-heading text-sm font-semibold text-primary">{title}</p>
      <div className="text-sm leading-relaxed text-foreground/90 [&_p]:m-0">
        {children}
      </div>
    </aside>
  );
}

export function KeyTakeaways({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <section
      className={cn(
        "my-10 rounded-2xl border border-border bg-surface/80 p-6 shadow-sm",
        className,
      )}
      aria-label="Key takeaways"
    >
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Key takeaways
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-foreground/90"
          >
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MedicalDisclaimer({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "my-8 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children ?? (
        <p>
          This article is for educational purposes and does not replace a personalised
          medical consultation. Always seek advice from a qualified clinician.
        </p>
      )}
    </aside>
  );
}

export function SummaryCard({
  title = "Summary",
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "my-8 rounded-2xl bg-gradient-to-br from-surface to-muted/50 p-6 ring-1 ring-border",
        className,
      )}
    >
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

export const ArticleFaqAccordion = memo(function ArticleFaqAccordion({
  faqs,
  className,
}: {
  faqs: ArticleFaqItem[];
  className?: string;
}) {
  if (!faqs.length) return null;

  return (
    <section className={cn("space-y-3", className)} aria-label="Frequently asked questions">
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        FAQs
      </h2>
      <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {faqs.map((faq) => (
          <details key={faq.id} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                <span>{formatEditorialListItem(faq.question) || faq.question}</span>
                <span className="mt-0.5 text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div
              className="mt-3 text-sm leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: stripEmojiFromHtml(faq.answerHtml),
              }}
            />
          </details>
        ))}
      </div>
    </section>
  );
});

export function Checklist({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("my-6 list-none space-y-2", className)}>
      {items.map((item) => {
        const label = formatEditorialListItem(item);
        if (!label) return null;
        return (
          <li key={item} className="flex gap-3 text-sm">
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function ProsCons({
  pros,
  cons,
  className,
}: {
  pros: string[];
  cons: string[];
  className?: string;
}) {
  return (
    <div className={cn("my-8 grid gap-4 sm:grid-cols-2", className)}>
      <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-5">
        <p className="mb-3 font-heading text-sm font-semibold text-emerald-800">Pros</p>
        <ul className="list-none space-y-2 text-sm text-emerald-950/80">
          {pros.map((p) => {
            const label = formatEditorialListItem(p);
            if (!label) return null;
            return (
              <li key={p} className="flex gap-3">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-700"
                  aria-hidden
                />
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-2xl border border-rose-200/60 bg-rose-50/50 p-5">
        <p className="mb-3 font-heading text-sm font-semibold text-rose-800">Cons</p>
        <ul className="list-none space-y-2 text-sm text-rose-950/80">
          {cons.map((c) => {
            const label = formatEditorialListItem(c);
            if (!label) return null;
            return (
              <li key={c} className="flex gap-3">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-rose-700"
                  aria-hidden
                />
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function ResearchCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "my-6 rounded-2xl border border-border bg-surface p-5 shadow-sm",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Research
      </p>
      <h3 className="mt-1 font-heading text-base font-semibold">{title}</h3>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </article>
  );
}

export function ComparisonTable({
  headers,
  rows,
  className,
}: {
  headers: string[];
  rows: string[][];
  className?: string;
}) {
  return (
    <div className={cn("my-8 overflow-x-auto rounded-2xl border border-border p-5 sm:p-6", className)}>
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(i % 2 === 0 ? "bg-surface" : "bg-muted/30")}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-foreground/85">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Timeline({
  steps,
  className,
}: {
  steps: Array<{ title: string; description?: string }>;
  className?: string;
}) {
  return (
    <ol className={cn("my-8 space-y-6 border-l border-border pl-6", className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span className="absolute -left-[1.7rem] flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {i + 1}
          </span>
          <p className="font-heading font-semibold">{step.title}</p>
          {step.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function DoctorRecommendation({
  name,
  title,
  experience,
  href = "/about/dr-sandeep-bhasin/",
  className,
}: {
  name: string;
  title?: string;
  experience?: string;
  href?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "my-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xl font-semibold text-primary">
        {name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-lg font-semibold">{name}</p>
        {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
        {experience ? (
          <p className="mt-1 text-sm text-foreground/80">{experience}</p>
        ) : null}
      </div>
      <a
        href={href}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        View profile
      </a>
    </aside>
  );
}

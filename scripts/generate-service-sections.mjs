/**
 * Generates all 35 service section React components.
 * Run: node scripts/generate-service-sections.mjs
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("components/service/sections");
fs.mkdirSync(dir, { recursive: true });

function w(file, content) {
  fs.writeFileSync(path.join(dir, file), content.trimStart() + "\n", "utf8");
  console.log("wrote", file);
}

w(
  "image.ts",
  `import { urlFor } from "@/lib/sanity/client";
import type { SanityImage } from "./types";

export function sectionImageUrl(image?: SanityImage, width = 1200) {
  if (!image?.asset) return null;
  try {
    return urlFor(image).width(width).url();
  } catch {
    return image.asset.url || null;
  }
}
`,
);

w(
  "QuickFactsCard.tsx",
  `import { cn } from "@/lib/utils";
import type { QuickFact, SectionBaseProps } from "./types";

export type QuickFactsCardProps = SectionBaseProps & {
  facts?: QuickFact[];
  title?: string;
  embedded?: boolean;
};

export function QuickFactsCard({
  id,
  facts = [],
  title = "Quick facts",
  embedded = false,
  className,
}: QuickFactsCardProps) {
  if (!facts.length) return null;
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl p-4",
        embedded
          ? "bg-white/10 text-white backdrop-blur"
          : "border border-slate-200 bg-white text-slate-900",
        className,
      )}
    >
      <p
        className={cn(
          "mb-3 text-sm font-semibold uppercase tracking-wide",
          embedded ? "text-white/80" : "text-[#1557A0]",
        )}
      >
        {title}
      </p>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {facts.map((fact, i) => (
          <div key={\`\${fact.label}-\${i}\`}>
            <dt className={embedded ? "text-white/60" : "text-slate-500"}>
              {fact.label}
            </dt>
            <dd className="font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
`,
);

w(
  "HeroBanner.tsx",
  `import Image from "next/image";
import { QuickFactsCard } from "./QuickFactsCard";
import { SectionShell } from "./SectionShell";
import { sectionImageUrl } from "./image";
import type { QuickFact, SanityImage, SectionBaseProps } from "./types";

export type HeroBannerProps = SectionBaseProps & {
  heading: string;
  tagline?: string;
  category?: string;
  uri?: string;
  image?: SanityImage;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
  quickFacts?: QuickFact[];
};

export function HeroBanner({
  id = "hero",
  heading,
  tagline,
  category,
  uri,
  image,
  primaryCtaLabel = "Book Free Consultation",
  secondaryCtaLabel = "WhatsApp",
  primaryCtaHref = "#book",
  secondaryCtaHref = "https://wa.me/919810153580",
  quickFacts,
}: HeroBannerProps) {
  const src = sectionImageUrl(image, 1400);
  return (
    <SectionShell id={id} tone="dark" className="!py-0">
      <div className="grid gap-8 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          {category || uri ? (
            <p className="mb-2 text-sm text-white/70">
              {category ? category.replace(/-/g, " ") : "Service"}
              {uri ? \` · \${uri}\` : ""}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {heading}
          </h1>
          {tagline ? (
            <p className="mt-4 text-lg text-white/85">{tagline}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={primaryCtaHref}
              className="rounded-md bg-[#1557A0] px-5 py-2.5 text-sm font-semibold text-white"
            >
              {primaryCtaLabel}
            </a>
            <a
              href={secondaryCtaHref}
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold"
            >
              {secondaryCtaLabel}
            </a>
          </div>
        </div>
        <div className="space-y-4">
          {src ? (
            <Image
              src={src}
              alt={image?.alt || heading}
              width={900}
              height={600}
              className="h-auto w-full rounded-xl object-cover"
              priority
            />
          ) : null}
          {quickFacts?.length ? (
            <QuickFactsCard facts={quickFacts} embedded />
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "BookingFormSection.tsx",
  `"use client";

import type { SectionBaseProps } from "./types";

export type BookingFormSectionProps = SectionBaseProps & {
  title?: string;
  treatmentLabel?: string;
  submitLabel?: string;
  trustLine?: string;
  sticky?: boolean;
};

/** 3-field lead form shell — connect Lead Engine in Phase 5. */
export function BookingFormSection({
  id = "book",
  title = "Book free consultation",
  treatmentLabel = "Treatment",
  submitLabel = "Claim My Free Slot",
  trustLine = "100% Private · Response within 2 hours · No spam",
  sticky = false,
  className,
}: BookingFormSectionProps) {
  return (
    <div id={id} className={className}>
      <div className={sticky ? "lg:sticky lg:top-6" : undefined}>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{title}</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              name="name"
              placeholder="Name"
              required
            />
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              name="mobile"
              placeholder="Mobile"
              required
            />
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              name="treatment"
              defaultValue={treatmentLabel}
              readOnly
            />
            <button
              type="submit"
              className="w-full rounded-md bg-[#1557A0] py-2.5 text-sm font-semibold text-white"
            >
              {submitLabel}
            </button>
          </form>
          <p className="mt-3 text-center text-xs text-slate-500">{trustLine}</p>
        </div>
      </div>
    </div>
  );
}
`,
);

w(
  "OverviewSection.tsx",
  `import Image from "next/image";
import { SanityPortableText } from "@/components/sanity/SanityPortableText";
import { InsightCallout } from "./InsightCallout";
import { SectionShell } from "./SectionShell";
import { sectionImageUrl } from "./image";
import type { SanityImage, SectionBaseProps } from "./types";

export type OverviewSectionProps = SectionBaseProps & {
  title?: string;
  body?: unknown[];
  illustration?: SanityImage;
  insights?: string[];
};

export function OverviewSection({
  id = "overview",
  title = "What is this treatment?",
  body,
  illustration,
  insights,
  className,
}: OverviewSectionProps) {
  if (!body?.length && !insights?.length) return null;
  const src = sectionImageUrl(illustration, 800);
  return (
    <SectionShell id={id} eyebrow="Overview" title={title} className={className}>
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <SanityPortableText value={body} />
          <InsightCallout items={insights} />
        </div>
        {src ? (
          <Image
            src={src}
            alt={illustration?.alt || title}
            width={560}
            height={420}
            className="h-auto w-full rounded-xl object-cover"
          />
        ) : null}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "InsightCallout.tsx",
  `import type { SectionBaseProps } from "./types";

export type InsightCalloutProps = SectionBaseProps & {
  items?: string[];
  title?: string;
};

export function InsightCallout({
  id,
  items = [],
  title = "Key insights",
  className,
}: InsightCalloutProps) {
  if (!items.length) return null;
  return (
    <aside
      id={id}
      className={\`mt-6 rounded-lg border border-teal-200 bg-teal-50/70 p-4 \${className ?? ""}\`}
    >
      <p className="mb-2 text-sm font-semibold text-teal-900">{title}</p>
      <ul className="space-y-2 text-sm text-teal-950">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </aside>
  );
}
`,
);

w(
  "HowItWorksSection.tsx",
  `import { YoutubeEmbedSection } from "./YoutubeEmbedSection";
import { SectionShell } from "./SectionShell";
import type { ProcessStep, SectionBaseProps } from "./types";

export type HowItWorksSectionProps = SectionBaseProps & {
  title?: string;
  steps?: ProcessStep[];
  youtubeId?: string;
};

export function HowItWorksSection({
  id = "how-it-works",
  title = "How it works",
  steps = [],
  youtubeId,
  className,
}: HowItWorksSectionProps) {
  if (!steps.length && !youtubeId) return null;
  return (
    <SectionShell id={id} eyebrow="Process" title={title} tone="muted" className={className}>
      {steps.length ? (
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {steps.map((step, i) => (
            <li
              key={\`\${step.title}-\${i}\`}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <p className="text-xs font-semibold text-[#1557A0]">Step {i + 1}</p>
              <p className="mt-1 font-medium">{step.title}</p>
              {step.description ? (
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
      {youtubeId ? (
        <div className="mt-8">
          <YoutubeEmbedSection youtubeId={youtubeId} title="Procedure overview" />
        </div>
      ) : null}
    </SectionShell>
  );
}
`,
);

w(
  "YoutubeEmbedSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { SectionBaseProps } from "./types";

export type YoutubeEmbedSectionProps = SectionBaseProps & {
  youtubeId?: string;
  url?: string;
  title?: string;
  bare?: boolean;
};

function idFromUrl(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v") || u.pathname.split("/").pop() || null;
  } catch {
    return null;
  }
}

export function YoutubeEmbedSection({
  id,
  youtubeId,
  url,
  title = "Watch",
  bare = false,
  className,
}: YoutubeEmbedSectionProps) {
  const vid = youtubeId || idFromUrl(url);
  if (!vid) return null;
  const frame = (
    <div className="aspect-video overflow-hidden rounded-lg bg-black">
      <iframe
        className="h-full w-full"
        src={\`https://www.youtube.com/embed/\${vid}\`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
  if (bare) return <div className={className}>{frame}</div>;
  return (
    <SectionShell id={id} eyebrow="Video" title={title} className={className}>
      {frame}
    </SectionShell>
  );
}
`,
);

w(
  "BeforeAfterSection.tsx",
  `import Image from "next/image";
import { SectionShell } from "./SectionShell";
import { sectionImageUrl } from "./image";
import type { BeforeAfterPair, SectionBaseProps } from "./types";

export type BeforeAfterSectionProps = SectionBaseProps & {
  title?: string;
  pairs?: BeforeAfterPair[];
  consentNotice?: string;
};

export function BeforeAfterSection({
  id = "before-after",
  title = "Before & after",
  pairs = [],
  consentNotice,
  className,
}: BeforeAfterSectionProps) {
  if (!pairs.length) return null;
  return (
    <SectionShell id={id} eyebrow="Results" title={title} className={className}>
      <div className="grid gap-6 sm:grid-cols-2">
        {pairs.map((pair, i) => {
          const before = sectionImageUrl(pair.before, 600);
          const after = sectionImageUrl(pair.after, 600);
          return (
            <article
              key={i}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="grid grid-cols-2 gap-px bg-slate-200">
                {before ? (
                  <Image
                    src={before}
                    alt={pair.before?.alt || "Before"}
                    width={400}
                    height={300}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-400">
                    Before
                  </div>
                )}
                {after ? (
                  <Image
                    src={after}
                    alt={pair.after?.alt || "After"}
                    width={400}
                    height={300}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-400">
                    After
                  </div>
                )}
              </div>
              <p className="p-3 text-sm text-slate-600">
                {pair.patientInitials || "Patient"}
                {pair.monthsPost != null ? \` · \${pair.monthsPost} months post\` : ""}
                {pair.subtype ? \` · \${pair.subtype}\` : ""}
              </p>
            </article>
          );
        })}
      </div>
      {consentNotice ? (
        <p className="mt-3 text-xs text-slate-500">{consentNotice}</p>
      ) : null}
    </SectionShell>
  );
}
`,
);

w(
  "CandidateSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { SectionBaseProps } from "./types";

export type CandidateSectionProps = SectionBaseProps & {
  title?: string;
  goodFit?: string[];
  notIdeal?: string[];
  quizCtaLabel?: string;
  quizCtaHref?: string;
};

export function CandidateSection({
  id = "candidacy",
  title = "Am I a candidate?",
  goodFit = [],
  notIdeal = [],
  quizCtaLabel,
  quizCtaHref = "#quiz",
  className,
}: CandidateSectionProps) {
  if (!goodFit.length && !notIdeal.length) return null;
  return (
    <SectionShell id={id} eyebrow="Eligibility" title={title} tone="muted" className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="mb-2 font-semibold text-emerald-900">Good fit</p>
          <ul className="space-y-1 text-sm text-emerald-950">
            {goodFit.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="mb-2 font-semibold text-orange-900">Not ideal</p>
          <ul className="space-y-1 text-sm text-orange-950">
            {notIdeal.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      {quizCtaLabel ? (
        <a
          href={quizCtaHref}
          className="mt-6 inline-block rounded-md bg-[#1557A0] px-4 py-2 text-sm font-semibold text-white"
        >
          {quizCtaLabel}
        </a>
      ) : null}
    </SectionShell>
  );
}
`,
);

w(
  "PricingSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { SectionBaseProps } from "./types";

export type PricingSectionProps = SectionBaseProps & {
  title?: string;
  startingFrom?: string;
  factors?: string[];
  emiNote?: string;
  whatsIncluded?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function PricingSection({
  id = "pricing",
  title = "Pricing",
  startingFrom,
  factors = [],
  emiNote,
  whatsIncluded = [],
  ctaLabel = "Get Personalized Quote",
  ctaHref = "#book",
  className,
}: PricingSectionProps) {
  if (!startingFrom && !factors.length && !whatsIncluded.length) return null;
  return (
    <SectionShell id={id} eyebrow="Investment" title={title} className={className}>
      {startingFrom ? (
        <p className="text-xl font-semibold text-[#1557A0]">
          Starting from {startingFrom}
        </p>
      ) : null}
      {factors.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {factors.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}
      {whatsIncluded.length ? (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">What&apos;s included</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {whatsIncluded.map((item) => (
              <li
                key={item}
                className="rounded-md border border-slate-200 bg-[#F6F7F9] px-3 py-2 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {emiNote ? <p className="mt-3 text-sm text-slate-600">{emiNote}</p> : null}
      <a
        href={ctaHref}
        className="mt-5 inline-block rounded-md bg-[#0B7B6B] px-4 py-2 text-sm font-semibold text-white"
      >
        {ctaLabel}
      </a>
    </SectionShell>
  );
}
`,
);

console.log("wave1 core written, continuing…");

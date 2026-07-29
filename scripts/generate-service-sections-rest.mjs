import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("components/service/sections");
fs.mkdirSync(dir, { recursive: true });

function w(file, content) {
  fs.writeFileSync(path.join(dir, file), `${content.trimStart()}\n`, "utf8");
  console.log("wrote", file);
}

function listComp(name, defaultTitle, eyebrow) {
  return `import { SectionShell } from "./SectionShell";
import type { SectionBaseProps } from "./types";

export type ${name}Props = SectionBaseProps & {
  title?: string;
  items?: string[];
  intro?: string;
};

export function ${name}({
  id,
  title = "${defaultTitle}",
  items = [],
  intro,
  className,
}: ${name}Props) {
  if (!items.length && !intro) return null;
  return (
    <SectionShell id={id} eyebrow="${eyebrow}" title={title} className={className}>
      {intro ? <p className="mb-4 max-w-3xl text-slate-600">{intro}</p> : null}
      {items.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  );
}
`;
}

for (const [n, t, e] of [
  ["SymptomsSection", "Common symptoms", "Symptoms"],
  ["CausesSection", "Causes & risk factors", "Causes"],
  ["DiagnosisSection", "How we evaluate", "Diagnosis"],
  ["BenefitsSection", "Benefits", "Benefits"],
  ["PreparationSection", "How to prepare", "Preparation"],
  ["RecoverySection", "Recovery & aftercare", "Recovery"],
  ["RisksSection", "Risks & side effects", "Safety"],
  ["ResultsExpectationsSection", "Results & expectations", "Outcomes"],
  ["WhyChooseUsSection", "Why choose Care Well", "Trust"],
  ["WhenDoctorsRecommendSection", "When doctors recommend this", "Clinical"],
  ["MedicalEvidenceSection", "Medical evidence", "Research"],
  ["MistakesToAvoidSection", "Mistakes to avoid", "Guidance"],
  ["UntreatedRisksSection", "What if left untreated", "Awareness"],
]) {
  w(`${n}.tsx`, listComp(n, t, e));
}

w(
  "EmiCalculatorSection.tsx",
  `"use client";

import { useMemo, useState } from "react";
import { SectionShell } from "./SectionShell";
import type { SectionBaseProps } from "./types";

export type EmiCalculatorSectionProps = SectionBaseProps & {
  title?: string;
  defaultAmount?: number;
  defaultMonths?: number;
  annualRatePct?: number;
};

export function EmiCalculatorSection({
  id = "emi",
  title = "EMI calculator",
  defaultAmount = 80000,
  defaultMonths = 12,
  annualRatePct = 12,
  className,
}: EmiCalculatorSectionProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [months, setMonths] = useState(defaultMonths);
  const emi = useMemo(() => {
    const r = annualRatePct / 12 / 100;
    if (r === 0) return amount / months;
    const pow = Math.pow(1 + r, months);
    return (amount * r * pow) / (pow - 1);
  }, [amount, months, annualRatePct]);

  return (
    <SectionShell id={id} eyebrow="Financing" title={title} tone="muted" className={className}>
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-sm">
          Amount (₹)
          <input
            type="range"
            min={20000}
            max={300000}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <span className="font-semibold">₹{amount.toLocaleString("en-IN")}</span>
        </label>
        <label className="mt-4 block text-sm">
          Tenure (months)
          <input
            type="range"
            min={3}
            max={24}
            step={1}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <span className="font-semibold">{months} months</span>
        </label>
        <p className="mt-5 text-lg font-semibold text-[#1557A0]">
          ≈ ₹{Math.round(emi).toLocaleString("en-IN")} / month
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Indicative only at {annualRatePct}% p.a. Confirm with clinic partners.
        </p>
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "FaqAccordionSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { FaqItem, SectionBaseProps } from "./types";

export type FaqAccordionSectionProps = SectionBaseProps & {
  title?: string;
  faqs?: FaqItem[];
  emitJsonLd?: boolean;
};

export function FaqAccordionSection({
  id = "faq",
  title = "FAQs",
  faqs = [],
  emitJsonLd = true,
  className,
}: FaqAccordionSectionProps) {
  if (!faqs.length) return null;
  const jsonLd = emitJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <SectionShell id={id} eyebrow="Questions" title={title} className={className}>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={\`\${faq.question}-\${i}\`}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <summary className="cursor-pointer font-medium">{faq.question}</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "RelatedServicesSection.tsx",
  `import Link from "next/link";
import { SectionShell } from "./SectionShell";
import type { RelatedService, SectionBaseProps } from "./types";

export type RelatedServicesSectionProps = SectionBaseProps & {
  title?: string;
  services?: RelatedService[];
  basePath?: string;
};

export function RelatedServicesSection({
  id = "related",
  title = "Related services",
  services = [],
  basePath = "",
  className,
}: RelatedServicesSectionProps) {
  if (!services.length) return null;
  return (
    <SectionShell id={id} eyebrow="Explore" title={title} tone="muted" className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((rel) => (
          <Link
            key={rel._id}
            href={\`\${basePath}/\${rel.slug}\`}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-[#1557A0]"
          >
            <p className="font-medium">{rel.title}</p>
            {rel.excerpt ? (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{rel.excerpt}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "FinalCtaStrip.tsx",
  `import { SectionShell } from "./SectionShell";
import type { SectionBaseProps } from "./types";

export type FinalCtaStripProps = SectionBaseProps & {
  headline?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
};

export function FinalCtaStrip({
  id = "final-cta",
  headline = "Ready to take the next step?",
  primaryLabel = "Book Free Consultation",
  secondaryLabel = "Call Now",
  primaryHref = "#book",
  secondaryHref = "tel:+919810153580",
  className,
}: FinalCtaStripProps) {
  return (
    <SectionShell id={id} tone="brand" className={className}>
      <div className="text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">{headline}</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={primaryHref}
            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#0B7B6B]"
          >
            {primaryLabel}
          </a>
          <a
            href={secondaryHref}
            className="rounded-md border border-white/50 px-5 py-2.5 text-sm font-semibold"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "DoctorProfileSection.tsx",
  `import Image from "next/image";
import { SectionShell } from "./SectionShell";
import { sectionImageUrl } from "./image";
import type { DoctorProfile, SectionBaseProps } from "./types";

export type DoctorProfileSectionProps = SectionBaseProps & {
  title?: string;
  doctor?: DoctorProfile;
};

export function DoctorProfileSection({
  id = "doctor",
  title = "Meet your surgeon",
  doctor,
  className,
}: DoctorProfileSectionProps) {
  if (!doctor?.name && !doctor?.bio?.length) return null;
  const src = sectionImageUrl(doctor?.photo, 480);
  return (
    <SectionShell id={id} eyebrow="Surgeon" title={title} className={className}>
      <div className="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-[160px_1fr]">
        {src ? (
          <Image
            src={src}
            alt={doctor?.photo?.alt || doctor?.name || "Doctor"}
            width={160}
            height={160}
            className="h-40 w-40 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-400">
            Photo
          </div>
        )}
        <div>
          <p className="text-xl font-semibold">{doctor?.name}</p>
          {doctor?.role ? <p className="text-sm text-[#1557A0]">{doctor.role}</p> : null}
          {doctor?.credentials?.length ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {doctor.credentials.map((c) => (
                <li key={c} className="rounded-full bg-[#F6F7F9] px-3 py-1 text-xs">
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
          {doctor?.bio?.map((p) => (
            <p key={p} className="mt-3 text-sm text-slate-600">
              {p}
            </p>
          ))}
          {doctor?.ctaLabel ? (
            <a
              href={doctor.ctaHref || "#book"}
              className="mt-4 inline-block rounded-md bg-[#1557A0] px-4 py-2 text-sm font-semibold text-white"
            >
              {doctor.ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "TestimonialsSection.tsx",
  `import Image from "next/image";
import { YoutubeEmbedSection } from "./YoutubeEmbedSection";
import { SectionShell } from "./SectionShell";
import { sectionImageUrl } from "./image";
import type { SectionBaseProps, TestimonialItem } from "./types";

export type TestimonialsSectionProps = SectionBaseProps & {
  title?: string;
  items?: TestimonialItem[];
};

export function TestimonialsSection({
  id = "testimonials",
  title = "Patient stories",
  items = [],
  className,
}: TestimonialsSectionProps) {
  if (!items.length) return null;
  return (
    <SectionShell id={id} eyebrow="Social proof" title={title} tone="muted" className={className}>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, i) => {
          const src = sectionImageUrl(item.photo, 120);
          return (
            <article
              key={\`\${item.patientName}-\${i}\`}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              {item.youtubeId ? (
                <YoutubeEmbedSection youtubeId={item.youtubeId} bare title="Testimonial" />
              ) : null}
              {item.quote ? (
                <p className="text-sm leading-relaxed text-slate-700">“{item.quote}”</p>
              ) : null}
              <div className="mt-4 flex items-center gap-3">
                {src ? (
                  <Image
                    src={src}
                    alt={item.photo?.alt || item.patientName || "Patient"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-semibold">{item.patientName}</p>
                  {item.treatment ? (
                    <p className="text-xs text-slate-500">{item.treatment}</p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "MythVsFactSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { MythFactPair, SectionBaseProps } from "./types";

export type MythVsFactSectionProps = SectionBaseProps & {
  title?: string;
  pairs?: MythFactPair[];
};

export function MythVsFactSection({
  id = "myths",
  title = "Myth vs fact",
  pairs = [],
  className,
}: MythVsFactSectionProps) {
  if (!pairs.length) return null;
  return (
    <SectionShell id={id} eyebrow="Clarity" title={title} className={className}>
      <div className="space-y-3">
        {pairs.map((pair, i) => (
          <div
            key={i}
            className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"
          >
            <div>
              <p className="text-xs font-semibold uppercase text-orange-700">Myth</p>
              <p className="mt-1 text-sm">{pair.myth}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-700">Fact</p>
              <p className="mt-1 text-sm">{pair.fact}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "ComparisonSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { ComparisonColumn, SectionBaseProps } from "./types";

export type ComparisonSectionProps = SectionBaseProps & {
  title?: string;
  columns?: ComparisonColumn[];
  tableHtml?: string;
};

export function ComparisonSection({
  id = "comparison",
  title = "Comparison",
  columns = [],
  tableHtml,
  className,
}: ComparisonSectionProps) {
  if (!columns.length && !tableHtml) return null;
  return (
    <SectionShell id={id} eyebrow="Compare" title={title} tone="muted" className={className}>
      {columns.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="font-semibold">{col.title}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {(col.items || []).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
      {tableHtml ? (
        <div
          className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white p-3 text-sm"
          dangerouslySetInnerHTML={{ __html: tableHtml }}
        />
      ) : null}
    </SectionShell>
  );
}
`,
);

w(
  "TechnologySection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { SectionBaseProps, TechniqueCard } from "./types";

export type TechnologySectionProps = SectionBaseProps & {
  title?: string;
  techniques?: TechniqueCard[];
};

export function TechnologySection({
  id = "technology",
  title = "Techniques & technology",
  techniques = [],
  className,
}: TechnologySectionProps) {
  if (!techniques.length) return null;
  return (
    <SectionShell id={id} eyebrow="Technology" title={title} className={className}>
      <div className="grid gap-4 md:grid-cols-2">
        {techniques.map((tech) => (
          <article
            key={tech.title}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h3 className="text-lg font-semibold">{tech.title}</h3>
            {tech.description ? (
              <p className="mt-2 text-sm text-slate-600">{tech.description}</p>
            ) : null}
            {tech.bullets?.length ? (
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                {tech.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "TreatmentOptionsSection.tsx",
  `import { TechnologySection } from "./TechnologySection";
import type { SectionBaseProps, TechniqueCard } from "./types";

export type TreatmentOptionsSectionProps = SectionBaseProps & {
  title?: string;
  options?: TechniqueCard[];
};

/** Alias of technique cards for treatment-type layouts. */
export function TreatmentOptionsSection({
  id = "options",
  title = "Treatment options",
  options = [],
  className,
}: TreatmentOptionsSectionProps) {
  return (
    <TechnologySection
      id={id}
      title={title}
      techniques={options}
      className={className}
    />
  );
}
`,
);

w(
  "CostSnapshotSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { CostCard, SectionBaseProps } from "./types";

export type CostSnapshotSectionProps = SectionBaseProps & {
  title?: string;
  cards?: CostCard[];
};

export function CostSnapshotSection({
  id = "cost-snapshot",
  title = "Cost at a glance",
  cards = [],
  className,
}: CostSnapshotSectionProps) {
  if (!cards.length) return null;
  return (
    <SectionShell id={id} eyebrow="Cost" title={title} tone="muted" className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 text-center"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-semibold text-[#1557A0]">{card.value}</p>
            {card.sublabel ? (
              <p className="mt-1 text-xs text-slate-500">{card.sublabel}</p>
            ) : null}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "LocationSection.tsx",
  `import { SectionShell } from "./SectionShell";
import type { SectionBaseProps } from "./types";

export type LocationSectionProps = SectionBaseProps & {
  title?: string;
  address?: string;
  hours?: string;
  phone?: string;
  mapHref?: string;
};

export function LocationSection({
  id = "location",
  title = "Visit the clinic",
  address,
  hours,
  phone,
  mapHref,
  className,
}: LocationSectionProps) {
  if (!address && !hours && !phone) return null;
  return (
    <SectionShell id={id} eyebrow="Location" title={title} className={className}>
      <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        {address ? <p>{address}</p> : null}
        {hours ? <p className="mt-2">Hours: {hours}</p> : null}
        {phone ? (
          <p className="mt-2">
            Call:{" "}
            <a className="font-medium text-[#1557A0]" href={\`tel:\${phone}\`}>
              {phone}
            </a>
          </p>
        ) : null}
        {mapHref ? (
          <a
            href={mapHref}
            className="mt-4 inline-block text-sm font-semibold text-[#0B7B6B] underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps
          </a>
        ) : null}
      </div>
    </SectionShell>
  );
}
`,
);

w(
  "ContactCard.tsx",
  `import type { SectionBaseProps } from "./types";

export type ContactCardProps = SectionBaseProps & {
  phone?: string;
  whatsapp?: string;
  hours?: string;
  address?: string;
};

/** Compact contact card for sidebars / mid-page embeds. */
export function ContactCard({
  id,
  phone = "+91 98101 53580",
  whatsapp = "919810153580",
  hours,
  address,
  className,
}: ContactCardProps) {
  return (
    <aside
      id={id}
      className={\`rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm \${className ?? ""}\`}
    >
      <p className="font-semibold text-slate-900">Talk to Care Well</p>
      {address ? <p className="mt-2 text-slate-600">{address}</p> : null}
      {hours ? <p className="mt-1 text-slate-600">{hours}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={\`tel:\${phone}\`}
          className="rounded-md bg-[#1557A0] px-3 py-2 text-xs font-semibold text-white"
        >
          Call
        </a>
        <a
          href={\`https://wa.me/\${whatsapp}\`}
          className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold"
        >
          WhatsApp
        </a>
      </div>
    </aside>
  );
}
`,
);

const indexExports = [
  "SectionShell",
  "HeroBanner",
  "QuickFactsCard",
  "BookingFormSection",
  "OverviewSection",
  "InsightCallout",
  "HowItWorksSection",
  "YoutubeEmbedSection",
  "BeforeAfterSection",
  "CandidateSection",
  "PricingSection",
  "EmiCalculatorSection",
  "FaqAccordionSection",
  "RelatedServicesSection",
  "FinalCtaStrip",
  "DoctorProfileSection",
  "TestimonialsSection",
  "SymptomsSection",
  "CausesSection",
  "DiagnosisSection",
  "BenefitsSection",
  "MythVsFactSection",
  "ComparisonSection",
  "TechnologySection",
  "TreatmentOptionsSection",
  "PreparationSection",
  "RecoverySection",
  "RisksSection",
  "ResultsExpectationsSection",
  "WhyChooseUsSection",
  "WhenDoctorsRecommendSection",
  "CostSnapshotSection",
  "LocationSection",
  "MedicalEvidenceSection",
  "MistakesToAvoidSection",
  "UntreatedRisksSection",
  "ContactCard",
];

const indexLines = [
  ...indexExports.map((n) => `export * from "./${n}";`),
  'export * from "./types";',
  'export * from "./image";',
  "",
].join("\n");

w("index.ts", indexLines);

console.log("Done. Components:", indexExports.length);

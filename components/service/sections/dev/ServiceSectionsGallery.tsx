import type { ReactNode } from "react";
import {
  BeforeAfterSection,
  BenefitsSection,
  BookingFormSection,
  CandidateSection,
  CausesSection,
  ComparisonSection,
  ContactCard,
  CostSnapshotSection,
  DiagnosisSection,
  DoctorProfileSection,
  EmiCalculatorSection,
  FaqAccordionSection,
  FinalCtaStrip,
  HeroBanner,
  HowItWorksSection,
  InsightCallout,
  LocationSection,
  MedicalEvidenceSection,
  MistakesToAvoidSection,
  MythVsFactSection,
  OverviewSection,
  PreparationSection,
  PricingSection,
  QuickFactsCard,
  RecoverySection,
  RelatedServicesSection,
  ResultsExpectationsSection,
  RisksSection,
  SymptomsSection,
  TechnologySection,
  TestimonialsSection,
  TreatmentOptionsSection,
  UntreatedRisksSection,
  WhenDoctorsRecommendSection,
  WhyChooseUsSection,
  YoutubeEmbedSection,
} from "@/components/service/sections";
import { galleryMock as m } from "./mockServiceSectionData";

type Props = {
  /** Visual chrome: full desktop canvas vs phone-width frame */
  viewport: "desktop" | "mobile";
};

type Entry = {
  name: string;
  wave: "1" | "2" | "+";
  node: ReactNode;
};

function SectionLabel({
  index,
  name,
  wave,
}: {
  index: number;
  name: string;
  wave: string;
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-amber-300/80 bg-amber-50/95 px-3 py-2 backdrop-blur">
      <p className="font-mono text-[11px] font-semibold tracking-wide text-amber-950">
        #{index} · {name}
        <span className="ml-2 rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
          Wave {wave}
        </span>
      </p>
    </div>
  );
}

export function ServiceSectionsGallery({ viewport }: Props) {
  const entries: Entry[] = [
    {
      name: "HeroBanner",
      wave: "1",
      node: <HeroBanner {...m.hero} />,
    },
    {
      name: "QuickFactsCard",
      wave: "1",
      node: (
        <QuickFactsCard
          facts={m.hero.quickFacts}
          note={m.hero.quickFactsNote}
        />
      ),
    },
    {
      name: "BookingFormSection",
      wave: "1",
      node: (
        <BookingFormSection
          layout="band"
          treatmentLabel={m.hero.heading}
          {...m.booking}
        />
      ),
    },
    {
      name: "OverviewSection",
      wave: "1",
      node: <OverviewSection {...m.overview} />,
    },
    {
      name: "InsightCallout",
      wave: "1",
      node: (
        <InsightCallout
          layout="band"
          eyebrow={m.overview.insightsEyebrow}
          title={m.overview.insightsTitle}
          items={m.overview.insights}
        />
      ),
    },
    {
      name: "HowItWorksSection",
      wave: "1",
      node: (
        <HowItWorksSection
          eyebrow={m.howItWorks.eyebrow}
          title={m.howItWorks.title}
          stepLabel={m.howItWorks.stepLabel}
          steps={m.howItWorks.steps}
        />
      ),
    },
    {
      name: "YoutubeEmbedSection",
      wave: "1",
      node: (
        <YoutubeEmbedSection
          eyebrow={m.howItWorks.youtubeEyebrow}
          title={m.howItWorks.youtubeTitle}
          youtubeId={m.howItWorks.youtubeId}
        />
      ),
    },
    {
      name: "BeforeAfterSection",
      wave: "1",
      node: <BeforeAfterSection {...m.beforeAfter} />,
    },
    {
      name: "CandidateSection",
      wave: "1",
      node: <CandidateSection {...m.candidacy} />,
    },
    {
      name: "PricingSection",
      wave: "1",
      node: <PricingSection {...m.pricing} />,
    },
    {
      name: "EmiCalculatorSection",
      wave: "1",
      node: <EmiCalculatorSection {...m.emi} />,
    },
    {
      name: "FaqAccordionSection",
      wave: "1",
      node: (
        <FaqAccordionSection
          eyebrow={m.faqEyebrow}
          title={m.faqHeading}
          faqs={m.faqs}
          emitJsonLd={false}
        />
      ),
    },
    {
      name: "RelatedServicesSection",
      wave: "1",
      node: (
        <RelatedServicesSection
          eyebrow={m.related.eyebrow}
          title={m.related.heading}
          services={m.related.services}
        />
      ),
    },
    {
      name: "FinalCtaStrip",
      wave: "1",
      node: <FinalCtaStrip {...m.finalCta} />,
    },
    {
      name: "DoctorProfileSection",
      wave: "1",
      node: (
        <DoctorProfileSection
          eyebrow={m.doctor.eyebrow}
          title={m.doctor.heading}
          doctor={m.doctor}
        />
      ),
    },
    {
      name: "TestimonialsSection",
      wave: "1",
      node: (
        <TestimonialsSection
          eyebrow={m.testimonials.eyebrow}
          title={m.testimonials.heading}
          items={m.testimonials.items}
          videoEnabled={m.testimonials.videoEnabled}
          videoEyebrow={m.testimonials.videoEyebrow}
          videoTitle={m.testimonials.videoHeading}
          videos={m.testimonials.videos}
        />
      ),
    },
    {
      name: "SymptomsSection",
      wave: "2",
      node: <SymptomsSection {...m.symptoms} />,
    },
    {
      name: "CausesSection",
      wave: "2",
      node: <CausesSection {...m.causes} />,
    },
    {
      name: "DiagnosisSection",
      wave: "2",
      node: <DiagnosisSection {...m.diagnosis} />,
    },
    {
      name: "BenefitsSection",
      wave: "2",
      node: (
        <BenefitsSection
          eyebrow={m.benefits.eyebrow}
          title={m.benefits.title}
          intro={m.benefits.intro}
          items={m.benefits.items}
        />
      ),
    },
    {
      name: "MythVsFactSection",
      wave: "2",
      node: <MythVsFactSection {...m.myths} />,
    },
    {
      name: "ComparisonSection",
      wave: "2",
      node: <ComparisonSection {...m.comparison} />,
    },
    {
      name: "TechnologySection",
      wave: "2",
      node: (
        <TechnologySection
          eyebrow={m.technology.eyebrow}
          title={m.technology.title}
          techniques={m.technology.techniques}
        />
      ),
    },
    {
      name: "TreatmentOptionsSection",
      wave: "2",
      node: (
        <TreatmentOptionsSection
          eyebrow={m.treatmentOptions.eyebrow}
          title={m.treatmentOptions.title}
          options={m.treatmentOptions.options}
        />
      ),
    },
    {
      name: "PreparationSection",
      wave: "2",
      node: (
        <PreparationSection
          eyebrow={m.preparation.eyebrow}
          title={m.preparation.title}
          intro={m.preparation.intro}
          items={m.preparation.items}
        />
      ),
    },
    {
      name: "RecoverySection",
      wave: "2",
      node: (
        <RecoverySection
          eyebrow={m.recovery.eyebrow}
          title={m.recovery.title}
          intro={m.recovery.intro}
          items={m.recovery.items}
        />
      ),
    },
    {
      name: "RisksSection",
      wave: "2",
      node: <RisksSection {...m.risks} />,
    },
    {
      name: "ResultsExpectationsSection",
      wave: "2",
      node: <ResultsExpectationsSection {...m.expectations} />,
    },
    {
      name: "WhyChooseUsSection",
      wave: "2",
      node: (
        <WhyChooseUsSection
          eyebrow={m.whyChooseUs.eyebrow}
          title={m.whyChooseUs.title}
          intro={m.whyChooseUs.intro}
          items={m.whyChooseUs.items}
        />
      ),
    },
    {
      name: "WhenDoctorsRecommendSection",
      wave: "2",
      node: <WhenDoctorsRecommendSection {...m.whenRecommended} />,
    },
    {
      name: "CostSnapshotSection",
      wave: "2",
      node: <CostSnapshotSection {...m.costSnapshot} />,
    },
    {
      name: "LocationSection",
      wave: "2",
      node: <LocationSection {...m.location} />,
    },
    {
      name: "MedicalEvidenceSection",
      wave: "2",
      node: (
        <MedicalEvidenceSection
          eyebrow={m.evidence.eyebrow}
          title={m.evidence.title}
          intro={m.evidence.intro}
          items={m.evidence.items}
        />
      ),
    },
    {
      name: "MistakesToAvoidSection",
      wave: "2",
      node: <MistakesToAvoidSection {...m.mistakesToAvoid} />,
    },
    {
      name: "UntreatedRisksSection",
      wave: "2",
      node: <UntreatedRisksSection {...m.untreatedRisks} />,
    },
    {
      name: "ContactCard",
      wave: "+",
      node: (
        <div className="mx-auto max-w-sm px-4 py-8">
          <ContactCard {...m.contactCard} />
        </div>
      ),
    },
  ];

  const isMobile = viewport === "mobile";

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-300 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Dev only · {isMobile ? "Mobile" : "Desktop"} gallery
            </p>
            <h1 className="text-sm font-semibold sm:text-base">
              Service sections ({entries.length}) — edit components in{" "}
              <code className="rounded bg-white/10 px-1">components/service/sections/</code>
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-xs">
            <a
              href="/dev/service-sections/desktop"
              className={`rounded px-3 py-1.5 font-semibold ${
                !isMobile ? "bg-amber-400 text-slate-900" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Desktop
            </a>
            <a
              href="/dev/service-sections/mobile"
              className={`rounded px-3 py-1.5 font-semibold ${
                isMobile ? "bg-amber-400 text-slate-900" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Mobile
            </a>
            <a
              href="/gynecomastia/"
              className="rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
            >
              Live preview
            </a>
          </nav>
        </div>
        <div className="overflow-x-auto border-t border-white/10 bg-slate-950/80">
          <div className="mx-auto flex max-w-6xl gap-1 px-2 py-2">
            {entries.map((e, i) => (
              <a
                key={e.name}
                href={`#sec-${e.name}`}
                className="shrink-0 rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-slate-300 hover:bg-white/15 hover:text-white"
              >
                {i + 1}.{e.name.replace(/Section$/, "").replace(/Banner$/, "")}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div
        className={
          isMobile
            ? "mx-auto max-w-[430px] py-6"
            : "mx-auto max-w-[1440px] py-6"
        }
      >
        {isMobile ? (
          <p className="mb-3 px-4 text-center text-xs text-slate-600">
            Phone frame · 390px content width · resize browser or use this page for mobile CSS
          </p>
        ) : (
          <p className="mb-3 px-4 text-center text-xs text-slate-600">
            Desktop canvas · up to 1440px · use a wide window for lg: breakpoints
          </p>
        )}

        <div
          className={
            isMobile
              ? "mx-auto overflow-hidden rounded-[2rem] border-[10px] border-slate-800 bg-[#FAFBFE] shadow-2xl"
              : "overflow-hidden rounded-xl border border-slate-300 bg-[#FAFBFE] shadow-lg"
          }
        >
          {isMobile ? (
            <div className="flex h-7 items-center justify-center bg-slate-800">
              <div className="h-1.5 w-20 rounded-full bg-slate-600" />
            </div>
          ) : null}

          <div className={isMobile ? "mx-auto w-full max-w-[390px]" : "w-full"}>
            {entries.map((entry, index) => (
              <div
                key={entry.name}
                id={`sec-${entry.name}`}
                className="scroll-mt-28 border-b border-dashed border-slate-300"
              >
                <SectionLabel
                  index={index + 1}
                  name={entry.name}
                  wave={entry.wave}
                />
                {entry.node}
              </div>
            ))}
          </div>

          {isMobile ? (
            <div className="flex h-5 items-center justify-center bg-slate-800">
              <div className="h-1 w-28 rounded-full bg-slate-600" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

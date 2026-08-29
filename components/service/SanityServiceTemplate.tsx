import type { Metadata } from "next";
import {
  BeforeAfterSection,
  BenefitsSection,
  BookingFormSection,
  CandidateSection,
  CausesSection,
  ComparisonSection,
  CostSnapshotSection,
  DiagnosisSection,
  DoctorProfileSection,
  FaqAccordionSection,
  FinalCtaStrip,
  HeroBanner,
  HowItWorksSection,
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
  EmiCalculatorSection,
  RisksSection,
  SymptomsSection,
  TechnologySection,
  TestimonialsSection,
  TreatmentOptionsSection,
  UntreatedRisksSection,
  WhenDoctorsRecommendSection,
  WhyChooseUsSection,
} from "@/components/service/sections";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";

/** Sanity `service` document shape for the React service template. */
export type SanityServiceDoc = {
  _id: string;
  title: string;
  slug: string;
  uri?: string;
  category?: string;
  excerpt?: string;
  seo?: { title?: string; description?: string; noIndex?: boolean };
  hero?: {
    heading?: string;
    tagline?: string;
    image?: Parameters<typeof HeroBanner>[0]["image"];
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    quickFacts?: Parameters<typeof HeroBanner>[0]["quickFacts"];
    quickFactsNote?: string;
  };
  overview?: {
    eyebrow?: string;
    heading?: string;
    body?: unknown[];
    insights?: string[];
    insightsTitle?: string;
    insightsEyebrow?: string;
  };
  howItWorks?: {
    eyebrow?: string;
    heading?: string;
    stepLabel?: string;
    youtubeId?: string;
    youtubeEyebrow?: string;
    youtubeTitle?: string;
    steps?: Parameters<typeof HowItWorksSection>[0]["steps"];
  };
  beforeAfter?: {
    eyebrow?: string;
    heading?: string;
    consentNotice?: string;
    pairs?: Parameters<typeof BeforeAfterSection>[0]["pairs"];
  };
  candidacy?: {
    eyebrow?: string;
    heading?: string;
    goodFitLabel?: string;
    goodFit?: string[] | null;
    notIdealLabel?: string;
    notIdeal?: string[] | null;
    quizCtaLabel?: string;
    quizCtaHref?: string;
  };
  symptoms?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  causes?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  diagnosis?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  benefits?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  preparation?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  recovery?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  risks?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  untreatedRisks?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  expectations?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  whenRecommended?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  whyChooseUs?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  mistakesToAvoid?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  evidence?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: string[];
  };
  myths?: {
    eyebrow?: string;
    heading?: string;
    mythLabel?: string;
    factLabel?: string;
    pairs?: Parameters<typeof MythVsFactSection>[0]["pairs"];
  };
  comparison?: {
    eyebrow?: string;
    heading?: string;
    columns?: Parameters<typeof ComparisonSection>[0]["columns"];
    tableHtml?: string;
  };
  technology?: {
    eyebrow?: string;
    heading?: string;
    techniques?: Parameters<typeof TechnologySection>[0]["techniques"];
  };
  treatmentOptions?: {
    eyebrow?: string;
    heading?: string;
    options?: Parameters<typeof TreatmentOptionsSection>[0]["options"];
  };
  pricing?: {
    eyebrow?: string;
    heading?: string;
    startingFromLabel?: string;
    startingFrom?: string;
    factorsHeading?: string;
    factors?: string[];
    includedHeading?: string;
    whatsIncluded?: string[];
    emiNote?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  costSnapshot?: {
    eyebrow?: string;
    heading?: string;
    cards?: Parameters<typeof CostSnapshotSection>[0]["cards"];
  };
  emi?: {
    eyebrow?: string;
    title?: string;
    amountLabel?: string;
    tenureLabel?: string;
    resultLabel?: string;
    disclaimer?: string;
    ctaLabel?: string;
    ctaHref?: string;
    defaultAmount?: number;
    defaultMonths?: number;
    annualRatePct?: number;
  };
  doctor?: Parameters<typeof DoctorProfileSection>[0]["doctor"] & {
    eyebrow?: string;
    heading?: string;
  };
  testimonialsSection?: {
    eyebrow?: string;
    heading?: string;
    videoEnabled?: boolean;
    videoEyebrow?: string;
    videoHeading?: string;
    items?: Parameters<typeof TestimonialsSection>[0]["items"];
    videos?: Parameters<typeof TestimonialsSection>[0]["videos"];
  };
  faqs?: Parameters<typeof FaqAccordionSection>[0]["faqs"];
  faqEyebrow?: string;
  faqHeading?: string;
  faqEmitJsonLd?: boolean;
  related?: {
    eyebrow?: string;
    heading?: string;
    services?: Parameters<typeof RelatedServicesSection>[0]["services"];
  };
  location?: {
    eyebrow?: string;
    heading?: string;
    address?: string;
    hours?: string;
    phone?: string;
    mapHref?: string;
    mapEmbedUrl?: string;
  };
  finalCta?: {
    eyebrow?: string;
    headline?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  booking?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    submitLabel?: string;
    nameLabel?: string;
    namePlaceholder?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    trustItems?: string[];
    successTitle?: string;
    successBody?: string;
    bandEyebrow?: string;
    bandHeadline?: string;
    bandBody?: string;
  };
};

const TECHNICAL_STRING_KEYS = new Set([
  "_id",
  "_key",
  "_ref",
  "_type",
  "ctaHref",
  "mapEmbedUrl",
  "mapHref",
  "phone",
  "primaryHref",
  "secondaryHref",
  "slug",
  "uri",
  "url",
  "whatsapp",
  "youtubeId",
]);

/**
 * Keep imported service copy readable without changing the Sanity source.
 * This gives every page the same baseline for common brand/place-name casing,
 * spacing, and punctuation while leaving URLs and document identifiers intact.
 */
function polishServiceValue(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    if (key && TECHNICAL_STRING_KEYS.has(key)) return value;

    return value
      .replace(/[ \t]+/g, " ")
      .replace(/[ \t]+([,.;!?])/g, "$1")
      .replace(/\bdr\.?\s+sandeep\s+bhasin\b/gi, "Dr. Sandeep Bhasin")
      .replace(/\bcare\s*well\b/gi, "Care Well")
      .replace(/\bdelhi\s+ncr\b/gi, "Delhi NCR")
      .replace(/\bdelhi\b/gi, "Delhi")
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => polishServiceValue(item, key));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        polishServiceValue(entryValue, entryKey),
      ]),
    );
  }

  return value;
}

function polishServiceCopy(service: SanityServiceDoc): SanityServiceDoc {
  return polishServiceValue(service) as SanityServiceDoc;
}

export function buildSanityServiceMetadata(
  service: SanityServiceDoc,
): Metadata {
  const raw = service.uri?.trim();
  const path = raw
    ? (raw.startsWith("/") ? raw : `/${raw}`).replace(/\/?$/, "/")
    : undefined;
  return {
    title: service.seo?.title || service.title,
    description: service.seo?.description || service.excerpt,
    robots: service.seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: path ? { canonical: path } : undefined,
  };
}

/**
 * Full CMS-driven service page (navbar + sections + footer).
 * Served at the document's original WordPress URI for SEO.
 */
export function SanityServiceTemplate({
  service: rawService,
}: {
  service: SanityServiceDoc;
}) {
  const service = polishServiceCopy(rawService);
  const heading = service.title;

  return (
    <>
      <NavbarPlaceholder />
      <main className="service-page bg-[#FAFBFE] text-slate-900">
        <HeroBanner
          heading={heading}
          tagline={service.hero?.tagline}
          category={service.category}
          uri={service.uri}
          image={service.hero?.image}
          primaryCtaLabel={service.hero?.primaryCtaLabel}
          secondaryCtaLabel={service.hero?.secondaryCtaLabel}
          quickFacts={service.hero?.quickFacts}
        />

        <QuickFactsCard
          facts={service.hero?.quickFacts}
          note={service.hero?.quickFactsNote}
        />

        <div className="service-content mx-auto grid w-full max-w-[90rem] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:px-8 xl:gap-16 xl:px-10">
          <div className="service-main-column min-w-0 space-y-2">
            <OverviewSection
              eyebrow={service.overview?.eyebrow}
              title={service.overview?.heading}
              body={service.overview?.body}
              insights={service.overview?.insights}
              insightsTitle={service.overview?.insightsTitle}
              insightsEyebrow={service.overview?.insightsEyebrow}
            />
            <HowItWorksSection
              eyebrow={service.howItWorks?.eyebrow}
              title={service.howItWorks?.heading}
              stepLabel={service.howItWorks?.stepLabel}
              steps={service.howItWorks?.steps ?? []}
              youtubeId={service.howItWorks?.youtubeId?.trim() || undefined}
              youtubeTitle={
                service.howItWorks?.youtubeId?.trim()
                  ? service.howItWorks?.youtubeTitle
                  : undefined
              }
            />
            <BeforeAfterSection
              eyebrow={service.beforeAfter?.eyebrow}
              title={service.beforeAfter?.heading}
              pairs={service.beforeAfter?.pairs ?? []}
              consentNotice={service.beforeAfter?.consentNotice}
            />
            <CandidateSection
              eyebrow={service.candidacy?.eyebrow}
              title={service.candidacy?.heading}
              goodFitLabel={service.candidacy?.goodFitLabel}
              goodFit={service.candidacy?.goodFit}
              notIdealLabel={service.candidacy?.notIdealLabel}
              notIdeal={service.candidacy?.notIdeal}
              quizCtaLabel={service.candidacy?.quizCtaLabel}
              quizCtaHref={service.candidacy?.quizCtaHref}
            />
            <SymptomsSection
              eyebrow={service.symptoms?.eyebrow}
              title={service.symptoms?.heading}
              intro={service.symptoms?.intro}
              items={service.symptoms?.items}
            />
            <CausesSection
              eyebrow={service.causes?.eyebrow}
              title={service.causes?.heading}
              intro={service.causes?.intro}
              items={service.causes?.items}
            />
            <DiagnosisSection
              eyebrow={service.diagnosis?.eyebrow}
              title={service.diagnosis?.heading}
              intro={service.diagnosis?.intro}
              items={service.diagnosis?.items}
            />
            <BenefitsSection
              eyebrow={service.benefits?.eyebrow}
              title={service.benefits?.heading}
              intro={service.benefits?.intro}
              items={service.benefits?.items}
            />
            <PreparationSection
              eyebrow={service.preparation?.eyebrow}
              title={service.preparation?.heading}
              intro={service.preparation?.intro}
              items={service.preparation?.items}
            />
            <RecoverySection
              eyebrow={service.recovery?.eyebrow}
              title={service.recovery?.heading}
              intro={service.recovery?.intro}
              items={service.recovery?.items}
            />
            <RisksSection
              eyebrow={service.risks?.eyebrow}
              title={service.risks?.heading}
              intro={service.risks?.intro}
              items={service.risks?.items}
            />
            <UntreatedRisksSection
              eyebrow={service.untreatedRisks?.eyebrow}
              title={service.untreatedRisks?.heading}
              intro={service.untreatedRisks?.intro}
              items={service.untreatedRisks?.items}
            />
            <MistakesToAvoidSection
              eyebrow={service.mistakesToAvoid?.eyebrow}
              title={service.mistakesToAvoid?.heading}
              intro={service.mistakesToAvoid?.intro}
              items={service.mistakesToAvoid?.items}
            />
            <ResultsExpectationsSection
              eyebrow={service.expectations?.eyebrow}
              title={service.expectations?.heading}
              intro={service.expectations?.intro}
              items={service.expectations?.items}
            />
            <WhyChooseUsSection
              eyebrow={service.whyChooseUs?.eyebrow}
              title={service.whyChooseUs?.heading}
              intro={service.whyChooseUs?.intro}
              items={service.whyChooseUs?.items}
            />
            <WhenDoctorsRecommendSection
              eyebrow={service.whenRecommended?.eyebrow}
              title={service.whenRecommended?.heading}
              intro={service.whenRecommended?.intro}
              items={service.whenRecommended?.items}
            />
            <MedicalEvidenceSection
              eyebrow={service.evidence?.eyebrow}
              title={service.evidence?.heading}
              intro={service.evidence?.intro}
              items={service.evidence?.items}
            />
            <MythVsFactSection
              eyebrow={service.myths?.eyebrow}
              title={service.myths?.heading}
              mythLabel={service.myths?.mythLabel}
              factLabel={service.myths?.factLabel}
              pairs={service.myths?.pairs}
            />
            <ComparisonSection
              eyebrow={service.comparison?.eyebrow}
              title={service.comparison?.heading}
              columns={service.comparison?.columns}
              tableHtml={service.comparison?.tableHtml}
            />
            <TechnologySection
              eyebrow={service.technology?.eyebrow}
              title={service.technology?.heading}
              techniques={service.technology?.techniques}
            />
            <TreatmentOptionsSection
              eyebrow={service.treatmentOptions?.eyebrow}
              title={service.treatmentOptions?.heading}
              options={service.treatmentOptions?.options}
            />
            <PricingSection
              eyebrow={service.pricing?.eyebrow}
              title={service.pricing?.heading}
              startingFromLabel={service.pricing?.startingFromLabel}
              startingFrom={service.pricing?.startingFrom}
              factorsHeading={service.pricing?.factorsHeading}
              factors={service.pricing?.factors ?? []}
              includedHeading={service.pricing?.includedHeading}
              whatsIncluded={service.pricing?.whatsIncluded ?? []}
              emiNote={service.pricing?.emiNote}
              ctaLabel={service.pricing?.ctaLabel}
              ctaHref={service.pricing?.ctaHref}
            />
            <EmiCalculatorSection
              eyebrow={service.emi?.eyebrow}
              title={service.emi?.title}
              amountLabel={service.emi?.amountLabel}
              tenureLabel={service.emi?.tenureLabel}
              resultLabel={service.emi?.resultLabel}
              disclaimer={service.emi?.disclaimer}
              ctaLabel={service.emi?.ctaLabel}
              ctaHref={service.emi?.ctaHref}
              defaultAmount={service.emi?.defaultAmount}
              defaultMonths={service.emi?.defaultMonths}
              annualRatePct={service.emi?.annualRatePct}
            />
            <CostSnapshotSection
              eyebrow={service.costSnapshot?.eyebrow}
              title={service.costSnapshot?.heading}
              cards={service.costSnapshot?.cards}
            />
            <DoctorProfileSection
              eyebrow={service.doctor?.eyebrow}
              title={service.doctor?.heading}
              doctor={service.doctor}
            />
            <TestimonialsSection
              eyebrow={service.testimonialsSection?.eyebrow}
              title={service.testimonialsSection?.heading}
              items={service.testimonialsSection?.items ?? []}
              videoEnabled={service.testimonialsSection?.videoEnabled === true}
              videoEyebrow={service.testimonialsSection?.videoEyebrow}
              videoTitle={service.testimonialsSection?.videoHeading}
              videos={service.testimonialsSection?.videos ?? []}
            />
            <FaqAccordionSection
              eyebrow={service.faqEyebrow}
              title={service.faqHeading}
              faqs={service.faqs ?? []}
              emitJsonLd={service.faqEmitJsonLd !== false}
            />
            <RelatedServicesSection
              eyebrow={service.related?.eyebrow}
              title={service.related?.heading}
              services={service.related?.services ?? []}
            />
          </div>

          <div className="space-y-4 lg:sticky lg:top-36 lg:self-start">
            <BookingFormSection
              sticky={false}
              layout="card"
              treatmentLabel={service.title}
              pageUri={service.uri}
              pageSlug={service.slug}
              eyebrow={service.booking?.eyebrow}
              title={service.booking?.title}
              subtitle={service.booking?.subtitle}
              submitLabel={service.booking?.submitLabel}
              nameLabel={service.booking?.nameLabel}
              namePlaceholder={service.booking?.namePlaceholder}
              phoneLabel={service.booking?.phoneLabel}
              phonePlaceholder={service.booking?.phonePlaceholder}
              trustItems={service.booking?.trustItems}
              successTitle={service.booking?.successTitle}
              successBody={service.booking?.successBody}
              bandEyebrow={service.booking?.bandEyebrow}
              bandHeadline={service.booking?.bandHeadline}
              bandBody={service.booking?.bandBody}
            />
          </div>
        </div>

        <LocationSection
          eyebrow={service.location?.eyebrow}
          heading={service.location?.heading}
          address={service.location?.address}
          hours={service.location?.hours}
          phone={service.location?.phone}
          mapHref={service.location?.mapHref}
          mapEmbedUrl={service.location?.mapEmbedUrl}
        />

        <FinalCtaStrip
          eyebrow={service.finalCta?.eyebrow}
          headline={service.finalCta?.headline}
          primaryLabel={service.finalCta?.primaryLabel}
          primaryHref={service.finalCta?.primaryHref}
          secondaryLabel={service.finalCta?.secondaryLabel}
          secondaryHref={service.finalCta?.secondaryHref}
        />
      </main>
      <FooterPlaceholder />
    </>
  );
}

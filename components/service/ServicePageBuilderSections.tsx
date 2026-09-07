import type { ReactNode } from "react";

import {
  BeforeAfterSection,
  BenefitsSection,
  CandidateSection,
  CausesSection,
  ComparisonSection,
  CostSnapshotSection,
  DiagnosisSection,
  DoctorProfileSection,
  EmiCalculatorSection,
  FaqAccordionSection,
  HowItWorksSection,
  MedicalEvidenceSection,
  MistakesToAvoidSection,
  MythVsFactSection,
  OverviewSection,
  PreparationSection,
  PricingSection,
  RecoverySection,
  RelatedBlogsSection,
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
} from "@/components/service/sections";
import type { SanityServiceDoc } from "@/components/service/sanityServiceTypes";
import type { SanityPostCard } from "@/lib/sanity/post";
import {
  resolveServiceSectionOrder,
  type ServiceSectionKey,
} from "@/lib/service/pageBuilder";

function renderServiceSection(
  key: ServiceSectionKey,
  service: SanityServiceDoc,
  relatedPosts: SanityPostCard[],
): ReactNode {
  switch (key) {
    case "overview":
      return (
        <OverviewSection
          key={key}
          eyebrow={service.overview?.eyebrow}
          title={service.overview?.heading}
          body={service.overview?.body}
          insights={service.overview?.insights}
          insightsTitle={service.overview?.insightsTitle}
          insightsEyebrow={service.overview?.insightsEyebrow}
        />
      );
    case "howItWorks":
      return (
        <HowItWorksSection
          key={key}
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
      );
    case "beforeAfter":
      return (
        <BeforeAfterSection
          key={key}
          eyebrow={service.beforeAfter?.eyebrow}
          title={service.beforeAfter?.heading}
          pairs={service.beforeAfter?.pairs ?? []}
          consentNotice={service.beforeAfter?.consentNotice}
        />
      );
    case "candidacy":
      return (
        <CandidateSection
          key={key}
          eyebrow={service.candidacy?.eyebrow}
          title={service.candidacy?.heading}
          goodFitLabel={service.candidacy?.goodFitLabel}
          goodFit={service.candidacy?.goodFit}
          notIdealLabel={service.candidacy?.notIdealLabel}
          notIdeal={service.candidacy?.notIdeal}
          quizCtaLabel={service.candidacy?.quizCtaLabel}
          quizCtaHref={service.candidacy?.quizCtaHref}
        />
      );
    case "symptoms":
      return (
        <SymptomsSection
          key={key}
          eyebrow={service.symptoms?.eyebrow}
          title={service.symptoms?.heading}
          intro={service.symptoms?.intro}
          items={service.symptoms?.items}
        />
      );
    case "causes":
      return (
        <CausesSection
          key={key}
          eyebrow={service.causes?.eyebrow}
          title={service.causes?.heading}
          intro={service.causes?.intro}
          items={service.causes?.items}
        />
      );
    case "diagnosis":
      return (
        <DiagnosisSection
          key={key}
          eyebrow={service.diagnosis?.eyebrow}
          title={service.diagnosis?.heading}
          intro={service.diagnosis?.intro}
          items={service.diagnosis?.items}
        />
      );
    case "benefits":
      return (
        <BenefitsSection
          key={key}
          eyebrow={service.benefits?.eyebrow}
          title={service.benefits?.heading}
          intro={service.benefits?.intro}
          items={service.benefits?.items}
        />
      );
    case "preparation":
      return (
        <PreparationSection
          key={key}
          eyebrow={service.preparation?.eyebrow}
          title={service.preparation?.heading}
          intro={service.preparation?.intro}
          items={service.preparation?.items}
        />
      );
    case "recovery":
      return (
        <RecoverySection
          key={key}
          eyebrow={service.recovery?.eyebrow}
          title={service.recovery?.heading}
          intro={service.recovery?.intro}
          items={service.recovery?.items}
        />
      );
    case "risks":
      return (
        <RisksSection
          key={key}
          eyebrow={service.risks?.eyebrow}
          title={service.risks?.heading}
          intro={service.risks?.intro}
          items={service.risks?.items}
        />
      );
    case "untreatedRisks":
      return (
        <UntreatedRisksSection
          key={key}
          eyebrow={service.untreatedRisks?.eyebrow}
          title={service.untreatedRisks?.heading}
          intro={service.untreatedRisks?.intro}
          items={service.untreatedRisks?.items}
        />
      );
    case "mistakesToAvoid":
      return (
        <MistakesToAvoidSection
          key={key}
          eyebrow={service.mistakesToAvoid?.eyebrow}
          title={service.mistakesToAvoid?.heading}
          intro={service.mistakesToAvoid?.intro}
          items={service.mistakesToAvoid?.items}
        />
      );
    case "expectations":
      return (
        <ResultsExpectationsSection
          key={key}
          eyebrow={service.expectations?.eyebrow}
          title={service.expectations?.heading}
          intro={service.expectations?.intro}
          items={service.expectations?.items}
        />
      );
    case "whyChooseUs":
      return (
        <WhyChooseUsSection
          key={key}
          eyebrow={service.whyChooseUs?.eyebrow}
          title={service.whyChooseUs?.heading}
          intro={service.whyChooseUs?.intro}
          items={service.whyChooseUs?.items}
        />
      );
    case "whenRecommended":
      return (
        <WhenDoctorsRecommendSection
          key={key}
          eyebrow={service.whenRecommended?.eyebrow}
          title={service.whenRecommended?.heading}
          intro={service.whenRecommended?.intro}
          items={service.whenRecommended?.items}
        />
      );
    case "evidence":
      return (
        <MedicalEvidenceSection
          key={key}
          eyebrow={service.evidence?.eyebrow}
          title={service.evidence?.heading}
          intro={service.evidence?.intro}
          items={service.evidence?.items}
        />
      );
    case "myths":
      return (
        <MythVsFactSection
          key={key}
          eyebrow={service.myths?.eyebrow}
          title={service.myths?.heading}
          mythLabel={service.myths?.mythLabel}
          factLabel={service.myths?.factLabel}
          pairs={service.myths?.pairs}
        />
      );
    case "comparison":
      return (
        <ComparisonSection
          key={key}
          eyebrow={service.comparison?.eyebrow}
          title={service.comparison?.heading}
          columns={service.comparison?.columns}
          tableHtml={service.comparison?.tableHtml}
        />
      );
    case "technology":
      return (
        <TechnologySection
          key={key}
          eyebrow={service.technology?.eyebrow}
          title={service.technology?.heading}
          techniques={service.technology?.techniques}
        />
      );
    case "treatmentOptions":
      return (
        <TreatmentOptionsSection
          key={key}
          eyebrow={service.treatmentOptions?.eyebrow}
          title={service.treatmentOptions?.heading}
          options={service.treatmentOptions?.options}
        />
      );
    case "pricing":
      return (
        <PricingSection
          key={key}
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
      );
    case "emi":
      return (
        <EmiCalculatorSection
          key={key}
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
      );
    case "costSnapshot":
      return (
        <CostSnapshotSection
          key={key}
          eyebrow={service.costSnapshot?.eyebrow}
          title={service.costSnapshot?.heading}
          cards={service.costSnapshot?.cards}
        />
      );
    case "doctor":
      return (
        <DoctorProfileSection
          key={key}
          eyebrow={service.doctor?.eyebrow}
          title={service.doctor?.heading}
          doctor={service.doctor}
        />
      );
    case "testimonials":
      return (
        <TestimonialsSection
          key={key}
          eyebrow={service.testimonialsSection?.eyebrow}
          title={service.testimonialsSection?.heading}
          items={service.testimonialsSection?.items ?? []}
          videoEnabled={service.testimonialsSection?.videoEnabled === true}
          videoEyebrow={service.testimonialsSection?.videoEyebrow}
          videoTitle={service.testimonialsSection?.videoHeading}
          videos={service.testimonialsSection?.videos ?? []}
        />
      );
    case "faq":
      return (
        <FaqAccordionSection
          key={key}
          eyebrow={service.faqEyebrow}
          title={service.faqHeading}
          faqs={service.faqs ?? []}
          emitJsonLd={service.faqEmitJsonLd !== false}
        />
      );
    case "relatedServices":
      return (
        <RelatedServicesSection
          key={key}
          eyebrow={service.related?.eyebrow}
          title={service.related?.heading}
          services={service.related?.services ?? []}
        />
      );
    case "relatedBlogs":
      return <RelatedBlogsSection key={key} posts={relatedPosts} />;
    default:
      return null;
  }
}

/** Main-column sections in page-builder (or default) order. */
export function ServicePageBuilderSections({
  service,
  relatedPosts = [],
}: {
  service: SanityServiceDoc;
  relatedPosts?: SanityPostCard[];
}) {
  const order = resolveServiceSectionOrder(service.pageBuilder);
  return (
    <>
      {order.map((key) => renderServiceSection(key, service, relatedPosts))}
    </>
  );
}

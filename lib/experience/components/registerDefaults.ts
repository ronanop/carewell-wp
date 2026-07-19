/**
 * Registers default editorial components for all semantic section types.
 */

import {
  BeforeAfterSlider,
  BenefitsGrid,
  CitationList,
  ComparisonTableSection,
  DoctorAdviceCard,
  EditorialGallery,
  GenericEditorialSection,
  KeyTakeawaysPanel,
  MedicalFactCard,
  MedicalWarningCard,
  PremiumAccordion,
  PricingComparison,
  ProcedureStepper,
  QuoteSection,
  RecoveryTimeline,
  ResearchCards,
  StatisticsGrid,
  SummaryPanel,
  TimelineComponent,
  VideoFeature,
  WarningCards,
} from "@/components/blog/editorial/sections";
import { registerEditorialComponent } from "@/lib/experience/components/registry";

let registered = false;

export function ensureDefaultEditorialComponents(): void {
  if (registered) return;
  registered = true;

  const map = [
    { type: "BENEFITS" as const, component: BenefitsGrid, minConfidence: "medium" as const },
    { type: "RISKS" as const, component: WarningCards, minConfidence: "medium" as const },
    { type: "SIDE_EFFECTS" as const, component: WarningCards, minConfidence: "medium" as const },
    { type: "WARNING" as const, component: MedicalWarningCard, minConfidence: "low" as const },
    { type: "RECOVERY" as const, component: RecoveryTimeline, minConfidence: "medium" as const },
    { type: "AFTERCARE" as const, component: RecoveryTimeline, minConfidence: "medium" as const },
    { type: "PROCEDURE" as const, component: ProcedureStepper, minConfidence: "medium" as const },
    { type: "STEP_BY_STEP" as const, component: ProcedureStepper, minConfidence: "medium" as const },
    { type: "TIMELINE" as const, component: TimelineComponent, minConfidence: "medium" as const },
    { type: "PREPARATION" as const, component: ProcedureStepper, minConfidence: "medium" as const },
    { type: "KEY_TAKEAWAYS" as const, component: KeyTakeawaysPanel, minConfidence: "low" as const },
    { type: "SUMMARY" as const, component: SummaryPanel, minConfidence: "low" as const },
    { type: "CONCLUSION" as const, component: SummaryPanel, minConfidence: "low" as const },
    { type: "RESEARCH" as const, component: ResearchCards, minConfidence: "medium" as const },
    { type: "STATISTICS" as const, component: StatisticsGrid, minConfidence: "medium" as const },
    { type: "COMPARISON" as const, component: ComparisonTableSection, minConfidence: "low" as const },
    { type: "COST" as const, component: PricingComparison, minConfidence: "medium" as const },
    { type: "DOCTOR_ADVICE" as const, component: DoctorAdviceCard, minConfidence: "medium" as const },
    { type: "FAQ" as const, component: PremiumAccordion, minConfidence: "low" as const },
    { type: "FACT" as const, component: MedicalFactCard, minConfidence: "medium" as const },
    { type: "REFERENCES" as const, component: CitationList, minConfidence: "medium" as const },
    { type: "VIDEO" as const, component: VideoFeature, minConfidence: "low" as const },
    { type: "IMAGE_GALLERY" as const, component: EditorialGallery, minConfidence: "low" as const },
    { type: "BEFORE_AFTER" as const, component: BeforeAfterSlider, minConfidence: "low" as const },
    { type: "QUOTE" as const, component: QuoteSection, minConfidence: "medium" as const },
    { type: "INTRODUCTION" as const, component: GenericEditorialSection, minConfidence: "low" as const },
    { type: "GENERIC" as const, component: GenericEditorialSection, minConfidence: "low" as const },
    { type: "ELIGIBILITY" as const, component: KeyTakeawaysPanel, minConfidence: "medium" as const },
    { type: "WHEN_TO_CONTACT" as const, component: MedicalWarningCard, minConfidence: "medium" as const },
    { type: "MEDICAL_DISCLAIMER" as const, component: MedicalFactCard, minConfidence: "low" as const },
    { type: "RESULTS" as const, component: SummaryPanel, minConfidence: "medium" as const },
    { type: "TESTIMONIAL" as const, component: QuoteSection, minConfidence: "medium" as const },
  ];

  for (const entry of map) {
    registerEditorialComponent(entry);
  }
}

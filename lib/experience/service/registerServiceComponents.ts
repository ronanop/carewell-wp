/**
 * Service editorial component registrations — beside blog defaults.
 * Uses the same editorial registry; no renderer forking.
 */

import { registerEditorialComponent } from "@/lib/experience/blog/editorial/registry";
import {
  BenefitsGrid,
  WarningCards,
  RecoveryTimeline,
  PricingComparison,
  BeforeAfterSlider,
  DoctorAdviceCard,
  PremiumAccordion,
  ResearchCards,
  CitationList,
  EditorialGallery,
  VideoFeature,
  KeyTakeawaysPanel,
  SummaryPanel,
} from "@/components/blog/editorial/sections";

let registered = false;

export function ensureServiceEditorialComponents(): void {
  if (registered) return;
  registered = true;

  registerEditorialComponent({
    type: "TECHNOLOGY",
    component: ResearchCards,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "LOCATION",
    component: SummaryPanel,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "INSURANCE",
    component: PricingComparison,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "CONSULTATION",
    component: DoctorAdviceCard,
    minConfidence: "low",
  });
  registerEditorialComponent({
    type: "GALLERY",
    component: EditorialGallery,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "TESTIMONIALS",
    component: DoctorAdviceCard,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "REVIEWS",
    component: CitationList,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "BENEFITS",
    component: BenefitsGrid,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "RISKS",
    component: WarningCards,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "ELIGIBILITY",
    component: KeyTakeawaysPanel,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "RECOVERY",
    component: RecoveryTimeline,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "BEFORE_AFTER",
    component: BeforeAfterSlider,
    minConfidence: "medium",
  });
  registerEditorialComponent({
    type: "FAQ",
    component: PremiumAccordion,
    minConfidence: "low",
  });
  registerEditorialComponent({
    type: "VIDEO",
    component: VideoFeature,
    minConfidence: "medium",
  });
}

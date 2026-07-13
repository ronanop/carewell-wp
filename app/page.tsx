import type { Metadata } from "next";

import { AboutSection } from "@/components/home/AboutSection";
import { AiSkinAnalysis } from "@/components/home/AiSkinAnalysis";
import { BlogSection } from "@/components/home/BlogSection";
import { ConsultationSpecialties } from "@/components/home/ConsultationSpecialties";
import { CTABanner } from "@/components/home/CTABanner";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LocationLeadSection } from "@/components/home/LocationLeadSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TreatmentJourney } from "@/components/home/TreatmentJourney";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";

export const metadata: Metadata = {
  title: "Care Well Medical Centre",
  description:
    "Advanced care, thoughtfully delivered. A premium medical centre offering specialist consultations and personalised treatment.",
};

export default function HomePage() {
  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <HeroSection />
        {/* Post-hero content at 68% visual scale (navbar + hero excluded). */}
        <div className="homepage-compact">
          <TrustIndicators />
          <TreatmentJourney />
          <ServicesSection />
          <AiSkinAnalysis />
          <DoctorsSection />
          <AboutSection />
          <ConsultationSpecialties />
          <WhyChooseUs />
          <BlogSection />
          <LocationLeadSection />
          <CTABanner />
        </div>
      </main>
      <div className="homepage-compact">
        <FooterPlaceholder />
      </div>
    </>
  );
}

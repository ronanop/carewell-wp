import type { Metadata } from "next";

import { AboutBeliefBand } from "@/components/about/AboutBeliefBand";
import { AboutBreadcrumb } from "@/components/about/AboutBreadcrumb";
import { AboutClinic } from "@/components/about/AboutClinic";
import { AboutDoctor } from "@/components/about/AboutDoctor";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTreatments } from "@/components/about/AboutTreatments";
import { AboutValuePillars } from "@/components/about/AboutValuePillars";
import { AboutVisionMission } from "@/components/about/AboutVisionMission";
import { AboutVisitCta } from "@/components/about/AboutVisitCta";
import { AboutWhyChoose } from "@/components/about/AboutWhyChoose";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";

export const metadata: Metadata = {
  title: "About Us | Care Well Medical Centre",
  description:
    "About Care Well Medical Centre — our vision, team, and commitment to advanced cosmetic and aesthetic treatments in South Delhi, led by Dr. Sandeep Bhasin.",
};

export default function AboutPage() {
  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <AboutBreadcrumb />
        <AboutHero />
        <AboutTreatments />
        <AboutBeliefBand />
        <AboutWhyChoose />
        <AboutDoctor />
        <AboutVisionMission />
        <AboutVisitCta />
        <AboutValuePillars />
        <AboutClinic />
      </main>
      <FooterPlaceholder />
    </>
  );
}

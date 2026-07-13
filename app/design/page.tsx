import type { Metadata } from "next";

import { DesignSystemValidation } from "@/components/design/DesignSystemValidation";
import { HeroSection } from "@/components/home/HeroSection";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";

export const metadata: Metadata = {
  title: "Design Reference — Care Well Medical Centre",
  description:
    "Internal design system reference for typography, spacing, components, and layout tokens.",
  robots: { index: false, follow: false },
};

export default function DesignReferencePage() {
  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <div className="border-b border-border bg-muted">
          <div className="container-content py-3">
            <p className="text-caption text-muted-foreground">
              Design reference — typography, components, and layout tokens. Not
              for production use.
            </p>
          </div>
        </div>
        <HeroSection />
        <DesignSystemValidation />
      </main>
      <FooterPlaceholder />
    </>
  );
}

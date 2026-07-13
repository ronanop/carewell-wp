import type { Metadata } from "next";

import { ContactBreadcrumb } from "@/components/contact/ContactBreadcrumb";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMapSection } from "@/components/contact/ContactMapSection";
import { ContactReachSection } from "@/components/contact/ContactReachSection";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";

export const metadata: Metadata = {
  title: "Contact Care Well Medical Centre",
  description:
    "Get in touch with Care Well Medical Centre in Chittaranjan Park, New Delhi. Call, email, or send a message for aesthetic treatments and general inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <ContactBreadcrumb />
        <ContactHero />
        <ContactReachSection />
        <ContactMapSection />
      </main>
      <FooterPlaceholder />
    </>
  );
}

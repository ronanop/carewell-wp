import type { Metadata } from "next";

import { ContactPageView } from "@/components/pages/contact/ContactPageView";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";

export const metadata: Metadata = {
  title: "Contact Care Well Medical Centre",
  description:
    "Get in touch with Care Well Medical Centre in Chittaranjan Park, New Delhi. Call, email, or send a message for aesthetic treatments and general inquiries.",
};

export default async function ContactPage() {
  const studioConfig = await getCachedPublishedStaticPageConfig("contact");
  return <ContactPageView mode="public" config={studioConfig} />;
}

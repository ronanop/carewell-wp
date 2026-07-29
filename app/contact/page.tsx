import type { Metadata } from "next";

import { ContactPageView } from "@/components/pages/contact/ContactPageView";

export const metadata: Metadata = {
  title: "Contact Care Well Medical Centre",
  description:
    "Get in touch with Care Well Medical Centre in Chittaranjan Park, New Delhi. Call, email, or send a message for aesthetic treatments and general inquiries.",
};

export default async function ContactPage() {
  return <ContactPageView mode="public" config={null} />;
}

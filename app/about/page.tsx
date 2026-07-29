import type { Metadata } from "next";

import { AboutPageView } from "@/components/pages/about/AboutPageView";

export const metadata: Metadata = {
  title: "About Us | Care Well Medical Centre",
  description:
    "Care Well Medical Centre — 20+ years of ethical cosmetic surgery, hair restoration, and aesthetic care in South Delhi, led by Dr. Sandeep Bhasin.",
};

export default async function AboutPage() {
  return <AboutPageView mode="public" config={null} />;
}

import type { Metadata } from "next";

import { AppointmentBanner } from "@/components/doctors/AppointmentBanner";
import { DoctorBiography } from "@/components/doctors/DoctorBiography";
import { DoctorBreadcrumb } from "@/components/doctors/DoctorBreadcrumb";
import { DoctorGallery } from "@/components/doctors/DoctorGallery";
import { DoctorHero } from "@/components/doctors/DoctorHero";
import { DoctorQuickFacts } from "@/components/doctors/DoctorQuickFacts";
import { DoctorStats } from "@/components/doctors/DoctorStats";
import { DoctorTestimonials } from "@/components/doctors/DoctorTestimonials";
import { drSandeepBhasin } from "@/components/doctors/content";
import { ExperienceTimeline } from "@/components/doctors/ExperienceTimeline";
import { ExpertiseGrid } from "@/components/doctors/ExpertiseGrid";
import { FAQAccordion } from "@/components/doctors/FAQAccordion";
import { QualificationTimeline } from "@/components/doctors/QualificationTimeline";
import { RelatedTreatments } from "@/components/doctors/RelatedTreatments";
import { TreatmentPhilosophy } from "@/components/doctors/TreatmentPhilosophy";
import { VideoConsultation } from "@/components/doctors/VideoConsultation";
import { WhyPatientsChoose } from "@/components/doctors/WhyPatientsChoose";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generatePhysicianSchema,
} from "@/lib/seo/schema";

const doctor = drSandeepBhasin;

export const metadata: Metadata = {
  title: doctor.seo.title,
  description: doctor.seo.description,
  alternates: {
    canonical: doctor.seo.canonicalUrl,
  },
  openGraph: {
    title: doctor.seo.openGraphTitle,
    description: doctor.seo.openGraphDescription,
    url: doctor.seo.canonicalUrl,
    siteName: SITE_NAME,
    type: "profile",
    images: doctor.seo.openGraphImage
      ? [
          {
            url: doctor.seo.openGraphImage.startsWith("http")
              ? doctor.seo.openGraphImage
              : `${SITE_URL}${doctor.seo.openGraphImage}`,
            alt: doctor.name,
          },
        ]
      : [],
  },
  twitter: {
    card: "summary_large_image",
    title: doctor.seo.openGraphTitle,
    description: doctor.seo.openGraphDescription,
    images: doctor.seo.openGraphImage
      ? [
          doctor.seo.openGraphImage.startsWith("http")
            ? doctor.seo.openGraphImage
            : `${SITE_URL}${doctor.seo.openGraphImage}`,
        ]
      : [],
  },
};

export default function DrSandeepBhasinPage() {
  const jsonLd = [
    generateOrganizationSchema(),
    generatePhysicianSchema(doctor),
    generateBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: doctor.name, path: `/about/${doctor.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavbarPlaceholder />
      <main className="flex-1">
        <DoctorBreadcrumb doctor={doctor} />
        <DoctorHero doctor={doctor} />
        <DoctorQuickFacts facts={doctor.quickFacts} />
        <DoctorBiography biography={doctor.biography} />
        <ExpertiseGrid items={doctor.expertise} />
        <QualificationTimeline items={doctor.qualifications} />
        <ExperienceTimeline items={doctor.experience} />
        <DoctorStats achievements={doctor.achievements} />
        <TreatmentPhilosophy philosophy={doctor.philosophy} />
        <WhyPatientsChoose
          items={doctor.whyChoose}
          doctorName={doctor.shortName}
        />
        <DoctorGallery items={doctor.gallery} />
        <VideoConsultation content={doctor.videoConsultation} />
        <DoctorTestimonials testimonials={doctor.testimonials} />
        <FAQAccordion items={doctor.faqs} />
        <AppointmentBanner clinic={doctor.clinic} doctorName={doctor.name} />
        <RelatedTreatments treatments={doctor.relatedTreatments} />
      </main>
      <FooterPlaceholder />
    </>
  );
}

import { ORGANIZATION, SITE_URL } from "@/lib/seo/constants";
import type { DoctorProfile } from "@/types/doctor";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    address: {
      "@type": "PostalAddress",
      ...ORGANIZATION.address,
    },
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function generatePhysicianSchema(doctor: DoctorProfile) {
  const imageUrl = doctor.portrait?.sourceUrl
    ? doctor.portrait.sourceUrl.startsWith("http")
      ? doctor.portrait.sourceUrl
      : `${SITE_URL}${doctor.portrait.sourceUrl}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": ["Person", "Physician"],
    name: doctor.name,
    url: doctor.seo.canonicalUrl,
    jobTitle: doctor.title,
    description: doctor.seo.description,
    image: imageUrl,
    medicalSpecialty: doctor.specialties,
    worksFor: {
      "@type": "MedicalBusiness",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
      telephone: ORGANIZATION.telephone,
      address: {
        "@type": "PostalAddress",
        ...ORGANIZATION.address,
      },
    },
    address: {
      "@type": "PostalAddress",
      ...ORGANIZATION.address,
    },
    telephone: doctor.clinic.phoneHref.replace("tel:", ""),
  };
}

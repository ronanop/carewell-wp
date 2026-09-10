import Link from "next/link";
import type { ReactNode } from "react";

import { getHomepageFooter } from "@/lib/sanity/homepage";

const DEFAULT_QUICK_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blogs" },
  { label: "FAQs", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const DEFAULT_SERVICE_LINKS = [
  { label: "Cosmetic Treatments", href: "/services/cosmetic-treatments" },
  { label: "Plastic Surgery", href: "/services/plastic-surgery" },
  { label: "Hair Transplant", href: "/services/hair-transplant" },
  { label: "Skin Treatments", href: "/services/skin-treatments" },
  { label: "Intimate Surgery", href: "/services/intimate-surgery" },
  { label: "Body Contouring", href: "/services/body-contouring" },
  { label: "Urology", href: "/services/urology" },
];

const openingHours = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const SOCIAL_ICONS: Record<
  string,
  { brandClass: string; icon: ReactNode }
> = {
  Facebook: {
    brandClass: "text-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5 sm:size-5 lg:size-6">
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.09 16.02 2 14.86 2 12.15 2 10.5 3.7 10.5 6.61V9.5H8v4h2.5V22h3.5z" />
      </svg>
    ),
  },
  LinkedIn: {
    brandClass: "text-[#0A66C2]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5 sm:size-5 lg:size-6">
        <path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5M7 8.86H3.56V20H7zm4.32-.06c-2.2 0-3.58 1.2-3.58 3.28V20h3.44v-5.5c0-1.16.42-1.95 1.48-1.95.8 0 1.26.54 1.47 1.06.11.26.14.62.14 1V20h3.44v-5.9c0-3.16-1.69-4.3-3.94-4.3a3.56 3.56 0 0 0-3.2 1.76V8.8z" />
      </svg>
    ),
  },
  Instagram: {
    brandClass: "text-[#E4405F]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5 sm:size-5 lg:size-6">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
      </svg>
    ),
  },
  YouTube: {
    brandClass: "text-[#FF0000]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5 sm:size-5 lg:size-6">
        <path d="M10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3.07 2.49.1 3.59.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73" />
      </svg>
    ),
  },
};

const DEFAULT_SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/carewellmedicalcentre/",
  },
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/company/care-well-medical-centre",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/carewellmedicalcentre/",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@CareWellMedicalCentre",
  },
] as const;

const headingClass =
  "font-heading text-[0.75rem] font-bold uppercase tracking-wide text-[#0A2540] sm:text-[0.8625rem] lg:text-[1rem]";

const bodyClass =
  "text-[0.78rem] font-bold leading-[1.5] text-slate-700 sm:text-[0.9375rem] lg:text-[1rem] lg:leading-normal";

const aboutBodyClass = bodyClass;

const linkClass =
  "text-[0.78rem] font-bold leading-[1.5] text-slate-700 no-underline transition-colors hover:text-primary hover:no-underline sm:text-[0.9375rem] lg:text-[1rem] lg:leading-normal";

function resolveSocial(
  label: string,
  href: string,
): { label: string; href: string; brandClass: string; icon: ReactNode } | null {
  const known = SOCIAL_ICONS[label];
  if (known) {
    return { label, href, ...known };
  }
  // Fallback: text-only circle using first letter
  return {
    label,
    href,
    brandClass: "text-[#0A2540]",
    icon: (
      <span className="text-xs font-bold" aria-hidden="true">
        {label.slice(0, 1).toUpperCase()}
      </span>
    ),
  };
}

export async function FooterPlaceholder() {
  const year = new Date().getFullYear();
  const cmsFooter = await getHomepageFooter().catch(() => null);

  const quickLinks =
    cmsFooter?.quickLinks.length ? cmsFooter.quickLinks : DEFAULT_QUICK_LINKS;
  const serviceLinks =
    cmsFooter?.serviceLinks.length
      ? cmsFooter.serviceLinks
      : DEFAULT_SERVICE_LINKS;
  const socialSource =
    cmsFooter?.socialLinks.length
      ? cmsFooter.socialLinks
      : DEFAULT_SOCIAL_LINKS;
  const socialLinks = socialSource
    .map((s) => resolveSocial(s.label, s.href))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <footer className="bg-secondary">
      <div className="container-content py-6 sm:py-10 lg:py-[var(--section-padding-y-desktop)]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-4 lg:gap-8">
          {/* ABOUT US */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className={headingClass}>About Us</h2>
            <p className={`mt-1.5 sm:mt-2 lg:mt-4 text-justify ${aboutBodyClass}`}>
              Care Well Medical Centre is a leading cosmetic surgery clinic in
              Delhi, offering advanced aesthetic and reconstructive treatments
              with expert care.
            </p>
            <p className={`mt-1.5 sm:mt-2 lg:mt-4 ${aboutBodyClass}`}>
              House No. 1, NRI Complex, Chittaranjan Park, Delhi
            </p>
            <ul className="mt-3 flex items-center justify-center gap-3 max-[767px]:justify-center sm:mt-2 sm:justify-start sm:gap-3 lg:mt-5 lg:gap-3.5">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`inline-flex size-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-opacity hover:opacity-80 sm:size-12 lg:size-12 ${social.brandClass}`}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h2 className={headingClass}>Quick Links</h2>
            <ul className="mt-1.5 space-y-0 sm:mt-2 lg:mt-4 lg:space-y-2.5">
              {quickLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className={`${linkClass} inline-flex min-h-7 items-center sm:min-h-8 lg:min-h-10`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h2 className={headingClass}>Services</h2>
            <ul className="mt-1.5 space-y-0 sm:mt-2 lg:mt-4 lg:space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className={`${linkClass} inline-flex min-h-7 items-center sm:min-h-8 lg:min-h-10`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* OPENING HOURS */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className={headingClass}>Opening Hours</h2>
            <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 sm:mt-2 sm:gap-x-4 sm:gap-y-1 lg:mt-4 lg:grid-cols-1 lg:gap-y-2">
              {openingHours.map((day) => (
                <li
                  key={day}
                  className={`flex items-baseline justify-between gap-2 lg:gap-4 ${bodyClass}`}
                >
                  <span>{day}</span>
                  <span className="shrink-0 tabular-nums">10:00 - 19:00</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 sm:mt-8 sm:pt-6 lg:mt-12 lg:pt-8">
          <p className="text-[0.78rem] font-medium leading-[1.5] text-slate-700 sm:text-[0.875rem] sm:font-normal lg:text-[1rem] lg:leading-normal">
            © {year} Care Well Medical Centre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

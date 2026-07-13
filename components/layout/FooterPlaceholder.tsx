import Link from "next/link";

const quickLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blogs" },
  { label: "FAQs", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const serviceLinks = [
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

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.09 16.02 2 14.86 2 12.15 2 10.5 3.7 10.5 6.61V9.5H8v4h2.5V22h3.5z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
        <path d="M10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73" />
      </svg>
    ),
  },
] as const;

const headingClass =
  "font-heading text-sm font-bold uppercase tracking-wide text-[#0A2540]";

const linkClass =
  "text-small text-muted-foreground no-underline transition-colors hover:text-primary hover:no-underline";

export function FooterPlaceholder() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary">
      <div className="container-content section-padding">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* ABOUT US */}
          <div>
            <h2 className={headingClass}>About Us</h2>
            <p className="mt-4 text-small text-muted-foreground">
              Care Well Medical Centre is a leading cosmetic surgery clinic in
              Delhi, offering advanced aesthetic and reconstructive treatments
              with expert care.
            </p>
            <p className="mt-4 text-small text-muted-foreground">
              House No. 1, NRI Complex, Chittaranjan Park, Delhi
            </p>
            <ul className="mt-5 flex items-center gap-4">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex text-[#0A2540] transition-colors hover:text-primary"
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
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h2 className={headingClass}>Services</h2>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* OPENING HOURS */}
          <div>
            <h2 className={headingClass}>Opening Hours</h2>
            <ul className="mt-4 space-y-2">
              {openingHours.map((day) => (
                <li
                  key={day}
                  className="flex items-baseline justify-between gap-4 text-small text-muted-foreground"
                >
                  <span>{day}</span>
                  <span className="shrink-0 tabular-nums">10:00 - 19:00</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-caption text-muted-foreground">
            © {year} Care Well Medical Centre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

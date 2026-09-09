import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { DraftPreviewBar } from "@/components/layout/DraftPreviewBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

/** Monospace — rarely used; do not compete with LCP font preload. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const metadataBaseConfig: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "fY6UpMdyowNLXucOjBTc7Pwapc6h3E19iOJNZVBWf-Q",
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Cosmetic surgery, hair transplant, and dermatology clinic in Delhi — Care Well Medical Centre.",
  icons: {
    icon: [{ url: "/images/logo.png", type: "image/png" }],
    apple: [{ url: "/images/logo.png", type: "image/png" }],
    shortcut: "/images/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return metadataBaseConfig;
  return {
    ...metadataBaseConfig,
    robots: { index: false, follow: false },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="flex min-h-full flex-col">
        <DraftPreviewBar />
        {children}
        <FloatingWhatsApp />
        <GoogleAnalytics />
        <SiteAnalytics />
      </body>
    </html>
  );
}

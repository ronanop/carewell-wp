export const SITE_NAME = "Care Well Medical Centre";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carewellmedical.com";

export const DEFAULT_OG_IMAGE = "/images/dr-sandeep-bhasin.jpg";

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  telephone: "+91-9667977499",
  email: "queries@carewellmedicalcentre.in",
  address: {
    streetAddress: "House No. 1, NRI Complex, Chittaranjan Park",
    addressLocality: "New Delhi",
    postalCode: "110019",
    addressCountry: "IN",
  },
} as const;

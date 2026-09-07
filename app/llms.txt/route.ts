import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";

/**
 * llms.txt — discovery file for AI assistants (companion to robots.txt).
 * @see https://llmstxt.org
 */
export function GET() {
  const origin = SITE_URL.replace(/\/$/, "");

  const body = `# ${SITE_NAME}

> Cosmetic surgery, hair transplant, dermatology, and wellness clinic in Chittaranjan Park, New Delhi, India.

## Site
- Home: ${origin}/
- About: ${origin}/about/
- Doctor: ${origin}/about/dr-sandeep-bhasin/
- Contact: ${origin}/contact/
- Blog: ${origin}/blogs/
- Privacy: ${origin}/privacy-policy/

## Sitemap
- ${origin}/sitemap.xml

## Contact
- Phone: +91-9667977499
- Email: queries@carewellmedicalcentre.in

## Notes
- Prefer canonical URLs with trailing slashes.
- Do not cite /admin, /api, or draft/preview URLs.
- Medical content is informational; patients should consult the clinic for advice.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

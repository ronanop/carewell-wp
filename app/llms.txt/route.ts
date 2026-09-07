import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";

/**
 * llms.txt — discovery file for AI assistants (companion to robots.txt).
 * Links must be Markdown `[text](url)` per llmstxt.org / Lighthouse agentic audits.
 * @see https://llmstxt.org
 */
export function GET() {
  const origin = SITE_URL.replace(/\/$/, "");

  const body = `# ${SITE_NAME}

> Cosmetic surgery, hair transplant, dermatology, and wellness clinic in Chittaranjan Park, New Delhi, India.

## Site
- [Home](${origin}/): Clinic homepage
- [About](${origin}/about/): About Care Well Medical Centre
- [Doctor](${origin}/about/dr-sandeep-bhasin/): Dr. Sandeep Bhasin profile
- [Contact](${origin}/contact/): Book a consultation
- [Blog](${origin}/blogs/): Articles and patient education
- [Privacy](${origin}/privacy-policy/): Privacy policy

## Sitemap
- [XML sitemap](${origin}/sitemap.xml)

## Contact
- Phone: [+91-9667977499](tel:+919667977499)
- Email: [queries@carewellmedicalcentre.in](mailto:queries@carewellmedicalcentre.in)

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

import { notFound } from "next/navigation";

import { RichContent } from "@/components/content";

/**
 * Large static HTML fixture covering Gutenberg patterns.
 * No WordPress / GraphQL — visual verification only.
 */
const DEMO_HTML = `
<h1>Content Renderer Verification</h1>
<p>This page exercises the WordPress content rendering engine with representative Gutenberg HTML. It does <strong>not</strong> fetch from WordPress.</p>

<hr class="wp-block-separator"/>

<h2>Typography &amp; inline styles</h2>
<p>Body copy uses Plus Jakarta Sans with editorial line height for medical readability. You can combine <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <code>inline code</code>, H<sub>2</sub>O, and E=mc<sup>2</sup> in a single sentence.</p>
<p>A second paragraph confirms the 24px paragraph spacing rhythm used across service and blog articles.</p>

<h3>Subsection heading (H3)</h3>
<p>Subsections introduce procedure details, candidacy criteria, and recovery guidance without competing with the page title.</p>

<h4>Detail heading (H4)</h4>
<p>Use H4–H6 for nested clinical notes when WordPress authors need finer hierarchy.</p>

<h5>Minor heading (H5)</h5>
<h6>Label heading (H6)</h6>

<blockquote class="wp-block-quote">
  <p>“Our priority is natural-looking results with patient safety at every step.”</p>
  <cite>— Care Well Medical Centre</cite>
</blockquote>

<hr class="wp-block-separator is-style-dots"/>

<h2>Lists</h2>
<ul>
  <li>Hair transplant consultation and graft planning</li>
  <li>PRP and growth-factor therapies
    <ul>
      <li>Session cadence</li>
      <li>Aftercare checklist</li>
    </ul>
  </li>
  <li>Body contouring and skin rejuvenation</li>
</ul>

<ol>
  <li>Clinical assessment</li>
  <li>Personalized treatment plan</li>
  <li>Procedure day protocols</li>
  <li>Follow-up and recovery</li>
</ol>

<h2>Links</h2>
<p>
  Internal path: <a href="/about/">About Care Well</a>.
  External: <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer">World Health Organization</a>.
  Phone: <a href="tel:+919667977499">+91-9667977499</a>.
  Email: <a href="mailto:info@carewellmedicalcentre.com">info@carewellmedicalcentre.com</a>.
</p>

<div class="wp-block-buttons">
  <div class="wp-block-button">
    <a class="wp-block-button__link" href="/contact/">Book consultation</a>
  </div>
  <div class="wp-block-button is-style-outline">
    <a class="wp-block-button__link" href="/about/dr-sandeep-bhasin/">Meet Dr. Bhasin</a>
  </div>
</div>

<h2>Images &amp; captions</h2>
<figure class="wp-block-image aligncenter size-large">
  <img
    src="https://www.carewellmedicalcentre.com/wp-content/uploads/2025/02/care-well-medical-centre-clinic-min-1024x536.jpg"
    alt="Care Well Medical Centre clinic exterior"
    width="1024"
    height="536"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Clinic environment — South Delhi</figcaption>
</figure>

<figure class="wp-block-image alignleft">
  <img
    src="https://www.carewellmedicalcentre.com/wp-content/uploads/2026/01/dr-sandeep-bhasin-cosmetic-aesthetic-surgeon-delhi-355x355.webp"
    alt="Dr Sandeep Bhasin portrait"
    width="355"
    height="355"
    loading="lazy"
  />
  <figcaption>Align left sample</figcaption>
</figure>
<p>Floating images should clear correctly on narrow viewports and never overflow the reading column. This paragraph sits beside the left-aligned figure on desktop.</p>

<figure class="wp-block-gallery has-nested-images columns-3 is-cropped">
  <figure class="wp-block-image">
    <img src="https://www.carewellmedicalcentre.com/wp-content/uploads/2025/05/nishant-hair-transplant-before-and-after-result-carewellmedical.webp" alt="Hair transplant result sample one" loading="lazy" />
  </figure>
  <figure class="wp-block-image">
    <img src="https://www.carewellmedicalcentre.com/wp-content/uploads/2025/02/care-well-medical-centre-clinic-min-300x157.jpg" alt="Clinic interior sample" loading="lazy" />
  </figure>
  <figure class="wp-block-image">
    <img src="https://www.carewellmedicalcentre.com/wp-content/uploads/2026/01/dr-sandeep-bhasin-cosmetic-aesthetic-surgeon-delhi-300x300.webp" alt="Surgeon portrait sample" loading="lazy" />
  </figure>
</figure>

<h2>Comparison table</h2>
<figure class="wp-block-table">
  <table>
    <thead>
      <tr>
        <th>Treatment</th>
        <th>Ideal candidate</th>
        <th>Downtime</th>
        <th>Typical sessions</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>FUE hair transplant</td>
        <td>Stable pattern hair loss</td>
        <td>7–10 days</td>
        <td>1</td>
        <td>Graft planning based on donor density</td>
      </tr>
      <tr>
        <td>PRP hair therapy</td>
        <td>Early thinning</td>
        <td>Same day</td>
        <td>3–6</td>
        <td>Often combined with medical therapy</td>
      </tr>
      <tr>
        <td>Liposuction</td>
        <td>Localized fat deposits</td>
        <td>1–2 weeks</td>
        <td>1</td>
        <td>Compression garment recommended</td>
      </tr>
      <tr>
        <td>Hydrafacial</td>
        <td>Dull or congested skin</td>
        <td>None</td>
        <td>Monthly</td>
        <td>Suitable for most skin types</td>
      </tr>
    </tbody>
  </table>
</figure>

<h2>Code blocks</h2>
<p>Inline reference: <code>wp-block-table</code>.</p>
<pre><code>// Example metadata shape (demo only)
{
  "title": "FUE Hair Transplant in Delhi",
  "slug": "fue"
}
</code></pre>

<h2>Columns</h2>
<div class="wp-block-columns">
  <div class="wp-block-column">
    <h3>Consultation</h3>
    <p>Discuss goals, medical history, and realistic outcomes with the clinical team.</p>
  </div>
  <div class="wp-block-column">
    <h3>Treatment</h3>
    <p>Procedures follow documented safety protocols in a controlled clinical setting.</p>
  </div>
  <div class="wp-block-column">
    <h3>Aftercare</h3>
    <p>Clear written instructions and scheduled follow-ups support recovery.</p>
  </div>
</div>

<h2>YouTube embed</h2>
<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube">
  <div class="wp-block-embed__wrapper">
    <iframe
      title="Care Well Medical Centre introduction"
      src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
  <figcaption>Sample YouTube embed (16:9 responsive)</figcaption>
</figure>

<h2>Google Maps embed</h2>
<figure class="wp-block-embed">
  <div class="wp-block-embed__wrapper">
    <iframe
      title="Care Well Medical Centre location map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.193614817086!2d77.2541877!3d28.533899599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce162f3727511%3A0x3253a3ec46c1b3f2!2sCare%20Well%20Medical%20Centre!5e0!3m2!1sen!2sin!4v1741078044947!5m2!1sen!2sin"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
  <figcaption>Clinic map — Chittaranjan Park, New Delhi</figcaption>
</figure>

<hr class="wp-block-separator"/>

<p><em>End of renderer fixture.</em> Verify headings, spacing, tables, embeds, and images on mobile and desktop.</p>
`;

/**
 * Development-only visual QA page for {@link RichContent}.
 * Not connected to WordPress GraphQL.
 */
export default function ContentRendererDebugPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container-content mb-10">
        <p className="text-label uppercase tracking-[0.14em] text-muted-foreground">
          Debug · development only
        </p>
        <h1 className="mt-3 text-h2 text-foreground">Content renderer</h1>
        <p className="mt-3 max-w-reading text-body text-muted-foreground">
          Hardcoded Gutenberg HTML fixture for visual verification. No
          repository or GraphQL calls.
        </p>
      </div>
      <RichContent html={DEMO_HTML} />
    </main>
  );
}

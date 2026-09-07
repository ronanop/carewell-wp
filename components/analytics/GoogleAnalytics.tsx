import Script from "next/script";
import { Suspense } from "react";

import { GoogleAnalyticsPageViews } from "@/components/analytics/GoogleAnalyticsPageViews";
import { getGaMeasurementId } from "@/lib/analytics/ga";

/**
 * GA4 loader — inactive unless `NEXT_PUBLIC_GA_ID` (G-…) is set.
 * Page views are sent manually so App Router client navigations are counted.
 */
export function GoogleAnalytics() {
  const gaId = getGaMeasurementId();
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageViews />
      </Suspense>
    </>
  );
}

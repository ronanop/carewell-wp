/** Google Analytics 4 helpers (client-safe). */

export function getGaMeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return null;
  return id;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function gaReady(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/** SPA page view for App Router route changes. */
export function trackGaPageView(path: string, title?: string): void {
  if (!gaReady()) return;
  const id = getGaMeasurementId();
  if (!id) return;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
    page_location: `${window.location.origin}${path}`,
    send_to: id,
  });
}

/** Generic GA4 event — never pass PHI / form field values. */
export function trackGaEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (!gaReady()) return;
  window.gtag?.("event", name, params);
}

/** Successful consultation / contact lead (conversion). */
export function trackGaLeadSubmit(params?: {
  form?: string;
  treatment?: string;
}): void {
  trackGaEvent("generate_lead", {
    form: params?.form,
    treatment: params?.treatment,
  });
  trackGaEvent("contact_form_submit", {
    form: params?.form,
    treatment: params?.treatment,
  });
}

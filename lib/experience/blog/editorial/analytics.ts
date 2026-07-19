/**
 * Editorial analytics hooks — standardized events for future Lead Engine / Analytics.
 * No dashboards here; emit only.
 */

export type EditorialAnalyticsEvent =
  | { type: "section_viewed"; sectionId: string; sectionType: string }
  | { type: "faq_expanded"; faqId: string; question: string }
  | { type: "cta_clicked"; ctaId: string; href: string; placement: string }
  | { type: "toc_navigated"; anchorId: string }
  | { type: "image_opened"; src: string }
  | { type: "video_played"; provider: string; src: string }
  | { type: "share_clicked"; channel: string }
  | { type: "reading_completed"; percent: number };

type Listener = (event: EditorialAnalyticsEvent) => void;

const listeners = new Set<Listener>();

export function subscribeEditorialAnalytics(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitEditorialEvent(event: EditorialAnalyticsEvent): void {
  for (const listener of listeners) {
    try {
      listener(event);
    } catch {
      /* never break reading UX */
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("cw:editorial", { detail: event }),
    );
  }
}

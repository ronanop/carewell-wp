/**
 * Experience analytics — event system only (no dashboards yet).
 */

export type ExperienceAnalyticsEvent =
  | { type: "section_viewed"; sectionId: string; sectionType: string; kind: string }
  | { type: "cta_clicked"; ctaId: string; href: string; placement: string; specialty?: string | null }
  | { type: "faq_expanded"; faqId: string }
  | { type: "timeline_viewed"; timelineId: string }
  | { type: "gallery_opened"; galleryId: string }
  | { type: "video_played"; videoId: string }
  | { type: "doctor_clicked"; doctorId: string }
  | { type: "consultation_submitted"; formId: string }
  | { type: "reading_completion"; percent: number; uri: string }
  | { type: "share_clicked"; channel: string };

type Listener = (event: ExperienceAnalyticsEvent) => void;

const listeners = new Set<Listener>();

export function onExperienceEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitExperienceEvent(event: ExperienceAnalyticsEvent): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[experience-analytics]", event.type, event);
  }
  listeners.forEach((l) => {
    try {
      l(event);
    } catch {
      /* never break UX */
    }
  });
}

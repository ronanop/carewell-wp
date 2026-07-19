/**
 * Service trust strip — calm post-hero handoff (Phase 8.1).
 * Presentation only; no new data sources.
 */

export function ServiceTrustStrip({
  treatmentName,
}: {
  treatmentName?: string | null;
}) {
  return (
    <div className="border-b border-border/30 bg-surface-editorial/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-[0.8125rem] text-muted-foreground sm:px-6 lg:px-8">
        <p className="leading-snug">
          {treatmentName
            ? `Clinical guidance for ${treatmentName}`
            : "Evidence-led clinical guidance"}
          <span className="text-border mx-2" aria-hidden>
            ·
          </span>
          Same-day WhatsApp replies
        </p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li>20+ years experience</li>
          <li className="hidden sm:list-item">South Delhi clinic</li>
          <li className="hidden md:list-item">Personalised plans</li>
        </ul>
      </div>
    </div>
  );
}

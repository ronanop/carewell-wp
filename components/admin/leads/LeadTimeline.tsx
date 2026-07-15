import type { LeadTimelineRecord } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

export function LeadTimeline({
  events,
}: {
  events: LeadTimelineRecord[];
}) {
  if (!events.length) {
    return (
      <p className="text-small text-muted-foreground">No activity yet.</p>
    );
  }

  return (
    <ol className="relative space-y-0 border-l border-border pl-6">
      {events.map((event, index) => (
        <li key={event.id} className="relative pb-6 last:pb-0">
          <span
            className={cn(
              "absolute -left-[1.55rem] top-1 size-2.5 rounded-full border-2 border-surface",
              index === 0 ? "bg-primary" : "bg-muted-foreground/40",
            )}
            aria-hidden
          />
          <p className="font-medium text-foreground">{event.title}</p>
          {event.description ? (
            <p className="mt-1 text-small text-muted-foreground">
              {event.description}
            </p>
          ) : null}
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">
            {event.createdAt.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            {event.systemGenerated ? " · system" : " · staff"}
          </p>
        </li>
      ))}
    </ol>
  );
}

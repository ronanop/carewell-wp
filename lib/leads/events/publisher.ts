import "server-only";

/**
 * In-process Lead event publisher (ADR-013).
 * Subscribers can attach later for CRM / WhatsApp / email / SMS / analytics / AI.
 */

export type LeadDomainEvent =
  | {
      type: "LeadCreated";
      leadId: string;
      uuid: string;
      pageSlug?: string | null;
      treatment?: string | null;
      at: string;
    }
  | {
      type: "LeadStatusChanged";
      leadId: string;
      from: string;
      to: string;
      at: string;
    }
  | {
      type: "LeadPriorityChanged";
      leadId: string;
      from: string;
      to: string;
      at: string;
    }
  | {
      type: "LeadAssigned";
      leadId: string;
      assignedStaff?: string | null;
      assignedDoctor?: string | null;
      at: string;
    }
  | {
      type: "LeadNoteAdded";
      leadId: string;
      noteId: string;
      at: string;
    }
  | {
      type: "LeadTimelineCreated";
      leadId: string;
      eventType: string;
      timelineId: string;
      at: string;
    }
  | {
      type: "LeadDuplicateDetected";
      leadId: string;
      duplicateOfIds: string[];
      at: string;
    }
  | {
      type: "FormAnalytics";
      leadId?: string;
      name: string;
      payload?: Record<string, unknown>;
      at: string;
    };

export type LeadEventSubscriber = (
  event: LeadDomainEvent,
) => void | Promise<void>;

const subscribers = new Set<LeadEventSubscriber>();

export function subscribeLeadEvents(subscriber: LeadEventSubscriber): () => void {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
}

export async function publishLeadEvent(
  event: LeadDomainEvent,
): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.info("[LeadEngine]", event.type, event);
  }

  await Promise.all(
    [...subscribers].map(async (subscriber) => {
      try {
        await subscriber(event);
      } catch (error) {
        console.error("[LeadEngine] subscriber failed", error);
      }
    }),
  );
}

import "server-only";

import { subscribeLeadEvents } from "@/lib/leads/events/publisher";
import { notifyLeadCreated } from "@/lib/leads/notifications/emailNotify";

let registered = false;

/** Idempotent — safe to call from lead service / actions bootstrap. */
export function registerLeadNotificationSubscribers(): void {
  if (registered) return;
  registered = true;

  subscribeLeadEvents(async (event) => {
    if (event.type !== "LeadCreated") return;
    // Fire-and-forget semantics already isolated in notifyLeadCreated
    await notifyLeadCreated(event.leadId);
  });
}

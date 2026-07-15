/**
 * Lead Engine public barrel (ADR-013).
 * UI should prefer Server Actions under `lib/leads/actions/**`.
 */

export type {
  ActionResult,
  LeadDetail,
  LeadListFilters,
  LeadListResult,
  LeadNoteRecord,
  LeadPriority,
  LeadRecord,
  LeadStatus,
  LeadTimelineEventType,
  LeadTimelineRecord,
  PreferredContactMethod,
  PreferredTime,
} from "@/lib/leads/types";

export {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
} from "@/lib/leads/types";

export {
  createLeadInputSchema,
  type CreateLeadInput,
} from "@/lib/leads/validators";

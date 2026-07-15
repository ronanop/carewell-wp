/**
 * Lead Engine domain types (ADR-013).
 * Plain TypeScript — no Prisma imports for UI-facing shapes.
 */

export type LeadStatus =
  | "NEW"
  | "CONTACT_ATTEMPTED"
  | "CONTACTED"
  | "INTERESTED"
  | "QUALIFIED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_COMPLETED"
  | "TREATMENT_STARTED"
  | "CONVERTED"
  | "LOST"
  | "SPAM"
  | "ARCHIVED";

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PreferredContactMethod = "PHONE" | "WHATSAPP" | "EMAIL";

export type PreferredTime = "MORNING" | "AFTERNOON" | "EVENING";

export type LeadTimelineEventType =
  | "LEAD_CREATED"
  | "LEAD_UPDATED"
  | "LEAD_ASSIGNED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "INTERNAL_NOTE_ADDED"
  | "DOCTOR_ASSIGNED"
  | "STAFF_ASSIGNED"
  | "EMAIL_SENT"
  | "WHATSAPP_SENT"
  | "SMS_SENT"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_RESCHEDULED"
  | "APPOINTMENT_COMPLETED"
  | "LEAD_CONVERTED"
  | "LEAD_LOST"
  | "SPAM_MARKED"
  | "LEAD_REOPENED"
  | "DUPLICATE_DETECTED"
  | "FORM_ANALYTICS";

export const LEAD_STATUSES: readonly LeadStatus[] = [
  "NEW",
  "CONTACT_ATTEMPTED",
  "CONTACTED",
  "INTERESTED",
  "QUALIFIED",
  "APPOINTMENT_SCHEDULED",
  "APPOINTMENT_COMPLETED",
  "TREATMENT_STARTED",
  "CONVERTED",
  "LOST",
  "SPAM",
  "ARCHIVED",
] as const;

export const LEAD_PRIORITIES: readonly LeadPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export type LeadAttribution = {
  pageTitle?: string | null;
  pageSlug?: string | null;
  pageUri?: string | null;
  pageId?: string | null;
  presentationPageId?: string | null;
  presentationVersion?: string | null;
  template?: string | null;
  theme?: string | null;
  currentUrl?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  screenSize?: string | null;
  language?: string | null;
  country?: string | null;
  ip?: string | null;
  sessionId?: string | null;
  visitorId?: string | null;
  timezone?: string | null;
};

export type LeadRecord = LeadAttribution & {
  id: string;
  uuid: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  treatment: string | null;
  preferredContactMethod: PreferredContactMethod;
  preferredTime: PreferredTime | null;
  leadScore: number;
  status: LeadStatus;
  priority: LeadPriority;
  assignedDoctor: string | null;
  assignedStaff: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  deletedAt: Date | null;
};

export type LeadTimelineRecord = {
  id: string;
  leadId: string;
  eventType: LeadTimelineEventType;
  title: string;
  description: string | null;
  metadata: unknown;
  performedByUserId: string | null;
  systemGenerated: boolean;
  createdAt: Date;
};

export type LeadNoteRecord = {
  id: string;
  leadId: string;
  body: string;
  createdByUserId: string | null;
  createdAt: Date;
};

export type LeadDetail = LeadRecord & {
  timeline: LeadTimelineRecord[];
  notes: LeadNoteRecord[];
};

export type LeadListFilters = {
  status?: LeadStatus | LeadStatus[];
  priority?: LeadPriority | LeadPriority[];
  treatment?: string;
  pageSlug?: string;
  search?: string;
  assignedStaff?: string;
  assignedDoctor?: string;
  from?: Date;
  to?: Date;
  includeDeleted?: boolean;
};

export type LeadListResult = {
  items: LeadRecord[];
  total: number;
  page: number;
  pageSize: number;
};

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string };

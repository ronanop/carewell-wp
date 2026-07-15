import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .transform((value) => value.replace(/\D/g, ""))
  .refine((digits) => digits.length >= 10 && digits.length <= 15, {
    message: "Enter a valid phone number",
  });

const optionalEmail = z
  .union([z.string().trim().email("Enter a valid email"), z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

export const preferredContactMethodSchema = z.enum([
  "PHONE",
  "WHATSAPP",
  "EMAIL",
]);

export const preferredTimeSchema = z.enum(["MORNING", "AFTERNOON", "EVENING"]);

export const leadStatusSchema = z.enum([
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
]);

export const leadPrioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

/** Public consultation form + attribution payload. */
export const createLeadInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(120, "Name is too long"),
  phone: phoneSchema,
  email: optionalEmail,
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => (value ? value : undefined)),
  treatment: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : undefined)),
  preferredContactMethod: preferredContactMethodSchema.default("PHONE"),
  preferredTime: z
    .union([preferredTimeSchema, z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  consent: z.boolean().refine((value) => value === true, {
    message: "Consent is required to submit",
  }),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().default(""),

  pageTitle: z.string().max(300).optional(),
  pageSlug: z.string().max(200).optional(),
  pageUri: z.string().max(500).optional(),
  pageId: z.string().max(64).optional(),
  presentationPageId: z.string().max(64).optional(),
  presentationVersion: z.string().max(64).optional(),
  template: z.string().max(100).optional(),
  theme: z.string().max(100).optional(),
  currentUrl: z.string().max(2000).optional(),
  referrer: z.string().max(2000).optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  device: z.string().max(100).optional(),
  browser: z.string().max(100).optional(),
  os: z.string().max(100).optional(),
  screenSize: z.string().max(50).optional(),
  language: z.string().max(32).optional(),
  country: z.string().max(64).optional(),
  sessionId: z.string().max(128).optional(),
  visitorId: z.string().max(128).optional(),
  timezone: z.string().max(64).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadInputSchema>;

export const updateLeadStatusSchema = z.object({
  leadId: z.string().min(1),
  status: leadStatusSchema,
  note: z.string().trim().max(2000).optional(),
});

export const updateLeadPrioritySchema = z.object({
  leadId: z.string().min(1),
  priority: leadPrioritySchema,
});

export const assignLeadSchema = z.object({
  leadId: z.string().min(1),
  assignedStaff: z.string().trim().max(120).nullable().optional(),
  assignedDoctor: z.string().trim().max(120).nullable().optional(),
});

export const addLeadNoteSchema = z.object({
  leadId: z.string().min(1),
  body: z.string().trim().min(1, "Note cannot be empty").max(5000),
});

export const leadListQuerySchema = z.object({
  status: z.union([leadStatusSchema, z.array(leadStatusSchema)]).optional(),
  priority: z
    .union([leadPrioritySchema, z.array(leadPrioritySchema)])
    .optional(),
  treatment: z.string().optional(),
  pageSlug: z.string().optional(),
  search: z.string().optional(),
  assignedStaff: z.string().optional(),
  assignedDoctor: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  includeDeleted: z.boolean().optional(),
});

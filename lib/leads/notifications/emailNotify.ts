import "server-only";

import nodemailer from "nodemailer";

import { formatLeadCollectionEmail } from "@/lib/leads/notifications/formatLeadEmail";
import { createLeadRepository } from "@/lib/leads/repositories/leadRepository";
import type { LeadRecord } from "@/lib/leads/types";

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

/** Clinic inbox for new-lead alerts (Hostinger mailbox). */
export const DEFAULT_LEAD_NOTIFY_TO = "queries@carewellmedicalcentre.com";

function notifyRecipients(): string[] {
  const raw =
    process.env.LEAD_NOTIFY_TO?.trim() || DEFAULT_LEAD_NOTIFY_TO;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function notifyEnabled(): boolean {
  return Boolean(
    notifyRecipients().length &&
      (smtpConfigured() ||
        process.env.RESEND_API_KEY?.trim() ||
        process.env.LEAD_NOTIFY_WEBHOOK_URL?.trim()),
  );
}

function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

async function sendViaSmtp(input: {
  to: string[];
  from: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST / SMTP_USER / SMTP_PASS required");
  }

  const port = Number(process.env.SMTP_PORT || "465");
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: input.from,
    to: input.to.join(", "),
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}

async function sendViaResend(input: {
  to: string[];
  from: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
  }
}

async function sendViaWebhook(
  lead: LeadRecord,
  payload: {
    subject: string;
    html: string;
    text: string;
    adminUrl: string;
  },
): Promise<void> {
  const url = process.env.LEAD_NOTIFY_WEBHOOK_URL?.trim();
  if (!url) return;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "LeadCreated",
      lead,
      email: payload,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Webhook ${res.status}: ${body.slice(0, 300)}`);
  }
}

/**
 * Email (and optional webhook) a new lead in lead-collection format.
 * Prefer SMTP when configured; otherwise Resend. Never throws to callers.
 */
export async function notifyLeadCreated(leadId: string): Promise<boolean> {
  if (!notifyEnabled()) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[LeadNotify] skipped — set LEAD_NOTIFY_TO and SMTP_* (or RESEND_API_KEY)",
      );
    }
    return false;
  }

  try {
    const lead = await createLeadRepository().findById(leadId);
    if (!lead) {
      console.error("[LeadNotify] lead not found", leadId);
      return false;
    }

    const adminUrl = `${siteBaseUrl()}/admin/leads/${lead.id}`;
    const formatted = formatLeadCollectionEmail(lead, adminUrl);
    const to = notifyRecipients();
    const from =
      process.env.LEAD_NOTIFY_FROM?.trim() ||
      (process.env.SMTP_USER?.trim()
        ? `Care Well Medical Centre <${process.env.SMTP_USER.trim()}>`
        : `Care Well Medical Centre <${DEFAULT_LEAD_NOTIFY_TO}>`);

    let sent = false;

    if (smtpConfigured()) {
      await sendViaSmtp({
        to,
        from,
        subject: formatted.subject,
        html: formatted.html,
        text: formatted.text,
      });
      sent = true;
    } else if (process.env.RESEND_API_KEY?.trim()) {
      await sendViaResend({
        to,
        from,
        subject: formatted.subject,
        html: formatted.html,
        text: formatted.text,
      });
      sent = true;
    }

    if (process.env.LEAD_NOTIFY_WEBHOOK_URL?.trim()) {
      await sendViaWebhook(lead, { ...formatted, adminUrl });
      sent = true;
    }

    return sent;
  } catch (error) {
    console.error("[LeadNotify] failed", error);
    return false;
  }
}

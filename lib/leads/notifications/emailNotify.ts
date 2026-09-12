import "server-only";

import nodemailer from "nodemailer";

import { formatLeadCollectionEmail } from "@/lib/leads/notifications/formatLeadEmail";
import { createLeadRepository } from "@/lib/leads/repositories/leadRepository";
import type { LeadRecord } from "@/lib/leads/types";

/**
 * Hostinger .env import often keeps surrounding quotes as part of the value.
 * Unquoted `#` in dotenv also truncates passwords — we accept both forms.
 */
function env(name: string): string {
  const raw = process.env[name];
  if (raw == null) return "";
  let v = raw.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

function smtpConfigured(): boolean {
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
}

/** Primary From mailbox when LEAD_NOTIFY_FROM / SMTP_USER are unset. */
const DEFAULT_LEAD_NOTIFY_FROM_ADDRESS =
  "queries@carewellmedicalcentre.com";

/** Clinic inboxes for new-lead alerts (.com + .in). */
export const DEFAULT_LEAD_NOTIFY_TO =
  "queries@carewellmedicalcentre.com,queries@carewellmedicalcentre.in";

function notifyRecipients(): string[] {
  const raw = env("LEAD_NOTIFY_TO") || DEFAULT_LEAD_NOTIFY_TO;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function notifyEnabled(): boolean {
  return Boolean(
    notifyRecipients().length &&
      (smtpConfigured() ||
        env("RESEND_API_KEY") ||
        env("LEAD_NOTIFY_WEBHOOK_URL")),
  );
}

function siteBaseUrl(): string {
  return (
    env("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "") ||
    env("AUTH_URL").replace(/\/$/, "") ||
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
  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST / SMTP_USER / SMTP_PASS required");
  }

  const port = Number(env("SMTP_PORT") || "465");
  const secureFlag = env("SMTP_SECURE");
  const secure =
    secureFlag === "true" || secureFlag === "1" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });

  // Send per-recipient so one bad address does not drop the whole alert.
  const errors: string[] = [];
  for (const recipient of input.to) {
    try {
      const info = await transporter.sendMail({
        from: input.from,
        to: recipient,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });
      console.info("[LeadNotify] SMTP accepted", {
        to: recipient,
        messageId: info.messageId,
        response: info.response,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${recipient}: ${msg}`);
      console.error("[LeadNotify] SMTP recipient failed", {
        to: recipient,
        error: msg,
      });
    }
  }

  if (errors.length === input.to.length) {
    throw new Error(`SMTP failed for all recipients: ${errors.join("; ")}`);
  }
  if (errors.length) {
    console.warn("[LeadNotify] SMTP partial failure", { errors });
  }
}

async function sendViaResend(input: {
  to: string[];
  from: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const apiKey = env("RESEND_API_KEY");
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
  const url = env("LEAD_NOTIFY_WEBHOOK_URL");
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
    console.warn(
      "[LeadNotify] skipped — set LEAD_NOTIFY_TO and SMTP_HOST/USER/PASS (or RESEND_API_KEY)",
      {
        hasTo: notifyRecipients().length > 0,
        smtp: smtpConfigured(),
        resend: Boolean(env("RESEND_API_KEY")),
      },
    );
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
      env("LEAD_NOTIFY_FROM") ||
      (env("SMTP_USER")
        ? `Care Well Medical Centre <${env("SMTP_USER")}>`
        : `Care Well Medical Centre <${DEFAULT_LEAD_NOTIFY_FROM_ADDRESS}>`);

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
      console.info("[LeadNotify] SMTP sent", { leadId, to });
    } else if (env("RESEND_API_KEY")) {
      await sendViaResend({
        to,
        from,
        subject: formatted.subject,
        html: formatted.html,
        text: formatted.text,
      });
      sent = true;
      console.info("[LeadNotify] Resend sent", { leadId, to });
    } else {
      console.warn(
        "[LeadNotify] no SMTP/Resend configured — lead saved but email not sent",
        { leadId },
      );
    }

    if (env("LEAD_NOTIFY_WEBHOOK_URL")) {
      await sendViaWebhook(lead, { ...formatted, adminUrl });
      sent = true;
    }

    return sent;
  } catch (error) {
    console.error("[LeadNotify] failed", error);
    return false;
  }
}

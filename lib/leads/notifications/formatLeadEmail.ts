import "server-only";

import type { LeadRecord } from "@/lib/leads/types";

function esc(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr>
  <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;width:38%;vertical-align:top;">${esc(label)}</td>
  <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;vertical-align:top;">${esc(value)}</td>
</tr>`;
}

function textRow(label: string, value: string | null | undefined): string | null {
  if (!value) return null;
  return `${label}: ${value}`;
}

/** Structured lead-collection email (HTML + plain text). */
export function formatLeadCollectionEmail(
  lead: LeadRecord,
  adminUrl: string,
): { subject: string; html: string; text: string } {
  const when = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(lead.createdAt);

  const subject = [
    "New lead",
    lead.treatment ? `· ${lead.treatment}` : null,
    `· ${lead.name}`,
  ]
    .filter(Boolean)
    .join(" ");

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f8fc;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:24px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#0A2540;color:#fff;padding:20px 24px;">
      <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">Care Well · Lead collection</div>
      <h1 style="margin:8px 0 0;font-size:20px;font-weight:600;">New consultation enquiry</h1>
      <p style="margin:8px 0 0;font-size:13px;opacity:0.85;">${esc(when)} IST · Score ${lead.leadScore} · ${esc(lead.priority)}</p>
    </div>
    <div style="padding:8px 12px 20px;">
      <h2 style="margin:16px 12px 8px;font-size:14px;color:#0A2540;text-transform:uppercase;letter-spacing:0.04em;">Patient</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Name", lead.name)}
        ${row("Phone", lead.phone)}
        ${row("Email", lead.email)}
        ${row("Preferred contact", lead.preferredContactMethod)}
        ${row("Preferred time", lead.preferredTime)}
      </table>

      <h2 style="margin:20px 12px 8px;font-size:14px;color:#0A2540;text-transform:uppercase;letter-spacing:0.04em;">Enquiry</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Treatment interest", lead.treatment)}
        ${row("Message", lead.message)}
      </table>

      <h2 style="margin:20px 12px 8px;font-size:14px;color:#0A2540;text-transform:uppercase;letter-spacing:0.04em;">Page &amp; attribution</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Page title", lead.pageTitle)}
        ${row("Page URI", lead.pageUri || lead.pageSlug)}
        ${row("Current URL", lead.currentUrl)}
        ${row("Referrer", lead.referrer)}
        ${row("UTM source", lead.utmSource)}
        ${row("UTM medium", lead.utmMedium)}
        ${row("UTM campaign", lead.utmCampaign)}
        ${row("UTM content", lead.utmContent)}
        ${row("UTM term", lead.utmTerm)}
      </table>

      <h2 style="margin:20px 12px 8px;font-size:14px;color:#0A2540;text-transform:uppercase;letter-spacing:0.04em;">Meta</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Lead ID", lead.uuid)}
        ${row("Device", [lead.device, lead.browser, lead.os].filter(Boolean).join(" · ") || null)}
        ${row("Language", lead.language)}
        ${row("Timezone", lead.timezone)}
        ${row("IP", lead.ip)}
      </table>

      <div style="margin:24px 12px 8px;">
        <a href="${esc(adminUrl)}" style="display:inline-block;background:#0d4f4f;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">
          Open in admin
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = [
    "Care Well — New lead collection",
    `Received: ${when} IST`,
    `Priority: ${lead.priority} · Score: ${lead.leadScore}`,
    "",
    "— Patient —",
    textRow("Name", lead.name),
    textRow("Phone", lead.phone),
    textRow("Email", lead.email),
    textRow("Preferred contact", lead.preferredContactMethod),
    textRow("Preferred time", lead.preferredTime),
    "",
    "— Enquiry —",
    textRow("Treatment", lead.treatment),
    textRow("Message", lead.message),
    "",
    "— Page & attribution —",
    textRow("Page", lead.pageTitle),
    textRow("URI", lead.pageUri || lead.pageSlug),
    textRow("URL", lead.currentUrl),
    textRow("Referrer", lead.referrer),
    textRow("UTM source", lead.utmSource),
    textRow("UTM medium", lead.utmMedium),
    textRow("UTM campaign", lead.utmCampaign),
    "",
    "— Meta —",
    textRow("Lead ID", lead.uuid),
    textRow("Admin", adminUrl),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { subject, html, text };
}

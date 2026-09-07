import "server-only";

import type { LeadRecord } from "@/lib/leads/types";

function esc(value: string | null | undefined): string {
  if (value == null || value === "") return "—";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function display(value: string | null | undefined): string {
  if (value == null || String(value).trim() === "") return "—";
  return String(value).trim();
}

function humanizeToken(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function priorityColor(priority: string): string {
  switch (priority) {
    case "CRITICAL":
      return "#b91c1c";
    case "HIGH":
      return "#c2410c";
    case "LOW":
      return "#64748b";
    default:
      return "#0d4f4f";
  }
}

function row(label: string, valueHtml: string): string {
  return `<tr>
  <td style="padding:10px 14px;border-bottom:1px solid #e8eef5;color:#64748b;width:36%;vertical-align:top;font-size:13px;">${esc(label)}</td>
  <td style="padding:10px 14px;border-bottom:1px solid #e8eef5;color:#0f172a;vertical-align:top;font-size:14px;font-weight:500;">${valueHtml}</td>
</tr>`;
}

function textValue(value: string | null | undefined): string {
  return display(value);
}

function phoneHtml(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  const wa = digits.replace(/^\+/, "");
  return `<a href="tel:${esc(digits)}" style="color:#0d4f4f;text-decoration:none;font-weight:600;">${esc(phone)}</a>
    &nbsp;·&nbsp;
    <a href="https://wa.me/${esc(wa)}" style="color:#128C7E;text-decoration:none;">WhatsApp</a>`;
}

function emailHtml(email: string | null): string {
  if (!email) return "—";
  return `<a href="mailto:${esc(email)}" style="color:#0d4f4f;text-decoration:none;">${esc(email)}</a>`;
}

function linkHtml(url: string | null | undefined): string {
  if (!url) return "—";
  return `<a href="${esc(url)}" style="color:#0d4f4f;word-break:break-all;">${esc(url)}</a>`;
}

/** Structured lead-collection email (HTML + plain text) for clinic inbox. */
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

  const badge = priorityColor(lead.priority);
  const deviceLine =
    [lead.device, lead.browser, lead.os].filter(Boolean).join(" · ") || null;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#eef3f8;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:28px auto;background:#ffffff;border:1px solid #dbe4ef;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(10,37,64,0.06);">
    <div style="background:linear-gradient(135deg,#0A2540 0%,#0d4f4f 100%);color:#fff;padding:22px 26px;">
      <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.78;">Care Well Medical Centre · Lead collection</div>
      <h1 style="margin:10px 0 0;font-size:22px;font-weight:650;line-height:1.3;">New consultation enquiry</h1>
      <p style="margin:10px 0 0;font-size:13px;opacity:0.9;">${esc(when)} IST</p>
      <div style="margin-top:14px;">
        <span style="display:inline-block;background:${badge};color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">${esc(lead.priority)}</span>
        <span style="display:inline-block;margin-left:8px;background:rgba(255,255,255,0.14);color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;">Score ${lead.leadScore}</span>
        <span style="display:inline-block;margin-left:8px;background:rgba(255,255,255,0.14);color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;">${esc(lead.status)}</span>
      </div>
    </div>

    <div style="padding:6px 12px 8px;">
      <h2 style="margin:18px 12px 6px;font-size:12px;color:#0A2540;text-transform:uppercase;letter-spacing:0.08em;">Patient</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", esc(lead.name))}
        ${row("Phone", phoneHtml(lead.phone))}
        ${row("Email", emailHtml(lead.email))}
        ${row("Preferred contact", esc(humanizeToken(lead.preferredContactMethod)))}
        ${row("Preferred time", esc(humanizeToken(lead.preferredTime)))}
      </table>

      <h2 style="margin:22px 12px 6px;font-size:12px;color:#0A2540;text-transform:uppercase;letter-spacing:0.08em;">Enquiry</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Treatment interest", esc(display(lead.treatment)))}
        ${row("Message", esc(display(lead.message)).replace(/\n/g, "<br/>"))}
      </table>

      <h2 style="margin:22px 12px 6px;font-size:12px;color:#0A2540;text-transform:uppercase;letter-spacing:0.08em;">Page &amp; attribution</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Page title", esc(display(lead.pageTitle)))}
        ${row("Page URI", esc(display(lead.pageUri || lead.pageSlug)))}
        ${row("Current URL", linkHtml(lead.currentUrl))}
        ${row("Referrer", linkHtml(lead.referrer))}
        ${row("UTM source", esc(display(lead.utmSource)))}
        ${row("UTM medium", esc(display(lead.utmMedium)))}
        ${row("UTM campaign", esc(display(lead.utmCampaign)))}
        ${row("UTM content", esc(display(lead.utmContent)))}
        ${row("UTM term", esc(display(lead.utmTerm)))}
      </table>

      <h2 style="margin:22px 12px 6px;font-size:12px;color:#0A2540;text-transform:uppercase;letter-spacing:0.08em;">Meta</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Lead ID", `<code style="font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px;">${esc(lead.uuid)}</code>`)}
        ${row("Device", esc(display(deviceLine)))}
        ${row("Screen", esc(display(lead.screenSize)))}
        ${row("Language", esc(display(lead.language)))}
        ${row("Timezone", esc(display(lead.timezone)))}
        ${row("Country", esc(display(lead.country)))}
        ${row("IP", esc(display(lead.ip)))}
      </table>

      <div style="margin:26px 12px 18px;">
        <a href="${esc(adminUrl)}" style="display:inline-block;background:#0d4f4f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:650;">
          Open in admin
        </a>
        <p style="margin:12px 0 0;font-size:12px;color:#64748b;">Automated lead alert · Care Well Medical Centre</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = [
    "Care Well Medical Centre — New lead collection",
    `Received: ${when} IST`,
    `Priority: ${lead.priority} · Score: ${lead.leadScore} · Status: ${lead.status}`,
    "",
    "— Patient —",
    `Name: ${textValue(lead.name)}`,
    `Phone: ${textValue(lead.phone)}`,
    `Email: ${textValue(lead.email)}`,
    `Preferred contact: ${humanizeToken(lead.preferredContactMethod)}`,
    `Preferred time: ${humanizeToken(lead.preferredTime)}`,
    "",
    "— Enquiry —",
    `Treatment: ${textValue(lead.treatment)}`,
    `Message: ${textValue(lead.message)}`,
    "",
    "— Page & attribution —",
    `Page: ${textValue(lead.pageTitle)}`,
    `URI: ${textValue(lead.pageUri || lead.pageSlug)}`,
    `URL: ${textValue(lead.currentUrl)}`,
    `Referrer: ${textValue(lead.referrer)}`,
    `UTM source: ${textValue(lead.utmSource)}`,
    `UTM medium: ${textValue(lead.utmMedium)}`,
    `UTM campaign: ${textValue(lead.utmCampaign)}`,
    `UTM content: ${textValue(lead.utmContent)}`,
    `UTM term: ${textValue(lead.utmTerm)}`,
    "",
    "— Meta —",
    `Lead ID: ${textValue(lead.uuid)}`,
    `Device: ${textValue(deviceLine)}`,
    `Screen: ${textValue(lead.screenSize)}`,
    `Language: ${textValue(lead.language)}`,
    `Timezone: ${textValue(lead.timezone)}`,
    `Country: ${textValue(lead.country)}`,
    `IP: ${textValue(lead.ip)}`,
    `Admin: ${adminUrl}`,
  ].join("\n");

  return { subject, html, text };
}

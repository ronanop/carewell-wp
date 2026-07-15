/**
 * Client-side attribution helpers for consultation capture.
 * Values are plain strings passed into Lead Engine actions — no WP/Prisma imports.
 */

const VISITOR_KEY = "cw_visitor_id";
const SESSION_KEY = "cw_session_id";

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match?.split("=")[1];
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing =
      window.localStorage.getItem(VISITOR_KEY) ?? readCookie(VISITOR_KEY);
    if (existing) {
      window.localStorage.setItem(VISITOR_KEY, existing);
      writeCookie(VISITOR_KEY, existing, 60 * 60 * 24 * 365);
      return existing;
    }
    const id = randomId();
    window.localStorage.setItem(VISITOR_KEY, id);
    writeCookie(VISITOR_KEY, id, 60 * 60 * 24 * 365);
    return id;
  } catch {
    return randomId();
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = randomId();
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return randomId();
  }
}

export function readUtmParams(
  search = typeof window !== "undefined" ? window.location.search : "",
): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
} {
  const params = new URLSearchParams(search);
  const pick = (key: string) => params.get(key)?.trim() || undefined;
  return {
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
    utmContent: pick("utm_content"),
    utmTerm: pick("utm_term"),
  };
}

export function detectDeviceInfo(): {
  device?: string;
  browser?: string;
  os?: string;
  screenSize?: string;
  language?: string;
  timezone?: string;
} {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {};
  }

  const ua = navigator.userAgent;
  let device = "desktop";
  if (/Mobi|Android/i.test(ua)) device = "mobile";
  else if (/Tablet|iPad/i.test(ua)) device = "tablet";

  let browser = "unknown";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  let os = "unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (/iPhone|iPad|iOS/.test(ua)) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return {
    device,
    browser,
    os,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export type PageAttributionInput = {
  pageTitle?: string;
  pageSlug?: string;
  pageUri?: string;
  pageId?: string;
  presentationPageId?: string;
  presentationVersion?: string;
  template?: string;
  theme?: string;
  treatment?: string;
};

export function collectLeadAttribution(page?: PageAttributionInput) {
  const utm = readUtmParams();
  const device = detectDeviceInfo();
  return {
    ...page,
    currentUrl: typeof window !== "undefined" ? window.location.href : undefined,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    ...utm,
    ...device,
    sessionId: getOrCreateSessionId(),
    visitorId: getOrCreateVisitorId(),
  };
}

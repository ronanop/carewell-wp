const DEFAULT_MAP_ZOOM = 15;

/** Official Google Maps embed for Care Well Medical Centre (place pin). */
export const CLINIC_GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.193615624761!2d77.2516127754972!3d28.533899575718802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce162f3727511%3A0x3253a3ec46c1b3f2!2sCare%20Well%20Medical%20Centre!5e0!3m2!1sen!2sin!4v1789046209861!5m2!1sen!2sin";

export function buildGoogleMapsEmbedUrl(
  query: string,
  zoom = DEFAULT_MAP_ZOOM,
): string {
  const q = query.trim();
  if (!q) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
}

/** Resolve iframe `src` — prefers CMS embed URL, then the official clinic pin. */
export function resolveGoogleMapsEmbedUrl(options: {
  mapEmbedUrl?: string | null;
  mapHref?: string | null;
  address?: string | null;
  fallbackQuery?: string;
  zoom?: number;
}): string {
  const explicit = options.mapEmbedUrl?.trim();
  if (explicit) return explicit;

  const hasLocationSignal = Boolean(
    options.mapHref?.trim() ||
      options.address?.trim() ||
      options.fallbackQuery?.trim(),
  );

  return hasLocationSignal ? CLINIC_GOOGLE_MAPS_EMBED_URL : "";
}

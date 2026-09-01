const DEFAULT_CLINIC_MAP_QUERY =
  "Care Well Medical Centre, Chittaranjan Park, New Delhi";

const DEFAULT_MAP_ZOOM = 15;

export function buildGoogleMapsEmbedUrl(
  query: string,
  zoom = DEFAULT_MAP_ZOOM,
): string {
  const q = query.trim();
  if (!q) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
}

function queryFromMapHref(mapHref: string): string | null {
  try {
    const url = new URL(mapHref);
    const q =
      url.searchParams.get("q") ||
      url.searchParams.get("query") ||
      url.searchParams.get("ll");
    if (q) return decodeURIComponent(q.replace(/\+/g, " "));
  } catch {
    // ignore malformed URLs
  }
  return null;
}

/** Resolve iframe `src` — prefers CMS embed URL, then map link query, then address. */
export function resolveGoogleMapsEmbedUrl(options: {
  mapEmbedUrl?: string | null;
  mapHref?: string | null;
  address?: string | null;
  fallbackQuery?: string;
  zoom?: number;
}): string {
  const explicit = options.mapEmbedUrl?.trim();
  if (explicit) return explicit;

  const href = options.mapHref?.trim();
  if (href) {
    const fromHref = queryFromMapHref(href);
    if (fromHref) {
      return buildGoogleMapsEmbedUrl(fromHref, options.zoom);
    }
  }

  const address = options.address?.trim();
  if (address) {
    return buildGoogleMapsEmbedUrl(address, options.zoom);
  }

  if (href) {
    return buildGoogleMapsEmbedUrl(
      options.fallbackQuery ?? DEFAULT_CLINIC_MAP_QUERY,
      options.zoom,
    );
  }

  return "";
}

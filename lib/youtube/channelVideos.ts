/**
 * CareWell YouTube channel videos via Atom RSS (no API key).
 * Channel: https://www.youtube.com/@CareWellMedicalCentre
 *
 * Optional override: YOUTUBE_CHANNEL_ID (defaults to CareWell Medical Centre).
 * YouTube Data API is not required; RSS needs only a channel ID.
 */

export type YouTubeChannelVideo = {
  id: string;
  title: string;
  href: string;
  thumbnailUrl: string;
  publishedAt: string | null;
};

const CAREWELL_CHANNEL_ID = "UCDTth2ilnxyr4c9wfNiwqaA";
const CHANNEL_HANDLE_URL =
  "https://www.youtube.com/@CareWellMedicalCentre/videos";

const DEFAULT_LIMIT = 6;
const REVALIDATE_SECONDS = 3600;

function resolveChannelId(): string {
  const fromEnv = process.env.YOUTUBE_CHANNEL_ID?.trim();
  return fromEnv || CAREWELL_CHANNEL_ID;
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'");
}

function extractTag(block: string, tag: string): string | null {
  const namespaced = new RegExp(
    `<(?:yt:|media:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:yt:|media:)?${tag}>`,
    "i",
  );
  const match = block.match(namespaced);
  if (!match?.[1]) return null;
  return decodeXmlEntities(match[1].trim());
}

function parseFeedEntries(xml: string, limit: number): YouTubeChannelVideo[] {
  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];
  const videos: YouTubeChannelVideo[] = [];

  for (const entry of entries) {
    if (videos.length >= limit) break;

    const id =
      extractTag(entry, "videoId") ??
      entry.match(/yt:video:([A-Za-z0-9_-]{6,})/i)?.[1] ??
      null;
    const title = extractTag(entry, "title");
    if (!id || !title) continue;

    const publishedAt = extractTag(entry, "published");

    videos.push({
      id,
      title,
      href: `https://www.youtube.com/watch?v=${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt,
    });
  }

  return videos;
}

/**
 * Latest uploads from the CareWell YouTube channel (Atom RSS).
 * Returns [] on network/parse failure — callers should hide the section.
 */
export async function listChannelVideos(
  limit = DEFAULT_LIMIT,
): Promise<YouTubeChannelVideo[]> {
  const channelId = resolveChannelId();
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["youtube-channel-videos"] },
      headers: {
        Accept: "application/atom+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      console.error("[CWMC]", {
        context: "youtube.channelVideos",
        status: response.status,
        channelId,
      });
      return [];
    }

    const xml = await response.text();
    return parseFeedEntries(xml, Math.min(Math.max(limit, 1), 15));
  } catch (error) {
    console.error("[CWMC]", {
      context: "youtube.channelVideos",
      channelId,
      message: error instanceof Error ? error.message : "fetch failed",
    });
    return [];
  }
}

export { CHANNEL_HANDLE_URL, CAREWELL_CHANNEL_ID };


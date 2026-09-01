/** Parse a YouTube video ID from a watch/share URL. */
export function youtubeIdFromUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  try {
    const u = new URL(url.trim());

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1).split("/")[0]?.split("?")[0];
      return id || null;
    }

    const fromQuery = u.searchParams.get("v");
    if (fromQuery) return fromQuery;

    const parts = u.pathname.split("/").filter(Boolean);
    const embedIdx = parts.indexOf("embed");
    if (embedIdx >= 0 && parts[embedIdx + 1]) {
      return parts[embedIdx + 1] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

/** Extract a YouTube ID from WordPress / CMS embed HTML (URL-only or iframe). */
export function youtubeIdFromEmbedHtml(html: string): string | null {
  const iframeMatch = html.match(
    /(?:youtube(?:-nocookie)?\.com\/embed\/)([a-zA-Z0-9_-]{11})/i,
  );
  if (iframeMatch?.[1]) return iframeMatch[1];

  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const urlMatch = text.match(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/[^\s<]+|youtu\.be\/[^\s<]+)/i,
  );

  return urlMatch ? youtubeIdFromUrl(urlMatch[0]) : null;
}

/** Replace WordPress wp-block-embed figures with responsive iframe markup. */
export function transformBlogHtmlEmbeds(html: string): string {
  return html.replace(
    /<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<\/figure>/gi,
    (figure) => {
      const id = youtubeIdFromEmbedHtml(figure);
      if (!id) return figure;

      return `<div class="blog-prose__media aspect-video"><iframe class="h-full w-full" src="https://www.youtube.com/embed/${id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
    },
  );
}

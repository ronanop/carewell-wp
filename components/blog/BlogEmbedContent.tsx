import { youtubeIdFromEmbedHtml } from "@/lib/blog/youtubeEmbed";

type BlogEmbedContentProps = {
  html: string;
};

/** Renders CMS embed blocks — upgrades bare YouTube URLs to iframe players. */
export function BlogEmbedContent({ html }: BlogEmbedContentProps) {
  const youtubeId = youtubeIdFromEmbedHtml(html);

  if (youtubeId) {
    return (
      <div className="blog-prose__media aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="blog-prose__embed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

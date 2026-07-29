import type { Metadata } from "next";

import { type HomeYouTubeVideo } from "@/components/home/TestimonialsSection";
import { HomePageView } from "@/components/pages/home/HomePageView";
import { listChannelVideos } from "@/lib/youtube/channelVideos";

/** Homepage ISR — refresh YouTube cards periodically. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Care Well Medical Centre",
  description:
    "Advanced care, thoughtfully delivered. A premium medical centre offering specialist consultations and personalised treatment.",
};

const HOME_YOUTUBE_LIMIT = 6;

function toHomeYouTubeVideos(
  videos: Awaited<ReturnType<typeof listChannelVideos>>,
): HomeYouTubeVideo[] {
  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    href: video.href,
    thumbnailUrl: video.thumbnailUrl,
  }));
}

/**
 * Homepage — thin route. Single implementation lives in HomePageView (ADR-015).
 * Blog cards: empty until Sanity posts are wired.
 * Testimonials: YouTube channel Atom RSS (limit 6).
 */
export default async function HomePage() {
  const youtubeVideos = await listChannelVideos(HOME_YOUTUBE_LIMIT).catch(
    () => [],
  );
  const latestYouTubeVideos = toHomeYouTubeVideos(youtubeVideos);

  return (
    <HomePageView
      mode="public"
      config={null}
      latestBlogPosts={[]}
      latestYouTubeVideos={latestYouTubeVideos}
    />
  );
}

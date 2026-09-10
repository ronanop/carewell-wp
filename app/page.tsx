import type { Metadata } from "next";

import { type HomeYouTubeVideo } from "@/components/home/TestimonialsSection";
import { HomePageView } from "@/components/pages/home/HomePageView";
import { getHomepagePresentationConfig } from "@/lib/sanity/homepage";
import {
  getSanityLatestPosts,
  toHomeBlogPosts,
} from "@/lib/sanity/post";
import { listChannelVideos } from "@/lib/youtube/channelVideos";

/** Homepage ISR — refresh YouTube cards periodically. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Care Well Medical Centre",
  description:
    "Advanced care, thoughtfully delivered. A premium medical centre offering specialist consultations and personalised treatment.",
};

const HOME_YOUTUBE_LIMIT = 6;
const HOME_BLOG_LIMIT = 3;

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
 * Blog cards: latest Sanity posts. Testimonials: YouTube channel Atom RSS.
 * Images / CTAs / service links: optional Sanity `homepage` singleton.
 */
export default async function HomePage() {
  const [youtubeVideos, latestPosts, homepageConfig] = await Promise.all([
    listChannelVideos(HOME_YOUTUBE_LIMIT).catch(() => []),
    getSanityLatestPosts(HOME_BLOG_LIMIT).catch(() => []),
    getHomepagePresentationConfig().catch(() => null),
  ]);
  const latestYouTubeVideos = toHomeYouTubeVideos(youtubeVideos);
  const latestBlogPosts = toHomeBlogPosts(latestPosts);

  return (
    <HomePageView
      mode="public"
      config={homepageConfig}
      latestBlogPosts={latestBlogPosts}
      latestYouTubeVideos={latestYouTubeVideos}
    />
  );
}

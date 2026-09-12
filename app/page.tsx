import type { Metadata } from "next";
import { Suspense } from "react";

import {
  TestimonialsSection,
  type HomeYouTubeVideo,
} from "@/components/home/TestimonialsSection";
import { BlogSection } from "@/components/home/BlogSection";
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

async function HomeTestimonialsSlot() {
  const youtubeVideos = await listChannelVideos(HOME_YOUTUBE_LIMIT).catch(
    () => [],
  );
  return (
    <TestimonialsSection videos={toHomeYouTubeVideos(youtubeVideos)} />
  );
}

async function HomeBlogSlot() {
  const latestPosts = await getSanityLatestPosts(HOME_BLOG_LIMIT).catch(
    () => [],
  );
  const posts = toHomeBlogPosts(latestPosts);
  if (!posts.length) return null;
  return <BlogSection posts={posts} />;
}

/**
 * Homepage — thin route. Hero + config on the critical path; YouTube/blogs stream in.
 * Images / CTAs / service links: optional Sanity `homepage` singleton.
 */
export default async function HomePage() {
  const homepageConfig = await getHomepagePresentationConfig().catch(
    () => null,
  );

  return (
    <HomePageView
      mode="public"
      config={homepageConfig}
      testimonialsSlot={
        <Suspense fallback={<TestimonialsSection videos={[]} />}>
          <HomeTestimonialsSlot />
        </Suspense>
      }
      blogSlot={
        <Suspense fallback={null}>
          <HomeBlogSlot />
        </Suspense>
      }
    />
  );
}

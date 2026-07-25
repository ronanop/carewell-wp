import type { Metadata } from "next";

import {
  type HomeBlogPost,
} from "@/components/home/BlogSection";
import { type HomeYouTubeVideo } from "@/components/home/TestimonialsSection";
import { HomePageView } from "@/components/pages/home/HomePageView";
import { listBlogPosts } from "@/lib/blog/services/blogService";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";
import { listChannelVideos } from "@/lib/youtube/channelVideos";

/** Homepage ISR — refresh latest blog + YouTube cards periodically. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Care Well Medical Centre",
  description:
    "Advanced care, thoughtfully delivered. A premium medical centre offering specialist consultations and personalised treatment.",
};

const HOME_BLOG_LIMIT = 3;
const HOME_YOUTUBE_LIMIT = 6;

function toHomeBlogPosts(
  posts: Awaited<ReturnType<typeof listBlogPosts>>["posts"],
): HomeBlogPost[] {
  return posts.slice(0, HOME_BLOG_LIMIT).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.categories[0]?.name ?? "",
    href: post.uri,
    imageSrc: post.featuredImage?.sourceUrl ?? null,
    imageAlt: post.featuredImage?.altText ?? post.title,
  }));
}

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
 * Blog cards: WordPress posts via WPGraphQL (DATE DESC, limit 3).
 * Testimonials: YouTube channel Atom RSS (limit 6) — no API key required.
 */
export default async function HomePage() {
  const [studioConfig, blogConnection, youtubeVideos] = await Promise.all([
    getCachedPublishedStaticPageConfig("home"),
    listBlogPosts({ first: HOME_BLOG_LIMIT }).catch(() => null),
    listChannelVideos(HOME_YOUTUBE_LIMIT).catch(() => []),
  ]);

  const latestBlogPosts = blogConnection
    ? toHomeBlogPosts(blogConnection.posts)
    : [];
  const latestYouTubeVideos = toHomeYouTubeVideos(youtubeVideos);

  return (
    <HomePageView
      mode="public"
      config={studioConfig}
      latestBlogPosts={latestBlogPosts}
      latestYouTubeVideos={latestYouTubeVideos}
    />
  );
}

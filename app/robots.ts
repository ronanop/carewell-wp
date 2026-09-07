import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/constants";

/** Paths that must stay out of search / AI crawls. */
const PRIVATE = [
  "/admin/",
  "/api/",
  "/dev/",
  "/design/",
  "/sanity-test/",
  "/sanity/service/",
] as const;

type RobotRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
};

function allowPublic(userAgent: string | string[]): RobotRule {
  return {
    userAgent,
    allow: "/",
    disallow: [...PRIVATE],
  };
}

/**
 * Invite Google/Bing + major AI answer-engine crawlers.
 * robots.txt cannot “rank you #1” alone — it ensures bots can find public pages + sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = SITE_URL.replace(/\/$/, "");

  return {
    rules: [
      // Default: index the public site
      allowPublic("*"),
      // Search
      allowPublic([
        "Googlebot",
        "Googlebot-Image",
        "Googlebot-News",
        "Bingbot",
        "Slurp",
        "DuckDuckBot",
        "Baiduspider",
        "YandexBot",
      ]),
      // AI chat / answer engines (explicit allow so they are not treated as blocked)
      allowPublic([
        "GPTBot",
        "ChatGPT-User",
        "OAI-SearchBot",
        "ClaudeBot",
        "anthropic-ai",
        "Google-Extended",
        "GoogleOther",
        "PerplexityBot",
        "Applebot",
        "Applebot-Extended",
        "Bytespider",
        "CCBot",
        "FacebookBot",
        "meta-externalagent",
        "cohere-ai",
        "Diffbot",
        "Amazonbot",
        "YouBot",
      ]),
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ""),
  };
}

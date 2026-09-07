import "server-only";

import { getSanityLiveClient } from "@/lib/sanity/client";

export type ContentDashboardStats = {
  posts: number;
  pages: number;
  services: number;
};

export async function getContentDashboardStats(): Promise<ContentDashboardStats> {
  try {
    const client = await getSanityLiveClient();
    const [posts, pages, services] = await Promise.all([
      client.fetch<number>(`count(*[_type == "post" && defined(slug.current)])`),
      client.fetch<number>(`count(*[_type == "page" && defined(slug.current)])`),
      client.fetch<number>(`count(*[_type == "service" && defined(slug.current)])`),
    ]);
    return { posts, pages, services };
  } catch {
    return { posts: 0, pages: 0, services: 0 };
  }
}

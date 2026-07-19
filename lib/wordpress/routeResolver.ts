import "server-only";

import { NotFoundError } from "@/lib/wordpress/errors";
import { getBlogRepository } from "@/lib/wordpress/repositories/blogRepository";
import { getPageRepository } from "@/lib/wordpress/repositories/pageRepository";
import {
  isHandcraftedPath,
  normalizeUri,
} from "@/lib/wordpress/routeUtils";
import type { BlogPost } from "@/types/blog";
import type { Page } from "@/types/page";

/**
 * Result of resolving a public URL against WordPress.
 * Extend this union here only — keep `app/[...uri]/page.tsx` stable.
 */
export type RouteResult =
  | {
      type: "page";
      page: Page;
    }
  | {
      type: "post";
      post: BlogPost;
    }
  | {
      type: "not-found";
    };

/**
 * Resolves a catch-all URI: Page first, then Post (Blog Engine).
 */
export async function resolveRoute(uri: string): Promise<RouteResult> {
  if (uri === "/" || isHandcraftedPath(uri)) {
    return { type: "not-found" };
  }

  try {
    const page = await getPageRepository().getPageByUri(uri);
    return { type: "page", page };
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      throw error;
    }
  }

  try {
    const post = await getBlogRepository().getPostByUri(uri);
    return { type: "post", post };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { type: "not-found" };
    }
    throw error;
  }
}

export async function resolveRouteFromSegments(
  segments: readonly string[] | undefined | null,
): Promise<RouteResult> {
  return resolveRoute(normalizeUri(segments));
}

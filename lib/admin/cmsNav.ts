import {
  getSanityPostsList,
  postPublicPath,
} from "@/lib/sanity/post";
import {
  getSanityPagesList,
  pagePublicPath,
} from "@/lib/sanity/page";

export type AdminNavChild = {
  id: string;
  label: string;
  href: string;
  slug: string;
};

export async function getAdminBlogNavChildren(): Promise<AdminNavChild[]> {
  const posts = await getSanityPostsList({ live: true });
  return posts.map((post) => ({
    id: post._id,
    label: post.title || post.slug || "Untitled",
    href: postPublicPath(post),
    slug: post.slug || "",
  }));
}

export async function getAdminPageNavChildren(): Promise<AdminNavChild[]> {
  const pages = await getSanityPagesList({ live: true });
  return pages.map((page) => ({
    id: page._id,
    label: page.title || page.slug || "Untitled",
    href: pagePublicPath(page),
    slug: page.slug || "",
  }));
}

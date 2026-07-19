import { redirect } from "next/navigation";

/**
 * Legacy /blog archive → canonical /blogs listing.
 */
export default function BlogRedirectPage() {
  redirect("/blogs");
}

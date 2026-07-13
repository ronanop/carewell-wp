import { redirect } from "next/navigation";

/**
 * Experience Builder renamed to Page Studio.
 * Entry point is Pages → Open Studio.
 */
export default function LegacyExperienceBuilderRedirect() {
  redirect("/admin/pages");
}

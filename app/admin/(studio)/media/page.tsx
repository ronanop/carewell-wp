import { redirect } from "next/navigation";

/** Legacy route — AMS lives at /admin/assets. */
export default function AdminMediaRedirectPage() {
  redirect("/admin/assets");
}

import { MessageSquareQuote } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminTestimonialsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Google reviews, video reviews, manual reviews, and featured selections."
      />
      <ModuleEmptyState
        icon={MessageSquareQuote}
        title="Review presentation"
        description="Curate which reviews appear on the site and how they are featured. Not a WordPress post editor."
      />
    </div>
  );
}

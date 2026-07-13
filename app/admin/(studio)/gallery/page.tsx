import { Images } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminGalleryPage() {
  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Before/after, procedure, and hospital galleries — ordering and categorization for the frontend."
      />
      <ModuleEmptyState
        icon={Images}
        title="Gallery behaviour"
        description="Organize presentation galleries and ordering. Media files continue to live in WordPress or the media module."
      />
    </div>
  );
}

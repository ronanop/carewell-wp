import { FolderOpen } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminMediaPage() {
  return (
    <div>
      <AdminPageHeader
        title="Media"
        description="Studio image library for presentation assets — search, folders, alt text, compression."
      />
      <ModuleEmptyState
        icon={FolderOpen}
        title="Presentation media"
        description="UploadThing integration lands in a later phase. WordPress media library remains the CMS media source."
      />
    </div>
  );
}

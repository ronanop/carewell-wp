import { Settings } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Website, cache, GraphQL connectivity, integrations, and analytics for Studio operators."
      />
      <ModuleEmptyState
        icon={Settings}
        title="Studio settings"
        description="Operational settings for Experience Studio. Public site env vars remain in deployment configuration."
      />
    </div>
  );
}

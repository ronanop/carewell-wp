import { Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminUsersPage() {
  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="RBAC for Experience Studio — Admin, Editor, Marketing, Developer."
      />
      <ModuleEmptyState
        icon={Users}
        title="Studio access control"
        description="Invite and manage Studio users. This is not patient authentication and does not affect the public website."
      />
    </div>
  );
}

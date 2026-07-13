import { Stethoscope } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminDoctorsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Doctors"
        description="Presentation profiles — credentials, imagery, consultation CTAs. Doctor articles remain in WordPress."
      />
      <ModuleEmptyState
        icon={Stethoscope}
        title="Doctor presentation"
        description="Manage display profiles, availability notes, and consultation CTAs without editing WordPress doctor content."
      />
    </div>
  );
}

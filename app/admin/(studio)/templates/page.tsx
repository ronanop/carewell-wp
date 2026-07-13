import { LayoutTemplate } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminTemplatesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Templates"
        description="Hair Treatment, Plastic Surgery, Skin, Wellness, Doctor, Blog, and Generic defaults."
      />
      <ModuleEmptyState
        icon={LayoutTemplate}
        title="Experience templates"
        description="Each template defines presentation defaults. Pages inherit them and override only what they need."
      />
    </div>
  );
}

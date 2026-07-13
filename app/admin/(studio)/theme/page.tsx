import { Palette } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminThemePage() {
  return (
    <div>
      <AdminPageHeader
        title="Theme"
        description="Logo, favicon, colors, footer, announcement bar, social links, and contact details."
      />
      <ModuleEmptyState
        icon={Palette}
        title="Brand presentation"
        description="Site-wide theme configuration stored in PostgreSQL. Uses Care Well design tokens — no random palettes."
      />
    </div>
  );
}

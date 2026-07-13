import { Megaphone } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModuleEmptyState } from "@/components/admin/ModuleEmptyState";

export default function AdminCtaPage() {
  return (
    <div>
      <AdminPageHeader
        title="CTA Manager"
        description="Global, per-template, and per-page calls to action — Book, WhatsApp, Call, sticky bottom."
      />
      <ModuleEmptyState
        icon={Megaphone}
        title="Conversion controls"
        description="Configure CTA copy, destinations, and sticky behaviour without touching Gutenberg content."
      />
    </div>
  );
}

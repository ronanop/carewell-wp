import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConsultationSettingsForm } from "@/components/admin/settings/ConsultationSettingsForm";
import { createConsultationSettingsRepository } from "@/lib/experience/repositories/consultationSettingsRepository";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings =
    await createConsultationSettingsRepository().getOrCreateDefault();

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Global Experience Studio settings. Consultation Sidebar is page chrome — injected by the renderer on service pages."
      />
      <ConsultationSettingsForm initial={settings} />
    </div>
  );
}

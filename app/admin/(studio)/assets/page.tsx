import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AssetManager } from "@/components/admin/assets/AssetManager";

export default function AdminAssetsPage() {
  return (
    <div className="flex min-h-0 flex-col gap-4">
      <AdminPageHeader
        title="Assets"
        description="Enterprise asset manager — WordPress stores files; Experience Studio is the only editor interface."
      />
      <AssetManager mode="page" />
    </div>
  );
}

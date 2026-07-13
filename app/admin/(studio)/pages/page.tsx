import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PagesTable } from "@/components/admin/pages/PagesTable";
import { listStudioPages } from "@/lib/experience/services/pageListService";

export default async function AdminPagesPage() {
  const pages = await listStudioPages();

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Sync WordPress page metadata, then open Page Studio to configure presentation. Article content is never edited here."
      />
      <PagesTable initialPages={pages} />
    </div>
  );
}

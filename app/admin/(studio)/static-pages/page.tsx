import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StaticPagesTable } from "@/components/admin/static-pages/StaticPagesTable";
import { createStaticPageProvider } from "@/lib/experience/providers/staticPageProvider";
import { listStaticStudioPages } from "@/lib/experience/services/staticPageService";

/**
 * Static pages list — PageProvider.list() for catalog; service for DB status.
 */
export default async function AdminStaticPagesPage() {
  const provider = createStaticPageProvider();
  await provider.list();
  const pages = await listStaticStudioPages();

  return (
    <div>
      <AdminPageHeader
        title="Static Pages"
        description="Handcrafted pages edited as the same React components that power the public site. Presentation overrides only — never a second homepage."
      />
      <StaticPagesTable initialPages={pages} />
    </div>
  );
}

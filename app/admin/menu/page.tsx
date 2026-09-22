import { MegaMenuAdminEditor } from "@/components/admin/MegaMenuAdminEditor";
import { requireAdminSession } from "@/lib/admin/requireSession";
import { getMegaMenuCategoriesFresh } from "@/lib/navigation/getMegaMenu";

export const metadata = {
  title: "Services menu | Care Well Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMenuPage() {
  const session = await requireAdminSession();
  const categories = await getMegaMenuCategoriesFresh();
  const role = session.user.role;
  const canEdit =
    role === "ADMIN" || role === "EDITOR" || role === "DEVELOPER";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
          Services mega menu
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Edit Services menu links here. Category panel photos are managed in{" "}
          <strong>Sanity Studio → Services mega menu</strong> (496×620, 4:5).
          Sanity images override local paths when set. Link changes persist in
          the database and show on the public navbar.
        </p>
      </div>

      <MegaMenuAdminEditor
        initialCategories={categories}
        canEdit={canEdit}
      />
    </div>
  );
}

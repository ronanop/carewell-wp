import { MegaMenuAdminEditor } from "@/components/admin/MegaMenuAdminEditor";
import { requireAdminSession } from "@/lib/admin/requireSession";
import { getMegaMenuCategories } from "@/lib/navigation/getMegaMenu";

export const metadata = {
  title: "Services menu | Care Well Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMenuPage() {
  const session = await requireAdminSession();
  const categories = await getMegaMenuCategories();
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
          Set the page URL next to each Services menu item. Saved links persist
          in the database and appear on the public site navbar (desktop mega
          menu and mobile Services list).
        </p>
      </div>

      <MegaMenuAdminEditor
        initialCategories={categories}
        canEdit={canEdit}
      />
    </div>
  );
}

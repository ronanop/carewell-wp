import { requireAdminSession } from "@/lib/admin/requireSession";
import { listAdminUsers } from "@/lib/admin/userActions";
import {
  CreateUserForm,
  UserActiveToggle,
} from "@/components/admin/users/UserForms";
import { formatAdminDate } from "@/lib/leads/adminSerialize";

export const metadata = {
  title: "Users | Care Well Admin",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const session = await requireAdminSession();
  const canManage = session.user.role === "ADMIN";
  const users = await listAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
          Staff users
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Accounts that can sign in to this admin panel.
        </p>
      </div>

      <CreateUserForm canManage={canManage} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-[#0A2540]">{user.email}</div>
                  {user.name ? (
                    <div className="text-xs text-slate-500">{user.name}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-slate-700">{user.role}</td>
                <td className="px-4 py-3 text-slate-500">
                  {formatAdminDate(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <UserActiveToggle user={user} canManage={canManage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminToastProvider } from "@/components/admin/AdminToast";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export interface AdminShellProps {
  children: ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
}

/**
 * Experience Studio chrome — sidebar + top bar.
 */
export function AdminShell({
  children,
  userName,
  userEmail,
  userRole,
}: AdminShellProps) {
  return (
    <AdminToastProvider>
      <div className="flex min-h-screen bg-muted/40">
        <div className="sticky top-0 hidden h-screen md:block">
          <AdminSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
          />
          <main className="flex-1 overflow-x-hidden p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}

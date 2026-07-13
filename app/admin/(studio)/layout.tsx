import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminShell
      userName={session?.user?.name}
      userEmail={session?.user?.email}
      userRole={session?.user?.role}
    >
      {children}
    </AdminShell>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createAdminUserAction,
  updateAdminUserAction,
  type AdminUserRow,
} from "@/lib/admin/userActions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLES = ["ADMIN", "EDITOR", "MARKETING", "DEVELOPER"] as const;

export function CreateUserForm({ canManage }: { canManage: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  if (!canManage) {
    return (
      <p className="text-sm text-slate-500">
        Only ADMIN users can create staff accounts.
      </p>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const fd = new FormData(event.currentTarget);
        setError(null);
        setOk(null);
        startTransition(async () => {
          const result = await createAdminUserAction({
            email: String(fd.get("email") || ""),
            name: String(fd.get("name") || "") || undefined,
            password: String(fd.get("password") || ""),
            role: String(fd.get("role") || "EDITOR"),
          });
          if (!result.ok) {
            setError(result.message);
            return;
          }
          setOk(result.message);
          event.currentTarget.reset();
          router.refresh();
        });
      }}
    >
      <h2 className="font-heading text-base font-semibold text-[#0A2540] sm:col-span-2">
        Add staff user
      </h2>
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <input
        name="name"
        type="text"
        placeholder="Name (optional)"
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="Password (min 8)"
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <select
        name="role"
        defaultValue="EDITOR"
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-red-700 sm:col-span-2" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="text-sm text-emerald-700 sm:col-span-2" role="status">
          {ok}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "sm:col-span-2 sm:w-fit",
        )}
      >
        {pending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}

export function UserActiveToggle({
  user,
  canManage,
}: {
  user: AdminUserRow;
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!canManage) {
    return (
      <span className="text-xs text-slate-500">
        {user.active ? "Active" : "Inactive"}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "text-xs",
      )}
      onClick={() => {
        startTransition(async () => {
          await updateAdminUserAction({
            userId: user.id,
            active: !user.active,
          });
          router.refresh();
        });
      }}
    >
      {user.active ? "Deactivate" : "Activate"}
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  addLeadNoteAction,
  assignLeadAction,
  updateLeadPriorityAction,
  updateLeadStatusAction,
} from "@/lib/leads/actions/leadActions";
import type { LeadPriority, LeadStatus } from "@/lib/leads/types";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LeadStatusPriorityForm({
  leadId,
  status,
  priority,
  canWrite,
}: {
  leadId: string;
  status: LeadStatus;
  priority: LeadPriority;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!canWrite) {
    return (
      <p className="text-sm text-slate-500">
        Your role is read-only for lead updates.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const nextStatus = String(form.get("status")) as LeadStatus;
        const nextPriority = String(form.get("priority")) as LeadPriority;
        setMessage(null);
        setError(null);
        startTransition(async () => {
          const statusResult = await updateLeadStatusAction({
            leadId,
            status: nextStatus,
          });
          if (!statusResult.ok) {
            setError(statusResult.message);
            return;
          }
          const priorityResult = await updateLeadPriorityAction({
            leadId,
            priority: nextPriority,
          });
          if (!priorityResult.ok) {
            setError(priorityResult.message);
            return;
          }
          setMessage("Saved");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            {LEAD_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="priority"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={priority}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            {LEAD_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants({ variant: "default", size: "sm" }))}
      >
        {pending ? "Saving…" : "Update status & priority"}
      </button>
    </form>
  );
}

export function LeadNoteForm({
  leadId,
  canWrite,
}: {
  leadId: string;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!canWrite) return null;

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const body = String(formData.get("body") || "").trim();
        if (!body) return;
        setError(null);
        startTransition(async () => {
          const result = await addLeadNoteAction({ leadId, body });
          if (!result.ok) {
            setError(result.message);
            return;
          }
          form.reset();
          router.refresh();
        });
      }}
    >
      <label htmlFor="note-body" className="sr-only">
        Add note
      </label>
      <textarea
        id="note-body"
        name="body"
        required
        rows={3}
        placeholder="Internal note (visible to staff only)"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
      />
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
      >
        {pending ? "Adding…" : "Add note"}
      </button>
    </form>
  );
}

export function LeadAssignForm({
  leadId,
  assignedStaff,
  assignedDoctor,
  canWrite,
}: {
  leadId: string;
  assignedStaff: string | null;
  assignedDoctor: string | null;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!canWrite) {
    return (
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-slate-500">Staff</dt>
          <dd>{assignedStaff || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Doctor</dt>
          <dd>{assignedDoctor || "—"}</dd>
        </div>
      </dl>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const fd = new FormData(event.currentTarget);
        setError(null);
        setMessage(null);
        startTransition(async () => {
          const result = await assignLeadAction({
            leadId,
            assignedStaff: String(fd.get("assignedStaff") || "").trim() || null,
            assignedDoctor:
              String(fd.get("assignedDoctor") || "").trim() || null,
          });
          if (!result.ok) {
            setError(result.message);
            return;
          }
          setMessage("Assignment saved");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="assignedStaff"
            className="mb-1 block text-xs font-medium text-slate-600"
          >
            Assigned staff
          </label>
          <input
            id="assignedStaff"
            name="assignedStaff"
            defaultValue={assignedStaff || ""}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="assignedDoctor"
            className="mb-1 block text-xs font-medium text-slate-600"
          >
            Assigned doctor
          </label>
          <input
            id="assignedDoctor"
            name="assignedDoctor"
            defaultValue={assignedDoctor || ""}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
          />
        </div>
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
      >
        {pending ? "Saving…" : "Save assignment"}
      </button>
    </form>
  );
}

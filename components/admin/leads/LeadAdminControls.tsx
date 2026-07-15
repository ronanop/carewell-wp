"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  addLeadNoteAction,
  assignLeadAction,
  updateLeadPriorityAction,
  updateLeadStatusAction,
} from "@/lib/leads/actions/leadActions";
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/leads/types";
import { cn } from "@/lib/utils";

const fieldClassName = cn(
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2",
  "text-small text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

export function LeadAdminControls({
  leadId,
  status,
  priority,
  assignedStaff,
  assignedDoctor,
}: {
  leadId: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedStaff: string | null;
  assignedDoctor: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [staff, setStaff] = useState(assignedStaff ?? "");
  const [doctor, setDoctor] = useState(assignedDoctor ?? "");

  function refresh(resultMessage: string) {
    setMessage(resultMessage);
    router.refresh();
  }

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <div>
        <label htmlFor="lead-status" className="text-small font-medium">
          Status
        </label>
        <select
          id="lead-status"
          className={fieldClassName}
          defaultValue={status}
          disabled={pending}
          onChange={(event) => {
            const next = event.target.value as LeadStatus;
            startTransition(async () => {
              const result = await updateLeadStatusAction({
                leadId,
                status: next,
              });
              refresh(result.message);
            });
          }}
        >
          {LEAD_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lead-priority" className="text-small font-medium">
          Priority
        </label>
        <select
          id="lead-priority"
          className={fieldClassName}
          defaultValue={priority}
          disabled={pending}
          onChange={(event) => {
            const next = event.target.value as LeadPriority;
            startTransition(async () => {
              const result = await updateLeadPriorityAction({
                leadId,
                priority: next,
              });
              refresh(result.message);
            });
          }}
        >
          {LEAD_PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-staff" className="text-small font-medium">
            Assigned staff
          </label>
          <input
            id="lead-staff"
            className={fieldClassName}
            value={staff}
            onChange={(event) => setStaff(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lead-doctor" className="text-small font-medium">
            Assigned doctor
          </label>
          <input
            id="lead-doctor"
            className={fieldClassName}
            value={doctor}
            onChange={(event) => setDoctor(event.target.value)}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await assignLeadAction({
              leadId,
              assignedStaff: staff.trim() || null,
              assignedDoctor: doctor.trim() || null,
            });
            refresh(result.message);
          });
        }}
      >
        Save assignment
      </Button>

      <div>
        <label htmlFor="lead-note" className="text-small font-medium">
          Internal note
        </label>
        <textarea
          id="lead-note"
          rows={3}
          className={fieldClassName}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <Button
          type="button"
          className="mt-2"
          disabled={pending || !note.trim()}
          onClick={() => {
            startTransition(async () => {
              const result = await addLeadNoteAction({
                leadId,
                body: note.trim(),
              });
              if (result.ok) setNote("");
              refresh(result.message);
            });
          }}
        >
          Add note
        </Button>
      </div>

      {message ? (
        <p className="text-small text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}

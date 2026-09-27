"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { adminRequest } from "./api";
import { statusLabel } from "./format";
import { Button, Field, inputClass } from "./ui";

export function EnquiryUpdateForm({ id, status, internalNotes }: { id: string; status: string; internalNotes: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ status, internalNotes });
  const [state, setState] = useState<{ busy: boolean; error: string | null; saved: boolean }>({ busy: false, error: null, saved: false });
  const dirty = form.status !== status || form.internalNotes !== internalNotes;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ busy: true, error: null, saved: false });
    const res = await adminRequest(`/api/admin/enquiries/${id}`, "PATCH", form);
    if (!res.ok) return setState({ busy: false, error: res.error, saved: false });
    setState({ busy: false, error: null, saved: true });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Status" htmlFor="enquiry-status">
        <select
          id="enquiry-status"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className={inputClass}
        >
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Internal notes" htmlFor="enquiry-notes" hint="Visible to the team only. Never sent to the guest.">
        <textarea
          id="enquiry-notes"
          rows={8}
          value={form.internalNotes}
          onChange={(e) => setForm((f) => ({ ...f, internalNotes: e.target.value }))}
          className={inputClass}
        />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm font-bold text-clay">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={state.busy || !dirty}>
          {state.busy ? "Saving…" : "Save"}
        </Button>
        {state.saved && !dirty && (
          <span role="status" className="text-sm text-nordic">
            Saved.
          </span>
        )}
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { adminRequest } from "./api";
import { Button, inputClass } from "./ui";

/** Cancel a consultation: asks for confirmation inline, with an optional note that goes into the guest's email. */
export function CancelBookingButton({ bookingId, guestName, when }: { bookingId: string; guestName: string; when: string }) {
  const router = useRouter();
  const noteId = useId();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  async function cancel() {
    setBusy(true);
    setError(null);
    const res = await adminRequest<{ notified?: boolean }>(`/api/admin/bookings/${bookingId}`, "PATCH", { cancelled: true, note: note.trim() || undefined });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    startTransition(() => router.refresh());
  }

  if (!open) {
    return (
      <Button variant="danger" onClick={() => setOpen(true)}>
        Cancel
      </Button>
    );
  }
  const pending = busy || isRefreshing;
  return (
    <div role="group" aria-label={`Cancel ${guestName}'s consultation`} className="w-72 space-y-2 rounded-hair border border-clay/30 bg-blush/10 p-3 text-sm">
      <p>
        Cancel <strong>{guestName}</strong>&apos;s consultation on {when} IST? The slot reopens for booking, and the guest is emailed (and sent a WhatsApp
        message) with a link to choose a new time.
      </p>
      <label htmlFor={noteId} className="block text-xs font-bold text-nordic">
        Note to guest (optional)
      </label>
      <textarea
        id={noteId}
        rows={3}
        maxLength={1000}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Dr. Thrivikraman is travelling that week. We're sorry for the change."
        className={inputClass}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="danger" onClick={cancel} disabled={pending}>
          {pending ? "Cancelling…" : "Cancel and notify guest"}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
          Keep booking
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs font-bold text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

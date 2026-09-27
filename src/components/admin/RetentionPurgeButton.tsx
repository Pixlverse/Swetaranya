"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adminRequest } from "./api";
import { Button } from "./ui";

type Result = { expired: number; stalePending: number; deleted: number; failed: number };

/** Runs the medical report retention purge now (it also runs on a schedule) and reports what it did. */
export function RetentionPurgeButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  async function run() {
    if (!window.confirm("Permanently delete every medical report past its retention date, and any upload left incomplete for over 24 hours? This cannot be undone.")) return;
    setBusy(true);
    setMessage(null);
    const res = await adminRequest<Result>("/api/admin/reports/purge", "POST", {});
    setBusy(false);
    if (!res.ok) return setMessage({ tone: "error", text: res.error });
    const r = res.data;
    const text =
      r.deleted === 0 && r.failed === 0
        ? "Nothing was due for deletion."
        : `${r.deleted} report${r.deleted === 1 ? "" : "s"} deleted (${r.expired} past retention, ${r.stalePending} incomplete).${r.failed ? ` ${r.failed} could not be deleted and will be retried.` : ""}`;
    setMessage({ tone: r.failed ? "error" : "ok", text });
    startTransition(() => router.refresh());
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <Button variant="secondary" onClick={run} disabled={busy || isRefreshing}>
        {busy ? "Purging…" : "Run retention purge now"}
      </Button>
      {message && (
        <span role={message.tone === "error" ? "alert" : "status"} className={`max-w-xs text-right text-xs ${message.tone === "error" ? "font-bold text-clay" : "text-nordic"}`}>
          {message.text}
        </span>
      )}
    </span>
  );
}

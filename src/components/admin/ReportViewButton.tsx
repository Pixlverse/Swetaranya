"use client";

import { useState } from "react";
import { adminRequest } from "./api";
import { Button } from "./ui";

/** Physician-only. Requests a fresh signed URL each time; the link expires in a few minutes. */
export function ReportViewButton({ reportId }: { reportId: string }) {
  const [state, setState] = useState<{ busy: boolean; url: string | null; error: string | null }>({ busy: false, url: null, error: null });

  async function request() {
    setState({ busy: true, url: null, error: null });
    const res = await adminRequest<{ url: string; expiresIn: number }>(`/api/admin/reports/${reportId}/signed-url`, "POST");
    setState(res.ok ? { busy: false, url: res.data.url, error: null } : { busy: false, url: null, error: res.error });
  }

  return (
    <div className="flex flex-col items-end gap-1 text-right">
      {state.url ? (
        <a href={state.url} target="_blank" rel="noreferrer noopener" className="text-sm font-bold text-nordic underline decoration-keppel underline-offset-4">
          Open report (link expires in 5 minutes)
        </a>
      ) : (
        <Button variant="secondary" onClick={request} disabled={state.busy}>
          {state.busy ? "Preparing…" : "View report"}
        </Button>
      )}
      {state.error && (
        <span role="alert" className="max-w-xs text-xs font-bold text-clay">
          {state.error}
        </span>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { checkReportFile, uploadReport } from "@/lib/upload-client";
import { DrawnCheck } from "./Field";

/** Private report upload from the link sent after booking. One link, one file. */
export function StandaloneUploader({ token, retentionDays }: { token: string; retentionDays: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please choose a file.");
    if (!consent) return setError("Please agree to how we store your report.");
    setError(null);
    setProgress(0);
    try {
      const r = await uploadReport(token, file, setProgress);
      setDone(new Date(r.retentionExpiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
    } catch (err) {
      setProgress(null);
      setError((err as Error).message);
    }
  };

  if (done)
    return (
      <div role="status">
        <DrawnCheck className="h-16 w-16 text-keppel" />
        <h2 className="mt-6 text-[2rem]">Your report is with the physician.</h2>
        <p className="mt-3 text-ink/75">It is stored privately and will be deleted on {done}.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label htmlFor="report" className="block font-bold text-nordic">Report file</label>
        <p className="text-[0.85rem] text-ink/60">PDF, JPG or PNG, up to 15 MB.</p>
        <input
          id="report"
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            const problem = f && checkReportFile(f);
            setError(problem || null);
            setFile(problem ? null : f);
          }}
          className="mt-3 block w-full text-[0.95rem] file:mr-4 file:rounded-pill file:border file:border-nordic file:bg-transparent file:px-4 file:py-2 file:font-bold file:text-nordic hover:file:bg-nordic hover:file:text-cream"
        />
      </div>
      <label className="flex items-start gap-3 text-[0.92rem] text-ink/80">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-keppel" />
        <span>
          I agree that Swetaranya may store this report in private, encrypted storage, to be opened only by the physician, and deleted after {retentionDays} days.
        </span>
      </label>
      {error && <p role="alert" className="border-l-2 border-terracotta pl-4 text-clay">{error}</p>}
      {progress !== null && (
        <div aria-live="polite">
          <p className="text-[0.9rem] text-ink/70">Uploading privately… {progress}%</p>
          <div className="mt-2 h-1 bg-nordic/10"><div className="h-1 bg-keppel transition-[width]" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      <button type="submit" disabled={progress !== null} className="rounded-pill bg-keppel px-8 py-3.5 font-bold text-nordic transition-colors hover:bg-nordic hover:text-cream disabled:opacity-70">
        Upload privately
      </button>
    </form>
  );
}

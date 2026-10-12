"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { readAttribution } from "@/lib/attribution";
import { DrawnCheck, inputClass } from "@/components/enquiry/Field";

export function EbookDownload({ slug, title, requiresEmail }: { slug: string; title: string; requiresEmail: boolean }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { utmSource, utmMedium, utmCampaign } = readAttribution();
    setState("sending");
    setError(null);
    const res = await fetch(`/api/ebooks/${slug}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: (fd.get("name") as string) || undefined,
        email: (fd.get("email") as string) || undefined,
        country: (fd.get("country") as string) || undefined,
        consentToContact: fd.get("consent") === "on",
        utmSource,
        utmMedium,
        utmCampaign,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("idle");
      setError(data.error ?? "That didn't work. Please try again.");
      return;
    }
    setFileUrl(data.fileUrl);
    setState("done");
    window.open(data.fileUrl, "_blank", "noopener");
  };

  if (state === "done" && fileUrl)
    return (
      <div role="status" className="flex items-start gap-4">
        <DrawnCheck className="h-10 w-10 shrink-0 text-keppel" />
        <p className="text-nordic">
          Your guide is opening in a new tab. If it didn&apos;t,{" "}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-keppel underline-offset-4">
            open {title}
          </a>
          . We&apos;ve emailed you the link too.
        </p>
      </div>
    );

  const id = `ebook-${slug}`;
  return (
    <div>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} aria-expanded={false} aria-controls={id} className="rounded-pill border border-nordic px-6 py-3 font-bold text-nordic transition-colors hover:bg-nordic hover:text-cream">
          Download the guide
        </button>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            id={id}
            onSubmit={submit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 pt-1 sm:grid-cols-2">
              <div>
                <label htmlFor={`${id}-name`} className="block text-[0.9rem] font-bold text-nordic">Name</label>
                <input id={`${id}-name`} name="name" autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label htmlFor={`${id}-country`} className="block text-[0.9rem] font-bold text-nordic">Country</label>
                <input id={`${id}-country`} name="country" autoComplete="country-name" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${id}-email`} className="block text-[0.9rem] font-bold text-nordic">
                  Email{requiresEmail ? "" : " (optional)"}
                </label>
                <input id={`${id}-email`} name="email" type="email" required={requiresEmail} autoComplete="email" className={inputClass} />
              </div>
            </div>
            <label className="mt-4 flex items-start gap-3 text-[0.9rem] text-ink/80">
              <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-keppel" />
              You may write to me occasionally from Swetaranya.
            </label>
            {error && (
              <p role="alert" className="mt-3 border-l-2 border-terracotta pl-4 text-clay">
                {error}
              </p>
            )}
            <button type="submit" disabled={state === "sending"} className="mt-5 rounded-pill bg-keppel px-7 py-3 font-bold text-nordic transition-colors hover:bg-nordic hover:text-cream disabled:opacity-70">
              {state === "sending" ? "Preparing" : "Send me the guide"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

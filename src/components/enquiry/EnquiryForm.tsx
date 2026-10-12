"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { enquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { HELP_TOPICS } from "@/lib/constants";
import { readAttribution } from "@/lib/attribution";
import { checkReportFile, uploadReport } from "@/lib/upload-client";
import { DrawnCheck, Field, inputClass } from "./Field";
import { PrimaryLink } from "@/components/site/Buttons";

type Result = { bookingToken: string; upload: "none" | "uploading" | "done" | "failed"; uploadMessage?: string; progress?: number };

export function EnquiryForm({ initialTopic, retentionDays }: { initialTopic?: (typeof HELP_TOPICS)[number]; retentionDays: number }) {
  const reduce = useReducedMotion();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { enquiringForSomeoneElse: false, helpWith: initialTopic, wantsReportUpload: false, reportConsent: false },
  });
  const forSomeoneElse = useWatch({ control, name: "enquiringForSomeoneElse" });
  const mode = useWatch({ control, name: "consultationMode" });

  const onFile = (f: File | null) => {
    setFileError(null);
    if (f) {
      const problem = checkReportFile(f);
      if (problem) {
        setFileError(problem);
        return;
      }
    }
    setFile(f);
    setValue("wantsReportUpload", Boolean(f));
    if (!f) setValue("reportConsent", false);
  };

  const onSubmit = async (values: EnquiryInput) => {
    setServerError(null);
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, ...readAttribution() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      for (const [field, msgs] of Object.entries((data.issues ?? {}) as Record<string, string[]>)) {
        setError(field as keyof EnquiryInput, { message: msgs[0] });
      }
      setServerError(data.error ?? "Something went wrong. Please try again, or write to us on WhatsApp.");
      return;
    }

    if (file && data.uploadToken) {
      setResult({ bookingToken: data.bookingToken, upload: "uploading", progress: 0 });
      try {
        await uploadReport(data.uploadToken, file, (progress) => setResult((r) => r && { ...r, progress }));
        setResult({ bookingToken: data.bookingToken, upload: "done" });
      } catch (err) {
        setResult({ bookingToken: data.bookingToken, upload: "failed", uploadMessage: (err as Error).message });
      }
    } else {
      setResult({ bookingToken: data.bookingToken, upload: "none" });
    }
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  if (result) return <Submitted result={result} />;

  const err = (name: keyof EnquiryInput) => errors[name]?.message as string | undefined;
  const aria = (name: keyof EnquiryInput) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-14">
      {/* honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Leave this empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <fieldset className="space-y-7">
        <legend className="mb-6 font-heading text-[1.7rem] text-nordic">About you</legend>
        <Field id="name" label="Your name" error={err("name")}>
          <input id="name" autoComplete="name" className={inputClass} {...aria("name")} {...register("name")} />
        </Field>

        <div className="flex items-start gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={forSomeoneElse}
            aria-labelledby="someone-else-label"
            onClick={() => setValue("enquiringForSomeoneElse", !forSomeoneElse, { shouldValidate: false })}
            className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-pill border transition-colors duration-300 ${forSomeoneElse ? "border-keppel bg-keppel" : "border-nordic/30 bg-white"}`}
          >
            <span aria-hidden className={`absolute left-0.5 top-1/2 h-[1.375rem] w-[1.375rem] -translate-y-1/2 rounded-pill border border-nordic/15 bg-cream transition-transform duration-300 ${forSomeoneElse ? "translate-x-[1.25rem]" : "translate-x-0"}`} />
          </button>
          <div>
            <p id="someone-else-label" className="font-bold text-nordic">I am enquiring for someone else</p>
            <p className="text-[0.88rem] text-ink/60">Many families write on behalf of a parent or older relative.</p>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {forSomeoneElse && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-7 border-l-2 border-keppel pl-5 sm:grid-cols-2">
                <Field id="patientName" label="Their name" error={err("patientName")}>
                  <input id="patientName" className={inputClass} {...aria("patientName")} {...register("patientName")} />
                </Field>
                <Field id="relationship" label="Your relationship to them" hint="Optional — e.g. daughter, son, spouse">
                  <input id="relationship" className={inputClass} {...register("relationship")} />
                </Field>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-7 sm:grid-cols-2">
          <Field id="country" label="Country" error={err("country")}>
            <input id="country" autoComplete="country-name" className={inputClass} {...aria("country")} {...register("country")} />
          </Field>
          <Field id="whatsapp" label="WhatsApp number" hint="With country code" error={err("whatsapp")}>
            <input id="whatsapp" type="tel" autoComplete="tel" placeholder="+971 50 123 4567" className={inputClass} {...aria("whatsapp")} {...register("whatsapp")} />
          </Field>
        </div>
        <Field id="email" label="Email" error={err("email")}>
          <input id="email" type="email" autoComplete="email" className={inputClass} {...aria("email")} {...register("email")} />
        </Field>
      </fieldset>

      <fieldset className="space-y-7">
        <legend className="mb-6 font-heading text-[1.7rem] text-nordic">What you need</legend>
        <Field id="helpWith" label="What would you like help with?" error={err("helpWith")}>
          <select id="helpWith" className={`${inputClass} appearance-none bg-[length:12px] bg-[right_4px_center] bg-no-repeat`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%2359AA99' stroke-width='2'/%3E%3C/svg%3E\")" }} {...aria("helpWith")} {...register("helpWith")} defaultValue={initialTopic ?? ""}>
            <option value="" disabled>
              Choose one
            </option>
            {HELP_TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <div role="radiogroup" aria-labelledby="mode-label" aria-describedby={errors.consultationMode ? "consultationMode-error" : undefined}>
          <p id="mode-label" className="text-[0.95rem] font-bold text-nordic">
            How would you like your first consultation?
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["online", "Online", "A video call from wherever you are. Most guests begin this way."],
                ["in_person", "In person", "At Swetaranya, if you are already in Kerala or nearby."],
              ] as const
            ).map(([value, title, desc]) => (
              <label
                key={value}
                className={`relative block cursor-pointer rounded-soft border p-5 transition-[border-color,background-color,transform] duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-keppel ${
                  mode === value ? "-translate-y-0.5 border-keppel bg-keppel/10" : "border-nordic/20 hover:border-nordic/45"
                }`}
              >
                <input type="radio" value={value} className="sr-only" {...register("consultationMode")} />
                <span className="flex items-center justify-between">
                  <span className="font-heading text-[1.35rem] text-nordic">{title}</span>
                  <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-pill border-2 ${mode === value ? "border-keppel" : "border-nordic/30"}`}>
                    {mode === value && <span className="h-2.5 w-2.5 rounded-pill bg-keppel" />}
                  </span>
                </span>
                <span className="mt-1.5 block text-[0.9rem] text-ink/70">{desc}</span>
              </label>
            ))}
          </div>
          {errors.consultationMode && (
            <p id="consultationMode-error" role="alert" className="mt-1.5 text-[0.88rem] text-clay">
              {errors.consultationMode.message}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-7">
        <legend className="mb-6 font-heading text-[1.7rem] text-nordic">Anything else</legend>
        <Field id="message" label="Your message" hint="Optional. Tell us as much or as little as you like — symptoms, how long, what you have tried.">
          <textarea id="message" rows={5} className={`${inputClass} resize-y`} {...register("message")} />
        </Field>

        <div>
          <p className="text-[0.95rem] font-bold text-nordic">Medical reports</p>
          <p className="text-[0.85rem] text-ink/60">Optional. One PDF, JPG or PNG up to 15 MB. You can send more after booking.</p>
          {!file ? (
            <label className="mt-3 flex cursor-pointer flex-col items-start gap-1 rounded-soft border border-dashed border-nordic/35 px-5 py-5 transition-colors hover:border-keppel has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-keppel">
              <span className="font-bold text-keppel">Choose a file</span>
              <span className="text-[0.85rem] text-ink/60">Stored privately. Only the physician can open it.</span>
              <input type="file" accept="application/pdf,image/jpeg,image/png" className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
            </label>
          ) : (
            <div className="mt-3 rounded-soft border border-keppel/50 bg-keppel/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="truncate text-[0.95rem] text-nordic">{file.name}</p>
                <button type="button" onClick={() => onFile(null)} className="shrink-0 text-[0.88rem] font-bold text-nordic underline decoration-keppel underline-offset-4">
                  Remove
                </button>
              </div>
              <label className="mt-4 flex items-start gap-3 text-[0.9rem] text-ink/80">
                <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-keppel" {...register("reportConsent")} aria-invalid={Boolean(errors.reportConsent)} aria-describedby={errors.reportConsent ? "reportConsent-error" : undefined} />
                <span>
                  I agree that Swetaranya may store this report in private, encrypted storage, to be opened only by the physician, and deleted after {retentionDays} days.
                </span>
              </label>
              {errors.reportConsent && (
                <p id="reportConsent-error" role="alert" className="mt-1.5 text-[0.88rem] text-clay">
                  {errors.reportConsent.message}
                </p>
              )}
            </div>
          )}
          {fileError && (
            <p role="alert" className="mt-1.5 text-[0.88rem] text-clay">
              {fileError}
            </p>
          )}
        </div>
      </fieldset>

      <div className="border-t border-nordic/15 pt-8">
        {serverError && (
          <p role="alert" className="mb-5 border-l-2 border-terracotta pl-4 text-clay">
            {serverError}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-3 rounded-pill bg-keppel px-8 py-3.5 font-bold text-nordic transition-colors duration-300 hover:bg-nordic hover:text-cream disabled:opacity-70"
        >
          {isSubmitting && <span aria-hidden className="h-4 w-4 animate-spin rounded-pill border-2 border-white/40 border-t-white" />}
          {isSubmitting ? "Sending" : "Send to the physician"}
        </button>
        <p className="mt-4 max-w-md text-[0.85rem] text-ink/60">
          We use your details only to reply to you. See our <a href="/privacy" className="underline decoration-keppel underline-offset-2">privacy note</a>.
        </p>
      </div>
    </form>
  );
}

function Submitted({ result }: { result: Result }) {
  return (
    <div role="status" aria-live="polite" className="py-4">
      <DrawnCheck className="h-16 w-16 text-keppel" />
      <h2 className="mt-6 text-[clamp(1.8rem,3.07vw,2.3rem)]">Thank you. Your message is with us.</h2>
      <p className="mt-4 max-w-lg text-[1.05rem] text-ink/80">
        Dr. Thrivikraman or a member of the family will reply personally, usually within a day. We&apos;ve sent a copy to your email.
      </p>
      {result.upload === "uploading" && (
        <div className="mt-6 max-w-sm">
          <p className="text-[0.92rem] text-ink/70">Uploading your report privately… {result.progress ?? 0}%</p>
          <div className="mt-2 h-1 bg-nordic/10">
            <div className="h-1 bg-keppel transition-[width]" style={{ width: `${result.progress ?? 0}%` }} />
          </div>
        </div>
      )}
      {result.upload === "done" && <p className="mt-6 text-[0.95rem] text-nordic">Your report has been stored privately for the physician.</p>}
      {result.upload === "failed" && (
        <p className="mt-6 border-l-2 border-terracotta pl-4 text-[0.95rem] text-clay">
          Your message arrived, but the report didn&apos;t upload ({result.uploadMessage}). You&apos;ll receive a private upload link after booking.
        </p>
      )}
      <div className="mt-10 border-t border-nordic/15 pt-8">
        <p className="font-heading text-[1.5rem] text-nordic">Would you like to choose a consultation time now?</p>
        <PrimaryLink href={`/talk-to-the-physician/book?t=${encodeURIComponent(result.bookingToken)}`} className="mt-5">
          See available times
        </PrimaryLink>
      </div>
    </div>
  );
}

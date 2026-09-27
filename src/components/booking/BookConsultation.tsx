"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { enquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { HELP_TOPICS } from "@/lib/constants";
import { readAttribution } from "@/lib/attribution";
import { Field, inputClass } from "@/components/enquiry/Field";
import { SlotPicker } from "./SlotPicker";

const STEPS = ["Your details", "Choose a time"];

/**
 * Direct booking: a short version of the enquiry (it is stored as a normal Talk to the Physician
 * enquiry, so the team sees it in one place), then the slot picker.
 */
export function BookConsultation() {
  const reduce = useReducedMotion();
  const [booking, setBooking] = useState<{ token: string; name: string; mode: "online" | "in_person" } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const step = booking ? 1 : 0;

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { enquiringForSomeoneElse: false, wantsReportUpload: false, reportConsent: false, consultationMode: "online" },
  });
  const mode = useWatch({ control, name: "consultationMode" });

  const onSubmit = async (values: EnquiryInput) => {
    setServerError(null);
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, message: values.message || "Booked directly from the Book a consultation page.", ...readAttribution() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      for (const [field, msgs] of Object.entries((data.issues ?? {}) as Record<string, string[]>)) setError(field as keyof EnquiryInput, { message: msgs[0] });
      setServerError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    setBooking({ token: data.bookingToken, name: values.name, mode: values.consultationMode });
  };

  const err = (n: keyof EnquiryInput) => errors[n]?.message as string | undefined;
  const aria = (n: keyof EnquiryInput) => ({ "aria-invalid": Boolean(errors[n]), "aria-describedby": errors[n] ? `${n}-error` : undefined });

  return (
    <div>
      <ol className="mb-12 flex gap-8" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className="flex items-center gap-3">
            <span
              className={`grid h-9 w-9 place-items-center rounded-pill border text-[0.85rem] font-bold transition-colors duration-300 ${
                i < step ? "border-keppel bg-cream text-keppel" : i === step ? "border-keppel bg-keppel text-white" : "border-nordic/25 text-ink/55"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className={i === step ? "font-bold text-nordic" : "text-ink/60"}>{s}</span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        {!booking ? (
          <motion.form
            key="details"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
            className="space-y-7"
          >
            <div className="absolute -left-[9999px]" aria-hidden>
              <label htmlFor="bc-website">Leave this empty</label>
              <input id="bc-website" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              <Field id="name" label="Your name" error={err("name")}>
                <input id="name" autoComplete="name" className={inputClass} {...aria("name")} {...register("name")} />
              </Field>
              <Field id="country" label="Country" error={err("country")}>
                <input id="country" autoComplete="country-name" className={inputClass} {...aria("country")} {...register("country")} />
              </Field>
              <Field id="email" label="Email" error={err("email")}>
                <input id="email" type="email" autoComplete="email" className={inputClass} {...aria("email")} {...register("email")} />
              </Field>
              <Field id="whatsapp" label="WhatsApp number" hint="With country code" error={err("whatsapp")}>
                <input id="whatsapp" type="tel" autoComplete="tel" className={inputClass} {...aria("whatsapp")} {...register("whatsapp")} />
              </Field>
            </div>
            <Field id="helpWith" label="What would you like to talk about?" error={err("helpWith")}>
              <select id="helpWith" defaultValue="" className={`${inputClass} appearance-none`} {...aria("helpWith")} {...register("helpWith")}>
                <option value="" disabled>
                  Choose one
                </option>
                {HELP_TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <fieldset>
              <legend className="text-[0.95rem] font-bold text-nordic">Consultation</legend>
              <div className="mt-3 inline-flex rounded-pill border border-nordic/20 p-1">
                {(["online", "in_person"] as const).map((m) => (
                  <label key={m} className={`cursor-pointer rounded-pill px-5 py-2 text-[0.92rem] font-bold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-keppel ${mode === m ? "bg-nordic text-cream" : "text-nordic hover:bg-nordic/5"}`}>
                    <input type="radio" value={m} className="sr-only" {...register("consultationMode")} />
                    {m === "online" ? "Online" : "In person at Swetaranya"}
                  </label>
                ))}
              </div>
            </fieldset>
            <Field id="message" label="Anything the physician should know?" hint="Optional">
              <textarea id="message" rows={3} className={`${inputClass} resize-y`} {...register("message")} />
            </Field>
            {serverError && (
              <p role="alert" className="border-l-2 border-terracotta pl-4 text-clay">
                {serverError}
              </p>
            )}
            <button type="submit" disabled={isSubmitting} className="rounded-pill bg-keppel px-8 py-3.5 font-bold text-white transition-colors hover:bg-nordic disabled:opacity-70">
              {isSubmitting ? "Saving" : "Continue to times"}
            </button>
          </motion.form>
        ) : (
          <motion.div key="slots" initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SlotPicker token={booking.token} defaultMode={booking.mode} name={booking.name} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

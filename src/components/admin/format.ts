/** Formatting helpers. Always pin the time zone so server and client render identical strings. */
export const ADMIN_TZ = "Asia/Kolkata";
export const ADMIN_TZ_LABEL = "IST (Asia/Kolkata)";

const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: ADMIN_TZ,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dateFmt = new Intl.DateTimeFormat("en-GB", { timeZone: ADMIN_TZ, day: "numeric", month: "short", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: ADMIN_TZ, weekday: "short", day: "numeric", month: "short", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: ADMIN_TZ, hour: "2-digit", minute: "2-digit", hour12: false });

type D = Date | string | number | null | undefined;
const wrap = (fmt: Intl.DateTimeFormat) => (d: D) => (d === null || d === undefined || d === "" ? "—" : fmt.format(new Date(d)));

export const fmtDateTime = wrap(dateTimeFmt);
export const fmtDate = wrap(dateFmt);
export const fmtDay = wrap(dayFmt);
export const fmtTime = wrap(timeFmt);

/** YYYY-MM-DD in IST, for <input type="date"> defaults. */
export function istDateInput(d: Date | string = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ADMIN_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(d));
}

export const statusLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
export const modeLabel = (m: string) => (m === "in_person" ? "In person" : "Online");

export const statusTone: Record<string, "warning" | "info" | "success" | "neutral"> = {
  new: "warning",
  contacted: "info",
  consultation_booked: "success",
  closed: "neutral",
};

/** YYYY-MM-DDTHH:MM in IST, for <input type="datetime-local"> values. */
export function istDateTimeInput(d: Date | string = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ADMIN_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(d))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** QuizSubmission.result is Mixed; read the dosha fields defensively. */
export function doshaResult(result: unknown) {
  const r = (result && typeof result === "object" ? result : {}) as Record<string, unknown>;
  const pct = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : undefined);
  return { vata: pct(r.vata), pitta: pct(r.pitta), kapha: pct(r.kapha), dominant: typeof r.dominant === "string" ? r.dominant : undefined };
}

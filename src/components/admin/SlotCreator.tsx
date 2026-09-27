"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONSULTATION_MODES } from "@/lib/constants";
import { adminRequest } from "./api";
import { modeLabel } from "./format";
import { Button, Field, inputClass } from "./ui";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function SlotCreator({ physicians, today }: { physicians: { id: string; name: string }[]; today: string }) {
  const router = useRouter();
  const [kind, setKind] = useState<"single" | "batch">("single");
  const [physicianId, setPhysicianId] = useState(physicians[0]?.id ?? "");
  const [mode, setMode] = useState<(typeof CONSULTATION_MODES)[number]>("online");
  const [durationMinutes, setDuration] = useState(45);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("10:00");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [weekdays, setWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [times, setTimes] = useState("10:00, 11:00, 15:00");
  const [state, setState] = useState<{ busy: boolean; error: string | null; message: string | null }>({ busy: false, error: null, message: null });

  if (physicians.length === 0) {
    return <p className="text-sm text-ink/70">Add an active user with the physician role in Settings before creating slots.</p>;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base = { physicianId, mode, durationMinutes };
    const body =
      kind === "single"
        ? { kind, date, time, ...base }
        : {
            kind,
            startDate,
            endDate,
            weekdays,
            times: times
              .split(/[\s,]+/)
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => (/^\d:\d{2}$/.test(t) ? `0${t}` : t)),
            ...base,
          };
    setState({ busy: true, error: null, message: null });
    const res = await adminRequest<{ created: number; skipped: number }>("/api/admin/slots", "POST", body);
    if (!res.ok) return setState({ busy: false, error: res.error, message: null });
    const { created, skipped } = res.data;
    setState({
      busy: false,
      error: null,
      message: `Created ${created} slot${created === 1 ? "" : "s"}.${skipped ? ` Skipped ${skipped} that overlapped existing slots.` : ""}`,
    });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <fieldset>
        <legend className="mb-1 text-sm font-bold text-nordic">What to add</legend>
        <div className="flex gap-4 text-sm">
          {(["single", "batch"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input type="radio" name="slot-kind" checked={kind === k} onChange={() => setKind(k)} className="accent-keppel" />
              {k === "single" ? "One slot" : "A batch of slots"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        {physicians.length > 1 && (
          <Field label="Physician" htmlFor="slot-physician" className="sm:col-span-3">
            <select id="slot-physician" value={physicianId} onChange={(e) => setPhysicianId(e.target.value)} className={inputClass}>
              {physicians.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Mode" htmlFor="slot-mode">
          <select id="slot-mode" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className={inputClass}>
            {CONSULTATION_MODES.map((m) => (
              <option key={m} value={m}>
                {modeLabel(m)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Duration (minutes)" htmlFor="slot-duration">
          <input
            id="slot-duration"
            type="number"
            min={10}
            max={240}
            step={5}
            value={durationMinutes}
            onChange={(e) => setDuration(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </div>

      {kind === "single" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" htmlFor="slot-date">
            <input id="slot-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Start time (IST)" htmlFor="slot-time">
            <input id="slot-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={inputClass} />
          </Field>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="From" htmlFor="slot-from">
              <input id="slot-from" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={inputClass} />
            </Field>
            <Field label="To (inclusive)" htmlFor="slot-to">
              <input id="slot-to" type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} required className={inputClass} />
            </Field>
          </div>
          <fieldset>
            <legend className="mb-1 text-sm font-bold text-nordic">Weekdays</legend>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((label, i) => {
                const on = weekdays.includes(i);
                return (
                  <label
                    key={label}
                    className={`cursor-pointer rounded-hair border px-3 py-1.5 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-keppel ${
                      on ? "border-nordic bg-nordic text-cream" : "border-nordic/25 bg-white text-nordic"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => setWeekdays((w) => (on ? w.filter((d) => d !== i) : [...w, i].sort()))}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <Field label="Start times (IST)" htmlFor="slot-times" hint="24-hour times separated by commas, e.g. 09:30, 11:00, 15:00.">
            <input id="slot-times" value={times} onChange={(e) => setTimes(e.target.value)} required className={inputClass} />
          </Field>
        </>
      )}

      {state.error && (
        <p role="alert" className="text-sm font-bold text-clay">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="rounded-hair bg-keppel/15 px-3 py-2 text-sm text-nordic">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={state.busy}>
        {state.busy ? "Adding…" : kind === "single" ? "Add slot" : "Add slots"}
      </Button>
    </form>
  );
}

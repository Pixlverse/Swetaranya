"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DrawnCheck } from "@/components/enquiry/Field";
import { TextLink } from "@/components/site/Buttons";
import { SymbolLoader } from "@/components/brand/SymbolLoader";

type Slot = { id: string; start: string; end: string; mode: "online" | "in_person" };
type Mode = Slot["mode"];

const KERALA = "Asia/Kolkata";

export function SlotPicker({ token, defaultMode, name }: { token: string; defaultMode: Mode; name: string }) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [state, setState] = useState<"idle" | "booking" | "booked">("idle");
  const [error, setError] = useState<string | null>(null);
  // The visitor's own timezone — client-only, UTC during server render.
  const tz = useSyncExternalStore(
    () => () => {},
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    () => "UTC",
  );

  const changeMode = (m: Mode) => {
    if (m === mode) return;
    setSlots(null);
    setSelected(null);
    setMode(m);
  };

  useEffect(() => {
    let live = true;
    fetch(`/api/slots?mode=${mode}`)
      .then((r) => r.json())
      .then((d) => live && setSlots(d.slots ?? []))
      .catch(() => live && setSlots([]));
    return () => {
      live = false;
    };
  }, [mode]);

  const fmt = useMemo(
    () => ({
      dayKey: new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }),
      weekday: new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short" }),
      dayNum: new Intl.DateTimeFormat("en-GB", { timeZone: tz, day: "numeric" }),
      month: new Intl.DateTimeFormat("en-GB", { timeZone: tz, month: "short" }),
      long: new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long" }),
      time: new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }),
      kerala: new Intl.DateTimeFormat("en-GB", { timeZone: KERALA, hour: "2-digit", minute: "2-digit" }),
    }),
    [tz],
  );

  const days = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots ?? []) {
      const k = fmt.dayKey.format(new Date(s.start));
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return [...map.entries()];
  }, [slots, fmt]);

  const activeDay = days.some(([k]) => k === day) ? day : (days[0]?.[0] ?? null);

  const book = async () => {
    if (!selected) return;
    setState("booking");
    setError(null);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, slotId: selected.id, timezone: tz }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("idle");
      setError(data.error ?? "That didn't work. Please try again.");
      if (res.status === 409) setSlots((s) => s?.filter((x) => x.id !== selected.id) ?? null);
      return;
    }
    setState("booked");
  };

  if (state === "booked" && selected) {
    return (
      <div role="status" aria-live="polite">
        <DrawnCheck className="h-16 w-16 text-keppel" />
        <h2 className="mt-6 text-[clamp(1.8rem,3.07vw,2.3rem)]">Your consultation is booked, {name.split(" ")[0]}.</h2>
        <p className="mt-4 text-[1.15rem] text-nordic">
          {fmt.long.format(new Date(selected.start))} at {fmt.time.format(new Date(selected.start))} your time
          <span className="text-ink/60"> ({fmt.kerala.format(new Date(selected.start))} in Kerala)</span>
        </p>
        <p className="mt-4 max-w-lg text-ink/75">
          We&apos;ve emailed the details, along with a private link to upload any medical reports you&apos;d like the physician to see beforehand.
        </p>
        <TextLink href="/the-swetaranya-way#arrival" className="mt-8 inline-block">
          What happens after the consultation
        </TextLink>
      </div>
    );
  }

  const daySlots = days.find(([k]) => k === activeDay)?.[1] ?? [];

  return (
    <div>
      <div role="radiogroup" aria-label="Consultation type" className="inline-flex rounded-pill border border-nordic/20 p-1">
        {(["online", "in_person"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => changeMode(m)}
            className={`rounded-pill px-5 py-2 text-[0.92rem] font-bold transition-colors ${mode === m ? "bg-nordic text-cream" : "text-nordic hover:bg-nordic/5"}`}
          >
            {m === "online" ? "Online" : "In person at Swetaranya"}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[0.9rem] text-ink/65">
        Times are shown in your timezone: <span className="font-bold text-nordic">{tz.replace(/_/g, " ")}</span>. Kerala time is shown alongside.
      </p>

      {slots === null ? (
        <div className="mt-10 flex items-center gap-4 text-ink/60">
          <SymbolLoader className="h-8 w-8" label="Finding open times" />
          <span aria-hidden>Finding open times…</span>
        </div>
      ) : days.length === 0 ? (
        <p className="mt-10 max-w-md text-ink/75">
          There are no open {mode === "online" ? "online" : "in-person"} times in the next few weeks. We&apos;ll suggest a time when we reply to you.
        </p>
      ) : (
        <>
          <div className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <ul className="flex gap-2" aria-label="Days with open times">
              {days.map(([k, list]) => {
                const d = new Date(list[0].start);
                const active = k === activeDay;
                return (
                  <li key={k}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setDay(k);
                        setSelected(null);
                      }}
                      className={`flex w-[4.5rem] flex-col items-center border-t-2 pb-3 pt-3 transition-colors ${active ? "border-keppel bg-keppel/10 text-nordic" : "border-nordic/15 text-ink/70 hover:border-nordic/40"}`}
                    >
                      <span className="text-[0.8rem]">{fmt.weekday.format(d)}</span>
                      <span className="font-heading text-[1.8rem] leading-tight">{fmt.dayNum.format(d)}</span>
                      <span className="text-[0.75rem]">{fmt.month.format(d)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <fieldset className="mt-8">
            <legend className="font-heading text-[1.4rem] text-nordic">{daySlots[0] && fmt.long.format(new Date(daySlots[0].start))}</legend>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {daySlots.map((s) => {
                const on = selected?.id === s.id;
                return (
                  <motion.button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelected(s)}
                    animate={{ y: on && !reduce ? -3 : 0 }}
                    className={`rounded-soft border px-4 py-3 text-left transition-colors ${on ? "border-keppel bg-keppel text-nordic" : "border-nordic/20 hover:border-keppel"}`}
                  >
                    <span className="block text-[1.1rem] font-bold tabular-nums">{fmt.time.format(new Date(s.start))}</span>
                    <span className={`block text-[0.8rem] ${on ? "text-white/85" : "text-ink/55"}`}>{fmt.kerala.format(new Date(s.start))} in Kerala</span>
                  </motion.button>
                );
              })}
            </div>
          </fieldset>
        </>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-10 border-t border-nordic/15 pt-6"
          >
            <p className="text-[1.05rem] text-nordic">
              {fmt.long.format(new Date(selected.start))}, {fmt.time.format(new Date(selected.start))} your time —{" "}
              {selected.mode === "online" ? "online video call" : "in person at Swetaranya"}, about 45 minutes.
            </p>
            {error && (
              <p role="alert" className="mt-3 border-l-2 border-terracotta pl-4 text-clay">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={book}
              disabled={state === "booking"}
              className="mt-5 inline-flex items-center gap-3 rounded-pill bg-keppel px-8 py-3.5 font-bold text-nordic transition-colors hover:bg-nordic hover:text-cream disabled:opacity-70"
            >
              {state === "booking" && <span aria-hidden className="h-4 w-4 animate-spin rounded-pill border-2 border-white/40 border-t-white" />}
              {state === "booking" ? "Booking" : "Confirm this time"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { NextResponse } from "next/server";
import { AdminUser, AvailabilitySlot } from "@/models";
import { slotCreateSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody } from "../_lib/http";

const DAY_MS = 86_400_000;
const MAX_SLOTS = 500;
const MAX_RANGE_DAYS = 120;

/** Slots are entered in Asia/Kolkata wall-clock time. IST is a fixed +05:30 with no DST. */
const istToDate = (date: string, time: string) => new Date(`${date}T${time}:00+05:30`);

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, slotCreateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const physician = await AdminUser.exists({ _id: input.physicianId, role: "physician", active: true });
  if (!physician) return jsonError("Choose an active physician for these slots.", 400);

  const durationMs = input.durationMinutes * 60_000;
  const starts: Date[] = [];
  if (input.kind === "single") {
    starts.push(istToDate(input.date, input.time));
  } else {
    const first = Date.parse(`${input.startDate}T00:00:00Z`);
    const last = Date.parse(`${input.endDate}T00:00:00Z`);
    if (last < first) return jsonError("The end date is before the start date.", 400);
    if ((last - first) / DAY_MS > MAX_RANGE_DAYS) return jsonError(`Keep the range under ${MAX_RANGE_DAYS} days.`, 400);
    const weekdays = new Set(input.weekdays);
    for (let day = first; day <= last; day += DAY_MS) {
      const d = new Date(day);
      if (!weekdays.has(d.getUTCDay())) continue;
      const ymd = d.toISOString().slice(0, 10);
      for (const t of [...new Set(input.times)].sort()) starts.push(istToDate(ymd, t));
    }
  }

  const now = Date.now();
  const future = starts.filter((s) => s.getTime() > now).sort((a, b) => a.getTime() - b.getTime());
  if (future.length === 0) return jsonError("No future slots match those dates and times.", 400);
  if (future.length > MAX_SLOTS) return jsonError(`That would create ${future.length} slots; the limit is ${MAX_SLOTS} per batch.`, 400);

  // Skip anything that overlaps an existing slot for this physician (or another new slot).
  const rangeStart = future[0];
  const rangeEnd = new Date(future[future.length - 1].getTime() + durationMs);
  const existing = await AvailabilitySlot.find({
    physicianId: input.physicianId,
    startTime: { $lt: rangeEnd },
    endTime: { $gt: rangeStart },
  })
    .select("startTime endTime")
    .lean();
  const taken = existing.map((s) => [s.startTime.getTime(), s.endTime.getTime()] as const);

  const docs: { physicianId: string; startTime: Date; endTime: Date; mode: string }[] = [];
  for (const start of future) {
    const s = start.getTime();
    const e = s + durationMs;
    if (taken.some(([a, b]) => s < b && e > a)) continue;
    taken.push([s, e]);
    docs.push({ physicianId: input.physicianId, startTime: start, endTime: new Date(e), mode: input.mode });
  }

  try {
    if (docs.length) await AvailabilitySlot.insertMany(docs);
    return NextResponse.json({ ok: true, created: docs.length, skipped: future.length - docs.length }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AvailabilitySlot } from "@/models";
import { CONSULTATION_MODES } from "@/lib/constants";

/** Public: open slots only, from 12 hours ahead. Times are UTC ISO strings — the browser converts. */
export async function GET(req: Request) {
  const modeParam = new URL(req.url).searchParams.get("mode");
  const mode = CONSULTATION_MODES.find((m) => m === modeParam);
  await connectDB();
  const slots = await AvailabilitySlot.find({
    isBooked: false,
    startTime: { $gte: new Date(Date.now() + 12 * 3_600_000), $lte: new Date(Date.now() + 60 * 86_400_000) },
    ...(mode ? { mode } : {}),
  })
    .sort({ startTime: 1 })
    .select("startTime endTime mode")
    .lean();
  return NextResponse.json({
    slots: slots.map((s) => ({ id: s._id.toString(), start: s.startTime.toISOString(), end: s.endTime.toISOString(), mode: s.mode })),
  });
}

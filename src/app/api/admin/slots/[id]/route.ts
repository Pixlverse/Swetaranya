import { NextResponse } from "next/server";
import { AvailabilitySlot, ConsultationBooking } from "@/models";
import { guard, jsonError, validId } from "../../_lib/http";

/** Delete an unbooked slot. Slots with an active booking must have the booking cancelled first. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Slot not found.", 404);

  const activeBooking = await ConsultationBooking.exists({ slotId: id, cancelled: false });
  if (activeBooking) return jsonError("This slot has an active booking. Cancel the booking first.", 409);

  const deleted = await AvailabilitySlot.findOneAndDelete({ _id: id, isBooked: false });
  if (!deleted) return jsonError("Slot not found, or it is booked.", 404);
  return NextResponse.json({ ok: true });
}

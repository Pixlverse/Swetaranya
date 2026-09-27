import { NextResponse } from "next/server";
import { AvailabilitySlot, ConsultationBooking, Enquiry } from "@/models";
import { bookingUpdateSchema } from "@/lib/validation/admin";
import { emailHtml, sendEmail } from "@/lib/email";
import { whatsapp } from "@/lib/whatsapp";
import { BOOKING_TOKEN_TTL, signToken } from "@/lib/tokens";
import { siteUrl } from "@/lib/uploads";
import { PHYSICIAN_NAME } from "@/lib/constants";
import { guard, jsonError, parseBody, validId } from "../../_lib/http";

const KERALA_TZ = "Asia/Kolkata";

const OPTS: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" };
/** Kerala time reads as "… 10:00 IST" (Intl would print "GMT+5:30"). */
const fmtKerala = (d: Date) => `${new Intl.DateTimeFormat("en-GB", { ...OPTS, timeZone: KERALA_TZ }).format(d)} IST`;
const fmt = (d: Date, timeZone: string) => {
  if (timeZone === KERALA_TZ) return fmtKerala(d);
  try {
    return new Intl.DateTimeFormat("en-GB", { ...OPTS, timeZone, timeZoneName: "short" }).format(d);
  } catch {
    return fmtKerala(d);
  }
};

/** Cancel a booking, free its slot for someone else, and let the guest know with a fresh booking link. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Booking not found.", 404);
  const body = await parseBody(req, bookingUpdateSchema);
  if (!body.ok) return body.response;

  const booking = await ConsultationBooking.findOneAndUpdate(
    { _id: id, cancelled: false },
    { $set: { cancelled: true } },
    { returnDocument: "after" },
  ).lean();
  if (!booking) return jsonError("Booking not found, or already cancelled.", 404);
  const [slot, enquiry] = await Promise.all([
    AvailabilitySlot.findOneAndUpdate({ _id: booking.slotId }, { $set: { isBooked: false } }, { returnDocument: "after" }).lean(),
    Enquiry.findById(booking.enquiryId).select("name email whatsapp").lean(),
  ]);

  let notified = false;
  if (enquiry) {
    const firstName = enquiry.name.split(" ")[0];
    const rebookUrl = `${siteUrl()}/talk-to-the-physician/book?t=${encodeURIComponent(signToken(enquiry._id.toString(), "booking", BOOKING_TOKEN_TTL))}`;
    const local = slot ? fmt(slot.startTime, booking.timezone) : null;
    const ist = slot ? fmtKerala(slot.startTime) : null;
    const when = local ? `on ${local}` : "that we had arranged";
    const kerala = local && ist && ist !== local ? ` (${ist} in Kerala)` : "";
    const note = body.data.note?.trim();
    const days = Math.round(BOOKING_TOKEN_TTL / 86_400);

    const sent = await sendEmail({
      to: enquiry.email,
      subject: `Your consultation with ${PHYSICIAN_NAME} has been cancelled`,
      text: [
        `Dear ${firstName},`,
        `We're sorry — your consultation with ${PHYSICIAN_NAME} ${when}${kerala} has had to be cancelled.`,
        ...(note ? [note] : []),
        `Please choose another time that suits you here (the link works for ${days} days):\n${rebookUrl}`,
        "If none of the times work, simply reply to this email and we'll find one together.",
        "With warm regards,\nSwetaranya",
      ].join("\n\n"),
      html: emailHtml(
        "Your consultation has been cancelled.",
        [
          `${firstName}, we're sorry — your consultation with ${PHYSICIAN_NAME} ${when} has had to be cancelled.`,
          ...(kerala ? [`That was ${ist} in Kerala.`] : []),
          ...(note ? [note] : []),
          `Please choose another time that suits you. The link below works for ${days} days. If none of the times work, simply reply and we'll find one together.`,
        ],
        { label: "Choose a new time", href: rebookUrl },
      ),
    });
    notified = sent.ok;
    // TODO: wire WhatsApp Cloud API
    await whatsapp.sendTemplate(enquiry.whatsapp, "consultation_cancelled", { name: firstName, when: local ?? "", rebook: rebookUrl });
  }
  return NextResponse.json({ ok: true, notified });
}

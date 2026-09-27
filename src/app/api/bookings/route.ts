import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AvailabilitySlot, ConsultationBooking, Enquiry } from "@/models";
import { bookingSchema } from "@/lib/validation/enquiry";
import { verifyToken } from "@/lib/tokens";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { issueUploadGrant, siteUrl } from "@/lib/uploads";
import { emailHtml, sendEmail } from "@/lib/email";
import { whatsapp } from "@/lib/whatsapp";
import { PHYSICIAN_NAME } from "@/lib/constants";

const fmt = (d: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(d);

const validZone = (tz: string) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

export async function POST(req: Request) {
  if (!rateLimit(`booking:${clientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  const parsed = bookingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Something was missing from the booking." }, { status: 400 });
  const { token, slotId, timezone } = parsed.data;

  const enquiryId = verifyToken(token, "booking");
  if (!enquiryId) return NextResponse.json({ error: "This booking link has expired. Please write to us again and we'll send a new one." }, { status: 401 });
  if (!validZone(timezone)) return NextResponse.json({ error: "Unrecognised timezone." }, { status: 400 });

  await connectDB();
  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) return NextResponse.json({ error: "We couldn't find your enquiry." }, { status: 404 });

  if (await ConsultationBooking.exists({ enquiryId, cancelled: false })) {
    return NextResponse.json({ error: "You already have a consultation booked. We'll be in touch if you need to change it." }, { status: 409 });
  }

  // Claim the slot atomically so two visitors can never book the same time.
  const slot = await AvailabilitySlot.findOneAndUpdate(
    { _id: slotId, isBooked: false, startTime: { $gte: new Date(Date.now() + 12 * 3_600_000) } },
    { $set: { isBooked: true } },
    { returnDocument: "after" },
  );
  if (!slot) return NextResponse.json({ error: "Someone has just taken that time. Please choose another." }, { status: 409 });

  let booking;
  try {
    booking = await ConsultationBooking.create({ enquiryId, slotId: slot._id, timezone });
  } catch (err) {
    await AvailabilitySlot.updateOne({ _id: slot._id }, { $set: { isBooked: false } });
    if ((err as { code?: number }).code === 11000) return NextResponse.json({ error: "Someone has just taken that time. Please choose another." }, { status: 409 });
    throw err;
  }
  await Enquiry.updateOne({ _id: enquiryId }, { $set: { status: "consultation_booked" } });

  // Standalone private upload link for reports, valid for 7 days, single use.
  const uploadToken = await issueUploadGrant(enquiry._id, "post_booking_link", 7 * 86_400);
  const uploadUrl = `${siteUrl()}/upload/${uploadToken}`;
  const local = fmt(slot.startTime, timezone);
  const ist = fmt(slot.startTime, "Asia/Kolkata");
  const firstName = enquiry.name.split(" ")[0];
  const how = slot.mode === "online" ? "We'll send the video call link on WhatsApp and email the day before." : "The consultation will be at Swetaranya. We'll send directions.";

  const sent = await sendEmail({
    to: enquiry.email,
    subject: `Your consultation with ${PHYSICIAN_NAME}`,
    text: `Dear ${firstName},\n\nYour ${slot.mode === "online" ? "online" : "in-person"} consultation is booked for ${local} (${ist} in Kerala).\n${how}\n\nIf you have medical reports you'd like the physician to see beforehand, you can upload them privately here (the link works once, for 7 days):\n${uploadUrl}\n\nWith warm regards,\nSwetaranya`,
    html: emailHtml(
      "Your consultation is booked.",
      [
        `${firstName}, your ${slot.mode === "online" ? "online" : "in-person"} consultation with ${PHYSICIAN_NAME} is on ${local}.`,
        `That is ${ist} in Kerala.`,
        how,
        "If you have medical reports you'd like the physician to see beforehand, you can upload them privately. The link works once and expires in 7 days.",
      ],
      { label: "Upload reports privately", href: uploadUrl },
    ),
  });
  if (sent.ok) await ConsultationBooking.updateOne({ _id: booking._id }, { confirmationSent: true });
  // TODO: wire WhatsApp Cloud API — reminder scheduling will hang off reminderSent.
  await whatsapp.sendTemplate(enquiry.whatsapp, "consultation_booked", { name: firstName, when: local });

  return NextResponse.json({ ok: true, start: slot.startTime.toISOString(), mode: slot.mode }, { status: 201 });
}

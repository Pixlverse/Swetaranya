import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Enquiry } from "@/models";
import { enquirySchema } from "@/lib/validation/enquiry";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { BOOKING_TOKEN_TTL, signToken } from "@/lib/tokens";
import { issueUploadGrant, siteUrl } from "@/lib/uploads";
import { emailHtml, sendEmail } from "@/lib/email";
import { whatsapp } from "@/lib/whatsapp";
import { PHYSICIAN_SHORT } from "@/lib/constants";

export async function POST(req: Request) {
  if (!rateLimit(`enquiry:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "You've sent several messages in a short time. Please wait a few minutes and try again." }, { status: 429 });
  }

  const parsed = enquirySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { website, wantsReportUpload, reportConsent, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // honeypot: pretend success

  await connectDB();
  const enquiry = await Enquiry.create({
    ...data,
    type: "talk_to_physician",
    patientName: data.enquiringForSomeoneElse ? data.patientName : undefined,
    relationship: data.enquiringForSomeoneElse ? data.relationship : undefined,
  });

  const bookingToken = signToken(enquiry._id.toString(), "booking", BOOKING_TOKEN_TTL);
  const bookingUrl = `${siteUrl()}/talk-to-the-physician/book?t=${encodeURIComponent(bookingToken)}`;
  // Short-lived grant so the form can upload the attached report straight after submitting.
  const uploadToken = wantsReportUpload && reportConsent ? await issueUploadGrant(enquiry._id, "enquiry_form", 60 * 60) : null;

  const firstName = data.name.split(" ")[0];
  const forWhom = data.enquiringForSomeoneElse && data.patientName ? ` about ${data.patientName}` : "";
  const sent = await sendEmail({
    to: data.email,
    subject: "We've received your message — Swetaranya",
    text: `Dear ${firstName},\n\nThank you for writing to us${forWhom}. ${PHYSICIAN_SHORT} or a member of the family will reply personally, usually within a day.\n\nIf you'd like to, you can choose a time for your first consultation here:\n${bookingUrl}\n\nWith warm regards,\nSwetaranya`,
    html: emailHtml(
      `Thank you, ${firstName}.`,
      [
        `We've received your message${forWhom}. ${PHYSICIAN_SHORT} or a member of the family will reply personally, usually within a day.`,
        "If you'd like to, you can choose a time for your first consultation now.",
      ],
      { label: "Choose a consultation time", href: bookingUrl },
    ),
  });
  if (sent.ok) await Enquiry.updateOne({ _id: enquiry._id }, { confirmationSent: true });

  if (process.env.EMAIL_TEAM_INBOX) {
    await sendEmail({
      to: process.env.EMAIL_TEAM_INBOX,
      subject: `New enquiry: ${data.name} (${data.country}) — ${data.helpWith}`,
      text: `${data.name} from ${data.country}\n${data.email} / ${data.whatsapp}\nHelp with: ${data.helpWith}\nMode: ${data.consultationMode}\nSource: ${data.utmSource ?? "direct/unknown"}\n\n${data.message ?? ""}`,
    });
  }
  // TODO: wire WhatsApp Cloud API — stub logs only.
  await whatsapp.sendTemplate(data.whatsapp, "enquiry_received", { name: firstName });

  return NextResponse.json({ ok: true, bookingToken, uploadToken }, { status: 201 });
}

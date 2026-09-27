import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Ebook, EbookDownload } from "@/models";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { emailHtml, sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/uploads";

const schema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Please enter a valid email.").max(200).optional(),
  country: z.string().trim().max(80).optional(),
  consentToContact: z.boolean().optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
});

/** Records the download (the lead) and hands back the file link. Email is required unless the e-book says otherwise. */
export async function POST(req: Request, ctx: RouteContext<"/api/ebooks/[slug]/download">) {
  if (!rateLimit(`ebook:${clientIp(req)}`, 15, 10 * 60_000)) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  const { slug } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 400 });

  await connectDB();
  const ebook = await Ebook.findOne({ slug, published: true });
  if (!ebook) return NextResponse.json({ error: "This guide isn't available." }, { status: 404 });
  if (!ebook.fileUrl) return NextResponse.json({ error: "This guide is being prepared. Please check back soon." }, { status: 409 });
  if (ebook.requiresEmail && !parsed.data.email) return NextResponse.json({ error: "Please enter your email to download." }, { status: 400 });

  if (parsed.data.email) {
    await EbookDownload.create({ ebookId: ebook._id, ...parsed.data });
    const href = ebook.fileUrl.startsWith("/") ? `${siteUrl()}${ebook.fileUrl}` : ebook.fileUrl;
    await sendEmail({
      to: parsed.data.email,
      subject: `Your copy of "${ebook.title}" — Swetaranya`,
      text: `Thank you for downloading "${ebook.title}". You can open it any time here:\n${href}\n\nWith warm regards,\nSwetaranya`,
      html: emailHtml(`Here is "${ebook.title}".`, ["Thank you for downloading it. The link below works any time."], { label: "Open the guide", href }),
    });
  }
  await Ebook.updateOne({ _id: ebook._id }, { $inc: { downloadCount: 1 } });
  return NextResponse.json({ ok: true, fileUrl: ebook.fileUrl });
}

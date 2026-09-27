import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { QuizSubmission } from "@/models";
import { verifyToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";

const schema = z.object({ token: z.string(), contactEmail: z.string().trim().email().max(200), followUpRequested: z.boolean() });

export async function PATCH(req: Request, ctx: RouteContext<"/api/constitution-check/[id]">) {
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (verifyToken(parsed.data.token, "constitution") !== id) return NextResponse.json({ error: "This result can no longer be updated." }, { status: 401 });
  await connectDB();
  await QuizSubmission.updateOne({ _id: id, quiz: "dosha" }, { $set: { contactEmail: parsed.data.contactEmail, followUpRequested: parsed.data.followUpRequested } });
  if (parsed.data.followUpRequested && process.env.EMAIL_TEAM_INBOX) {
    await sendEmail({ to: process.env.EMAIL_TEAM_INBOX, subject: "Constitution check: follow-up requested", text: `${parsed.data.contactEmail} asked for a follow-up on constitution check ${id}.` });
  }
  return NextResponse.json({ ok: true });
}

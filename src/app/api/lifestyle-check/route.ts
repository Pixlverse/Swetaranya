import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { LifestyleCheckResult } from "@/models";
import { LIFESTYLE_AREAS } from "@/lib/constants";
import { scoreLifestyle } from "@/lib/lifestyle";
import { signToken } from "@/lib/tokens";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const answer = z.number().int().min(0).max(3);
const schema = z.object({ responses: z.object(Object.fromEntries(LIFESTYLE_AREAS.map((a) => [a, answer])) as Record<(typeof LIFESTYLE_AREAS)[number], typeof answer>) });

export async function POST(req: Request) {
  if (!rateLimit(`lc:${clientIp(req)}`, 20, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Incomplete answers." }, { status: 400 });
  await connectDB();
  const doc = await LifestyleCheckResult.create({ responses: parsed.data.responses, ...scoreLifestyle(parsed.data.responses) });
  // Lets this visitor (and only them) attach an email to their own result afterwards.
  return NextResponse.json({ id: doc._id.toString(), token: signToken(doc._id.toString(), "lifestyle", 60 * 60 * 24) }, { status: 201 });
}

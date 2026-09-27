import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { QuizSubmission } from "@/models";
import { CONSTITUTION_QUESTIONS } from "@/content/constitution";
import { scoreConstitution } from "@/lib/constitution";
import { signToken } from "@/lib/tokens";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const dosha = z.enum(["vata", "pitta", "kapha"]);
const schema = z.object({ answers: z.object(Object.fromEntries(CONSTITUTION_QUESTIONS.map((q) => [q.id, dosha])) as Record<string, typeof dosha>) });

export async function POST(req: Request) {
  if (!rateLimit(`cc:${clientIp(req)}`, 20, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Incomplete answers." }, { status: 400 });
  await connectDB();
  const doc = await QuizSubmission.create({ quiz: "dosha", answers: parsed.data.answers, result: scoreConstitution(parsed.data.answers) });
  return NextResponse.json({ id: doc._id.toString(), token: signToken(doc._id.toString(), "constitution", 60 * 60 * 24) }, { status: 201 });
}

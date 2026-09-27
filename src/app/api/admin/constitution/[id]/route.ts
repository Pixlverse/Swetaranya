import { NextResponse } from "next/server";
import { QuizSubmission } from "@/models";
import { quizUpdateSchema } from "@/lib/validation/admin";
import { guard, jsonError, parseBody, validId } from "../../_lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Result not found.", 404);
  const body = await parseBody(req, quizUpdateSchema);
  if (!body.ok) return body.response;
  const { followedUp } = body.data;
  const updated = await QuizSubmission.findOneAndUpdate(
    { _id: id, quiz: "dosha" },
    followedUp ? { $set: { followedUp: true, followedUpAt: new Date() } } : { $set: { followedUp: false }, $unset: { followedUpAt: 1 } },
  );
  if (!updated) return jsonError("Result not found.", 404);
  return NextResponse.json({ ok: true });
}

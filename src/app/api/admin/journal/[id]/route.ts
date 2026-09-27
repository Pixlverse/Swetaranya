import { NextResponse } from "next/server";
import { JournalPost } from "@/models";
import { journalPostSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody, validId } from "../../_lib/http";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Post not found.", 404);
  const body = await parseBody(req, journalPostSchema);
  if (!body.ok) return body.response;
  try {
    const updated = await JournalPost.findByIdAndUpdate(id, { $set: body.data }, { runValidators: true });
    if (!updated) return jsonError("Post not found.", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Post not found.", 404);
  const deleted = await JournalPost.findByIdAndDelete(id);
  if (!deleted) return jsonError("Post not found.", 404);
  return NextResponse.json({ ok: true });
}

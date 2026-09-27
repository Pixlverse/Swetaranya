import { NextResponse } from "next/server";
import { Condition, Therapy } from "@/models";
import { therapySchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody, validId } from "../../_lib/http";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Therapy not found.", 404);
  const body = await parseBody(req, therapySchema);
  if (!body.ok) return body.response;
  try {
    const updated = await Therapy.findByIdAndUpdate(id, { $set: body.data }, { runValidators: true });
    if (!updated) return jsonError("Therapy not found.", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Therapy not found.", 404);
  const deleted = await Therapy.findByIdAndDelete(id);
  if (!deleted) return jsonError("Therapy not found.", 404);
  // Don't leave dangling references on condition pages.
  await Condition.updateMany({ relatedTherapies: id }, { $pull: { relatedTherapies: id } });
  return NextResponse.json({ ok: true });
}

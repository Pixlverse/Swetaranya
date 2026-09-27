import { NextResponse } from "next/server";
import { Condition } from "@/models";
import { conditionSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody, validId } from "../../_lib/http";
import { existingTherapyIds } from "../../_lib/content";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Condition not found.", 404);
  const body = await parseBody(req, conditionSchema);
  if (!body.ok) return body.response;
  try {
    const relatedTherapies = await existingTherapyIds(body.data.relatedTherapies);
    const updated = await Condition.findByIdAndUpdate(id, { $set: { ...body.data, relatedTherapies } }, { runValidators: true });
    if (!updated) return jsonError("Condition not found.", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Condition not found.", 404);
  const deleted = await Condition.findByIdAndDelete(id);
  if (!deleted) return jsonError("Condition not found.", 404);
  return NextResponse.json({ ok: true });
}

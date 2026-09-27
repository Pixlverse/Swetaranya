import { NextResponse } from "next/server";
import { Condition } from "@/models";
import { conditionSchema } from "@/lib/validation/admin";
import { guard, handleDbError, parseBody } from "../_lib/http";
import { existingTherapyIds } from "../_lib/content";

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, conditionSchema);
  if (!body.ok) return body.response;
  try {
    const relatedTherapies = await existingTherapyIds(body.data.relatedTherapies);
    const doc = await Condition.create({ ...body.data, relatedTherapies });
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}

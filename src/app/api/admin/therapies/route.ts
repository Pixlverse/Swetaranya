import { NextResponse } from "next/server";
import { Therapy } from "@/models";
import { therapySchema } from "@/lib/validation/admin";
import { guard, handleDbError, parseBody } from "../_lib/http";

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, therapySchema);
  if (!body.ok) return body.response;
  try {
    const doc = await Therapy.create(body.data);
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}

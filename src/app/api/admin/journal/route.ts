import { NextResponse } from "next/server";
import { JournalPost } from "@/models";
import { journalPostSchema } from "@/lib/validation/admin";
import { guard, handleDbError, parseBody } from "../_lib/http";

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, journalPostSchema);
  if (!body.ok) return body.response;
  try {
    const doc = await JournalPost.create(body.data);
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}

import { NextResponse } from "next/server";
import { Ebook } from "@/models";
import { ebookSchema } from "@/lib/validation/admin";
import { guard, handleDbError, parseBody } from "../_lib/http";

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, ebookSchema);
  if (!body.ok) return body.response;
  const { pages, ...rest } = body.data;
  try {
    const doc = await Ebook.create(pages === null ? rest : { ...rest, pages });
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}

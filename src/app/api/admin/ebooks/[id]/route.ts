import { NextResponse } from "next/server";
import { Ebook } from "@/models";
import { ebookSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody, validId } from "../../_lib/http";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("E-book not found.", 404);
  const body = await parseBody(req, ebookSchema);
  if (!body.ok) return body.response;
  const { pages, ...rest } = body.data;
  try {
    const updated = await Ebook.findByIdAndUpdate(
      id,
      pages === null ? { $set: rest, $unset: { pages: 1 } } : { $set: { ...rest, pages } },
      { runValidators: true },
    );
    if (!updated) return jsonError("E-book not found.", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}

/** Deletes the e-book only. Download rows are leads with consent choices attached, so they are kept. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("E-book not found.", 404);
  const deleted = await Ebook.findByIdAndDelete(id);
  if (!deleted) return jsonError("E-book not found.", 404);
  return NextResponse.json({ ok: true });
}

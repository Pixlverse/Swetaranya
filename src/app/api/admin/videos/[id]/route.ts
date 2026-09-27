import { NextResponse } from "next/server";
import { Video } from "@/models";
import { videoSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody, validId } from "../../_lib/http";
import { unfeatureOtherVideos } from "../../_lib/content";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Video not found.", 404);
  const body = await parseBody(req, videoSchema);
  if (!body.ok) return body.response;
  try {
    const updated = await Video.findByIdAndUpdate(id, { $set: body.data }, { runValidators: true });
    if (!updated) return jsonError("Video not found.", 404);
    if (body.data.featured) await unfeatureOtherVideos(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Video not found.", 404);
  const deleted = await Video.findByIdAndDelete(id);
  if (!deleted) return jsonError("Video not found.", 404);
  return NextResponse.json({ ok: true });
}

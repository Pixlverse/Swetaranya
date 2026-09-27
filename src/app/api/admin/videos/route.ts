import { NextResponse } from "next/server";
import { Video } from "@/models";
import { videoSchema } from "@/lib/validation/admin";
import { guard, handleDbError, parseBody } from "../_lib/http";
import { unfeatureOtherVideos } from "../_lib/content";

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, videoSchema);
  if (!body.ok) return body.response;
  try {
    const doc = await Video.create(body.data);
    if (doc.featured) await unfeatureOtherVideos(doc._id.toString());
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}

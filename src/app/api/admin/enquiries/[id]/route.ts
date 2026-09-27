import { NextResponse } from "next/server";
import { Enquiry } from "@/models";
import { enquiryUpdateSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody, validId } from "../../_lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Enquiry not found.", 404);
  const body = await parseBody(req, enquiryUpdateSchema);
  if (!body.ok) return body.response;
  try {
    const updated = await Enquiry.findByIdAndUpdate(id, { $set: body.data }, { returnDocument: "after", runValidators: true })
      .select("status internalNotes")
      .lean();
    if (!updated) return jsonError("Enquiry not found.", 404);
    return NextResponse.json({ ok: true, status: updated.status, internalNotes: updated.internalNotes });
  } catch (err) {
    return handleDbError(err);
  }
}

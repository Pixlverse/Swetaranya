import { NextResponse } from "next/server";
import { Testimonial } from "@/models";
import { testimonialPatchSchema } from "@/lib/validation/admin";
import { guard, jsonError, parseBody, validId } from "../../_lib/http";
import { CONSENT_REQUIRED, PLACEHOLDER_UNPUBLISHABLE, testimonialError } from "../../_lib/content";

type Ctx = { params: Promise<{ id: string }> };

/** Partial update. Uses doc.save() so the model's consent pre-save hook runs as a final gate. */
export async function PATCH(req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Testimonial not found.", 404);
  const body = await parseBody(req, testimonialPatchSchema);
  if (!body.ok) return body.response;

  const doc = await Testimonial.findById(id);
  if (!doc) return jsonError("Testimonial not found.", 404);

  const patch = { ...body.data };
  const consent = patch.consentGiven ?? doc.consentGiven;
  if (patch.consentGiven === false) {
    // Revoking consent always unpublishes, and clears the recorded time so a new consent is re-recorded.
    patch.published = false;
    doc.consentRecordedAt = undefined;
  }
  const willPublish = patch.published ?? doc.published;
  if (willPublish && doc.isPlaceholder) return jsonError(PLACEHOLDER_UNPUBLISHABLE, 400);
  if (willPublish && !consent) return jsonError(CONSENT_REQUIRED, 400);

  doc.set(patch);
  try {
    await doc.save();
    return NextResponse.json({ ok: true, consentGiven: doc.consentGiven, published: doc.published });
  } catch (err) {
    return testimonialError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Testimonial not found.", 404);
  const deleted = await Testimonial.findByIdAndDelete(id);
  if (!deleted) return jsonError("Testimonial not found.", 404);
  return NextResponse.json({ ok: true });
}

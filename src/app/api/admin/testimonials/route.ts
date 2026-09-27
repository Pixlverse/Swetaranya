import { NextResponse } from "next/server";
import { Testimonial } from "@/models";
import { testimonialSchema } from "@/lib/validation/admin";
import { guard, jsonError, parseBody } from "../_lib/http";
import { CONSENT_REQUIRED, testimonialError } from "../_lib/content";

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, testimonialSchema);
  if (!body.ok) return body.response;
  if (body.data.published && !body.data.consentGiven) return jsonError(CONSENT_REQUIRED, 400);
  try {
    // Placeholders only come from the seed script; anything created here is a real, consent-tracked story.
    const doc = await Testimonial.create({ ...body.data, isPlaceholder: false });
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    return testimonialError(err);
  }
}

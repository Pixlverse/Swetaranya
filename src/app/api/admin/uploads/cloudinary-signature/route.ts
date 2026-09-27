import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { emptyBodySchema } from "@/lib/validation/admin";
import { guard, jsonError, parseBody } from "../../_lib/http";

/**
 * Signed direct-to-Cloudinary uploads for PUBLIC admin imagery (condition, therapy, video and
 * e-book images, testimonial media). Never used for medical reports — those go to private Spaces.
 */
const FOLDER = "swetaranya";
const NOT_CONFIGURED = "Cloudinary isn't configured — paste an image URL instead.";

const config = () => {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
};

/** Lets the image field know up front whether uploads are available. */
export async function GET() {
  const g = await guard();
  if (!g.ok) return g.response;
  return NextResponse.json({ configured: Boolean(config()) });
}

export async function POST(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const body = await parseBody(req, emptyBodySchema);
  if (!body.ok) return body.response;
  const c = config();
  if (!c) return jsonError(NOT_CONFIGURED, 503);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder: FOLDER }, c.apiSecret);
  return NextResponse.json(
    { timestamp, signature, apiKey: c.apiKey, cloudName: c.cloudName, folder: FOLDER },
    { headers: { "Cache-Control": "no-store" } },
  );
}

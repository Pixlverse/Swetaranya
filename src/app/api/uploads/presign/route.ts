import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { MedicalReportUpload, UploadGrant } from "@/models";
import { reportFileSchema } from "@/lib/validation/enquiry";
import { randomToken, sha256 } from "@/lib/tokens";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { signedUploadUrl } from "@/lib/spaces";
import { retentionDate } from "@/lib/uploads";

const schema = reportFileSchema.extend({ token: z.string().min(20), consent: z.literal(true) });
const EXT: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png" };

/**
 * Exchanges a single-use grant for a presigned PUT to the PRIVATE bucket. The grant is consumed
 * here, atomically, so a link can authorise exactly one upload.
 */
export async function POST(req: Request) {
  if (!rateLimit(`presign:${clientIp(req)}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return NextResponse.json({ error: first ?? "Please check the file and consent." }, { status: 400 });
  }
  const { token, fileType, sizeBytes, originalName } = parsed.data;

  await connectDB();
  const grant = await UploadGrant.findOneAndUpdate(
    { tokenHash: sha256(token), usedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { usedAt: new Date() } },
    { returnDocument: "after" },
  );
  if (!grant) return NextResponse.json({ error: "This upload link has already been used or has expired." }, { status: 410 });

  const key = `reports/${grant.enquiryId}/${randomToken()}.${EXT[fileType]}`;
  const upload = await MedicalReportUpload.create({
    enquiryId: grant.enquiryId,
    grantId: grant._id,
    fileUrl: key,
    originalName,
    fileType,
    sizeBytes,
    consentCheckboxAccepted: true,
    retentionExpiresAt: retentionDate(),
  });

  const { url } = await signedUploadUrl(key, fileType, 300);
  // Only the id and the one-off PUT URL leave the server — never the stored key record.
  return NextResponse.json({ uploadId: upload._id.toString(), url, headers: { "Content-Type": fileType } });
}

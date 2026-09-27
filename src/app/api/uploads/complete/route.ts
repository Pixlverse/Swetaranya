import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Enquiry, MedicalReportUpload, UploadGrant } from "@/models";
import { sha256 } from "@/lib/tokens";
import { objectExists } from "@/lib/spaces";

const schema = z.object({ token: z.string().min(20), uploadId: z.string().regex(/^[a-f0-9]{24}$/) });

/** Confirms the file actually landed in the private bucket, then attaches it to the enquiry. */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  await connectDB();

  const grant = await UploadGrant.findOne({ tokenHash: sha256(parsed.data.token), usedAt: { $gt: new Date(Date.now() - 60 * 60_000) } });
  if (!grant) return NextResponse.json({ error: "This upload link is no longer valid." }, { status: 410 });

  const upload = await MedicalReportUpload.findOne({ _id: parsed.data.uploadId, grantId: grant._id, status: "pending" }).select("+fileUrl");
  if (!upload) return NextResponse.json({ error: "Upload not found." }, { status: 404 });

  const exists = await objectExists(upload.fileUrl);
  if (!exists) return NextResponse.json({ error: "We couldn't find the uploaded file. Please try again." }, { status: 409 });

  upload.status = "uploaded";
  upload.uploadedAt = new Date();
  if (typeof exists === "object" && exists.size) upload.sizeBytes = exists.size;
  await upload.save();
  await Enquiry.updateOne({ _id: upload.enquiryId }, { $addToSet: { reportUploads: upload._id } });

  return NextResponse.json({ ok: true, retentionExpiresAt: upload.retentionExpiresAt.toISOString() });
}

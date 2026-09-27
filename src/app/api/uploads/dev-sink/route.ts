import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MedicalReportUpload } from "@/models";
import { privateStorageConfigured } from "@/lib/spaces";

/**
 * LOCAL DEVELOPMENT ONLY: stands in for the Spaces presigned PUT when no bucket is configured.
 * The file body is discarded — PHI is never written to local disk. Disabled in production.
 */
export async function PUT(req: Request) {
  if (process.env.NODE_ENV === "production" || privateStorageConfigured()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  const key = new URL(req.url).searchParams.get("key");
  await connectDB();
  const pending = key && (await MedicalReportUpload.exists({ fileUrl: key, status: "pending" }));
  if (!pending) return NextResponse.json({ error: "Unknown upload" }, { status: 403 });
  await req.arrayBuffer();
  console.info("[uploads:dev-sink] accepted and discarded", key);
  return new NextResponse(null, { status: 200 });
}

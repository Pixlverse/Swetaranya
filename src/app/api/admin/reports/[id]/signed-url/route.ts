import { NextResponse } from "next/server";
import { MedicalReportUpload } from "@/models";
import { signedDownloadUrl } from "@/lib/spaces";
import { guard, jsonError, validId } from "../../../_lib/http";

const EXPIRES_IN = 300;

/** Physician-only: mint a short-lived signed GET for one uploaded report. The object key never leaves the server. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard(["physician"]);
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("Report not found.", 404);

  const report = await MedicalReportUpload.findOne({ _id: id, status: "uploaded" }).select("+fileUrl").lean();
  if (!report) return jsonError("Report not found.", 404);

  const url = await signedDownloadUrl(report.fileUrl, EXPIRES_IN);
  if (!url) return jsonError("Private storage is not configured in this environment, so reports cannot be opened here.", 503);
  console.info(`[audit] report ${id} opened by ${g.session.user.email}`);
  return NextResponse.json({ url, expiresIn: EXPIRES_IN }, { headers: { "Cache-Control": "no-store" } });
}

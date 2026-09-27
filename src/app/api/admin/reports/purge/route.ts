import { NextResponse } from "next/server";
import { purgeExpiredReports } from "@/lib/retention";
import { emptyBodySchema } from "@/lib/validation/admin";
import { guard, handleDbError, parseBody } from "../../_lib/http";

/** Run the medical report retention purge on demand (same job as /api/cron/purge-reports). */
export async function POST(req: Request) {
  const g = await guard(["admin", "physician"]);
  if (!g.ok) return g.response;
  const body = await parseBody(req, emptyBodySchema);
  if (!body.ok) return body.response;
  try {
    const result = await purgeExpiredReports();
    console.info(`[audit] retention purge run by ${g.session.user.email}`, result);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return handleDbError(err);
  }
}

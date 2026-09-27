import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { purgeExpiredReports } from "@/lib/retention";

/**
 * Scheduled retention purge (DigitalOcean scheduled job). Not behind the admin proxy — it is
 * protected only by `Authorization: Bearer $CRON_SECRET`.
 */
function authorised(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(req: Request) {
  if (!authorised(req)) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const result = await purgeExpiredReports();
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[cron] purge-reports failed", err);
    return NextResponse.json({ error: "Purge failed." }, { status: 500 });
  }
}

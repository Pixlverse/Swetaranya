import { NextResponse } from "next/server";
import { PageContent } from "@/models";
import { PAGE_DEFAULTS } from "@/content/pages";
import { pageKeySchema, pageSectionsSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody } from "../../_lib/http";
import { sameJson } from "../../_lib/content";

type Ctx = { params: Promise<{ pageKey: string }> };
const defaultsFor = (pageKey: string) => (PAGE_DEFAULTS as Record<string, Record<string, unknown>>)[pageKey];

export async function PUT(req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { pageKey } = await params;
  if (!pageKeySchema.safeParse(pageKey).success) return jsonError("Invalid page key.", 400);
  const body = await parseBody(req, pageSectionsSchema);
  if (!body.ok) return body.response;

  const defaults = defaultsFor(pageKey);
  if (defaults) {
    const sent = new Set(body.data.sections.map((s) => s.key));
    const missing = Object.keys(defaults).filter((k) => !sent.has(k));
    if (missing.length) return jsonError(`Built-in sections cannot be removed: ${missing.join(", ")}.`, 400);
  }
  // Only store sections that differ from the code defaults, so future default copy changes still flow through.
  const sections = body.data.sections.filter((s) => !defaults || !sameJson(s.data, defaults[s.key]));

  try {
    await PageContent.updateOne({ pageKey }, { $set: { sections } }, { upsert: true });
    return NextResponse.json({ ok: true, stored: sections.length });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard();
  if (!g.ok) return g.response;
  const { pageKey } = await params;
  if (defaultsFor(pageKey)) return jsonError("Built-in pages cannot be deleted. Reset individual sections instead.", 400);
  const res = await PageContent.deleteOne({ pageKey });
  if (!res.deletedCount) return jsonError("Page not found.", 404);
  return NextResponse.json({ ok: true });
}

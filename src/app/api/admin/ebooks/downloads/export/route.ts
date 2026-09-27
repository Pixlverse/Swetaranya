import type { QueryFilter } from "mongoose";
import { Ebook, EbookDownload, type EbookDownloadDoc } from "@/models";
import { ebookDownloadsQuerySchema } from "@/lib/validation/admin";
import { guard, jsonError } from "../../../_lib/http";
import { csvResponse } from "../../../_lib/csv";

export async function GET(req: Request) {
  const g = await guard();
  if (!g.ok) return g.response;
  const parsed = ebookDownloadsQuerySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) return jsonError("Invalid e-book filter.", 400);
  const filter: QueryFilter<EbookDownloadDoc> = parsed.data.ebook ? { ebookId: parsed.data.ebook } : {};
  const [rows, ebooks] = await Promise.all([
    EbookDownload.find(filter).sort({ createdAt: -1 }).lean(),
    Ebook.find().select("title slug").lean(),
  ]);
  const titles = new Map(ebooks.map((e) => [e._id.toString(), e.title]));
  return csvResponse(
    "ebook-downloads",
    ["id", "createdAt", "ebookId", "ebookTitle", "name", "email", "country", "consentToContact", "utmSource", "utmMedium", "utmCampaign"],
    rows.map((r) => [
      r._id.toString(),
      r.createdAt,
      r.ebookId.toString(),
      titles.get(r.ebookId.toString()) ?? "(deleted e-book)",
      r.name,
      r.email,
      r.country,
      r.consentToContact,
      r.utmSource,
      r.utmMedium,
      r.utmCampaign,
    ]),
  );
}

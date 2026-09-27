import { QuizSubmission } from "@/models";
import { guard } from "../../_lib/http";
import { csvResponse } from "../../_lib/csv";
import { doshaResult } from "@/components/admin/format";

export async function GET() {
  const g = await guard();
  if (!g.ok) return g.response;
  const rows = await QuizSubmission.find({ quiz: "dosha" }).sort({ createdAt: -1 }).lean();
  return csvResponse(
    "constitution-check-results",
    ["id", "createdAt", "vata_percent", "pitta_percent", "kapha_percent", "dominant", "contactEmail", "followUpRequested", "followedUp", "followedUpAt", "answers"],
    rows.map((r) => {
      const res = doshaResult(r.result);
      return [
        r._id.toString(),
        r.createdAt,
        res.vata,
        res.pitta,
        res.kapha,
        res.dominant,
        r.contactEmail,
        r.followUpRequested,
        r.followedUp,
        r.followedUpAt,
        JSON.stringify(r.answers ?? {}),
      ];
    }),
  );
}

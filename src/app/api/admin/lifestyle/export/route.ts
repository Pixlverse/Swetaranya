import { LifestyleCheckResult } from "@/models";
import { LIFESTYLE_AREAS } from "@/lib/constants";
import { guard } from "../../_lib/http";
import { csvResponse } from "../../_lib/csv";

export async function GET() {
  const g = await guard();
  if (!g.ok) return g.response;
  const rows = await LifestyleCheckResult.find().sort({ createdAt: -1 }).lean();
  const header = [
    "id",
    "createdAt",
    "contactEmail",
    "followUpRequested",
    "followedUp",
    "followedUpAt",
    "overallPercentage",
    ...LIFESTYLE_AREAS.map((a) => `${a}_percent`),
    ...LIFESTYLE_AREAS.map((a) => `${a}_response`),
  ];
  return csvResponse(
    "lifestyle-check-results",
    header,
    rows.map((r) => {
      const scores = (r.scorePercentages ?? {}) as Record<string, number | undefined>;
      const responses = (r.responses ?? {}) as Record<string, number | undefined>;
      return [
        r._id.toString(),
        r.createdAt,
        r.contactEmail,
        r.followUpRequested,
        r.followedUp,
        r.followedUpAt,
        r.overallPercentage,
        ...LIFESTYLE_AREAS.map((a) => scores[a]),
        ...LIFESTYLE_AREAS.map((a) => responses[a]),
      ];
    }),
  );
}

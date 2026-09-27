import "server-only";
import { Types } from "mongoose";
import { UploadGrant } from "@/models";
import { randomToken, sha256 } from "./tokens";

/** Issue a single-use upload grant for an enquiry. Returns the raw token (only ever sent to the visitor). */
export async function issueUploadGrant(enquiryId: Types.ObjectId | string, source: "enquiry_form" | "post_booking_link", ttlSeconds: number) {
  const token = randomToken();
  await UploadGrant.create({
    tokenHash: sha256(token),
    enquiryId,
    source,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
  });
  return token;
}

export const retentionDate = () => {
  const days = Number(process.env.REPORT_RETENTION_DAYS ?? 365);
  return new Date(Date.now() + days * 86_400_000);
};

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

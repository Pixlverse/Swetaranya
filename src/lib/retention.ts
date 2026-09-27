import "server-only";
import { connectDB } from "./db";
import { deleteObject } from "./spaces";
import { Enquiry, MedicalReportUpload } from "@/models";

const STALE_PENDING_MS = 24 * 3_600_000;

export type PurgeResult = { expired: number; stalePending: number; deleted: number; failed: number };

/**
 * Medical report retention. Deletes, from the private bucket, every report whose retention period
 * has passed, plus "pending" uploads that were never completed within 24 hours. The metadata row
 * stays as an audit trail with status "deleted", no object key and no original file name.
 * A failed object delete leaves the row untouched so the next run retries it.
 */
export async function purgeExpiredReports(now = new Date()): Promise<PurgeResult> {
  await connectDB();
  const staleBefore = new Date(now.getTime() - STALE_PENDING_MS);
  const due = await MedicalReportUpload.find({
    status: { $ne: "deleted" },
    $or: [{ retentionExpiresAt: { $lt: now } }, { status: "pending", createdAt: { $lt: staleBefore } }],
  })
    .select("+fileUrl enquiryId status retentionExpiresAt")
    .lean();

  const result: PurgeResult = { expired: 0, stalePending: 0, deleted: 0, failed: 0 };
  for (const doc of due) {
    const expired = doc.retentionExpiresAt < now;
    if (expired) result.expired++;
    else result.stalePending++;
    try {
      if (doc.fileUrl) await deleteObject(doc.fileUrl);
      await MedicalReportUpload.updateOne({ _id: doc._id }, { $set: { status: "deleted" }, $unset: { fileUrl: 1, originalName: 1 } });
      await Enquiry.updateOne({ _id: doc.enquiryId }, { $pull: { reportUploads: doc._id } });
      result.deleted++;
    } catch (err) {
      result.failed++;
      console.error(`[retention] could not purge report ${doc._id.toString()}`, err);
    }
  }
  if (due.length) console.info("[retention] purge finished", result);
  return result;
}

import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

/**
 * PHI. Lives only in the private Spaces bucket. NEVER return this model from a public API route —
 * `fileUrl` is excluded by default and toJSON strips it as a second line of defence.
 */
const MedicalReportUploadSchema = new Schema(
  {
    enquiryId: { type: Schema.Types.ObjectId, ref: "Enquiry", required: true, index: true },
    /** The single-use grant that authorised this upload. */
    grantId: { type: Schema.Types.ObjectId, ref: "UploadGrant", required: true },
    /** Object key inside the private bucket (never a public URL). */
    fileUrl: { type: String, required: true, select: false },
    originalName: { type: String, select: false },
    fileType: { type: String, required: true },
    sizeBytes: Number,
    status: { type: String, enum: ["pending", "uploaded", "deleted"], default: "pending" },
    uploadedAt: Date,
    consentCheckboxAccepted: { type: Boolean, required: true, validate: (v: boolean) => v === true },
    retentionExpiresAt: { type: Date, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.fileUrl;
        delete ret.originalName;
        return ret;
      },
    },
  },
);

export type MedicalReportUploadDoc = InferSchemaType<typeof MedicalReportUploadSchema> & { _id: Types.ObjectId };
export const MedicalReportUpload = model("MedicalReportUpload", MedicalReportUploadSchema);

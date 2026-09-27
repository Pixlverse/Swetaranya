import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

/**
 * A single-use, expiring permission to upload one medical report for one enquiry.
 * Only the SHA-256 of the token is stored; the raw token lives in the link we email.
 */
const UploadGrantSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    enquiryId: { type: Schema.Types.ObjectId, ref: "Enquiry", required: true },
    source: { type: String, enum: ["enquiry_form", "post_booking_link"], required: true },
    expiresAt: { type: Date, required: true },
    usedAt: Date,
  },
  { timestamps: true },
);
// Mongo removes expired grants automatically a day after expiry.
UploadGrantSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export type UploadGrantDoc = InferSchemaType<typeof UploadGrantSchema> & { _id: Types.ObjectId };
export const UploadGrant = model("UploadGrant", UploadGrantSchema);

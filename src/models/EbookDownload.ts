import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

/** One row per e-book download request (the lead). */
const EbookDownloadSchema = new Schema(
  {
    ebookId: { type: Schema.Types.ObjectId, ref: "Ebook", required: true, index: true },
    name: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    country: { type: String, trim: true },
    consentToContact: { type: Boolean, default: false },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export type EbookDownloadDoc = InferSchemaType<typeof EbookDownloadSchema> & { _id: Types.ObjectId; createdAt: Date };
export const EbookDownload = model("EbookDownload", EbookDownloadSchema);

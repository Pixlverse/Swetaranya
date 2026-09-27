import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

/** Downloadable guide. The file is public (Cloudinary or /public); an email is asked for before download. */
const EbookSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    /** Short bullet points: what's inside. */
    contents: { type: [String], default: [] },
    cover: { url: String, alt: String },
    fileUrl: { type: String, default: "" },
    pages: Number,
    requiresEmail: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type EbookDoc = InferSchemaType<typeof EbookSchema> & { _id: Types.ObjectId };
export const Ebook = model("Ebook", EbookSchema);

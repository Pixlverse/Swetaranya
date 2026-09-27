import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";
import { JOURNAL_CATEGORY_SLUGS, PHYSICIAN_NAME } from "@/lib/constants";

const JournalPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: JOURNAL_CATEGORY_SLUGS, required: true },
    excerpt: { type: String, default: "" },
    /** Markdown-lite body: blank-line paragraphs, "## " headings, "- " lists, "> " quotes. */
    body: { type: String, required: true },
    author: { type: String, default: PHYSICIAN_NAME },
    publishedAt: { type: Date, default: () => new Date() },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
JournalPostSchema.index({ category: 1, publishedAt: -1 });

export type JournalPostDoc = InferSchemaType<typeof JournalPostSchema> & { _id: Types.ObjectId };
export const JournalPost = model("JournalPost", JournalPostSchema);

import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

/**
 * Video library entry. `url` is a YouTube/Vimeo link or a direct video file (e.g. Cloudinary MP4).
 * One video can be `featured` — it leads the Experience page with its chapter list.
 */
const VideoSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, enum: ["life-at-swetaranya", "treatments", "learn-ayurveda", "guest-stories"], required: true },
    url: { type: String, default: "" },
    thumbnail: { url: String, alt: String },
    duration: { type: String, default: "" },
    chapters: [{ title: { type: String, required: true }, seconds: { type: Number, min: 0, required: true }, body: String, _id: false }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const VIDEO_CATEGORIES = [
  { slug: "life-at-swetaranya", label: "Life at Swetaranya" },
  { slug: "treatments", label: "Treatments" },
  { slug: "learn-ayurveda", label: "Learn Ayurveda" },
  { slug: "guest-stories", label: "Guest stories" },
] as const;

export type VideoDoc = InferSchemaType<typeof VideoSchema> & { _id: Types.ObjectId };
export const Video = model("Video", VideoSchema);

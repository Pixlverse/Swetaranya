import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

const TherapySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    malayalamName: { type: String, trim: true },
    category: { type: String, enum: ["panchakarma", "individual"], required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    image: { url: String, alt: String },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type TherapyDoc = InferSchemaType<typeof TherapySchema> & { _id: Types.ObjectId };
export const Therapy = model("Therapy", TherapySchema);

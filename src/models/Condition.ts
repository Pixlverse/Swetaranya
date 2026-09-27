import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

const FaqSchema = new Schema({ question: { type: String, required: true }, answer: { type: String, required: true } }, { _id: false });

const ConditionSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    /** Answer-first: the direct, plain answer shown at the very top of the page. */
    summary: { type: String, required: true },
    /** How Swetaranya approaches this condition (markdown-lite, paragraphs separated by blank lines). */
    approach: { type: String, default: "" },
    whatToExpect: { type: String, default: "" },
    heroImage: { url: String, alt: String },
    faqs: { type: [FaqSchema], default: [] },
    relatedTherapies: [{ type: Schema.Types.ObjectId, ref: "Therapy" }],
    seoTitle: String,
    seoDescription: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ConditionDoc = InferSchemaType<typeof ConditionSchema> & { _id: Types.ObjectId };
export const Condition = model("Condition", ConditionSchema);

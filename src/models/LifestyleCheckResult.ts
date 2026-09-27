import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";
import { LIFESTYLE_AREAS } from "@/lib/constants";

const areaFields = (type: NumberConstructor, extra: object = {}) =>
  Object.fromEntries(LIFESTYLE_AREAS.map((a) => [a, { type, min: 0, ...extra }]));

const LifestyleCheckResultSchema = new Schema(
  {
    responses: areaFields(Number, { max: 3, required: true }),
    scorePercentages: areaFields(Number, { max: 100 }),
    overallPercentage: { type: Number, min: 0, max: 100 },
    contactEmail: { type: String, lowercase: true, trim: true },
    followUpRequested: { type: Boolean, default: false },
    followedUp: { type: Boolean, default: false },
    followedUpAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export type LifestyleCheckResultDoc = InferSchemaType<typeof LifestyleCheckResultSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
};
export const LifestyleCheckResult = model("LifestyleCheckResult", LifestyleCheckResultSchema);

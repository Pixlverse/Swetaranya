import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";
import { CONSULTATION_MODES } from "@/lib/constants";

const AvailabilitySlotSchema = new Schema(
  {
    physicianId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    mode: { type: String, enum: CONSULTATION_MODES, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true },
);
AvailabilitySlotSchema.index({ startTime: 1, isBooked: 1 });

export type AvailabilitySlotDoc = InferSchemaType<typeof AvailabilitySlotSchema> & { _id: Types.ObjectId };
export const AvailabilitySlot = model("AvailabilitySlot", AvailabilitySlotSchema);

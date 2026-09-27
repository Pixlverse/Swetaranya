import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

const ConsultationBookingSchema = new Schema(
  {
    enquiryId: { type: Schema.Types.ObjectId, ref: "Enquiry", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "AvailabilitySlot", required: true },
    timezone: { type: String, required: true },
    confirmationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
  },
  { timestamps: true },
);
// One active booking per slot; cancelled bookings stay as history without blocking the slot.
ConsultationBookingSchema.index({ slotId: 1 }, { unique: true, partialFilterExpression: { cancelled: false } });

export type ConsultationBookingDoc = InferSchemaType<typeof ConsultationBookingSchema> & { _id: Types.ObjectId };
export const ConsultationBooking = model("ConsultationBooking", ConsultationBookingSchema);

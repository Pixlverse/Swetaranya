import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";
import { CONSULTATION_MODES, ENQUIRY_STATUSES, ENQUIRY_TYPES } from "@/lib/constants";

const EnquirySchema = new Schema(
  {
    type: { type: String, enum: ENQUIRY_TYPES, default: "talk_to_physician" },
    name: { type: String, required: true, trim: true },
    enquiringForSomeoneElse: { type: Boolean, default: false },
    /** The person the care is for, when a family member is enquiring on their behalf. */
    patientName: { type: String, trim: true },
    relationship: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    helpWith: { type: String, required: true },
    consultationMode: { type: String, enum: CONSULTATION_MODES, required: true },
    message: { type: String, default: "" },
    reportUploads: [{ type: Schema.Types.ObjectId, ref: "MedicalReportUpload" }],
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,
    landingPage: String,
    referrer: String,
    status: { type: String, enum: ENQUIRY_STATUSES, default: "new" },
    internalNotes: { type: String, default: "" },
    confirmationSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ utmSource: 1 });

export type EnquiryDoc = InferSchemaType<typeof EnquirySchema> & { _id: Types.ObjectId; createdAt: Date };
export const Enquiry = model("Enquiry", EnquirySchema);

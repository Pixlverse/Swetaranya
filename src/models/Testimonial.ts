import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

const TestimonialSchema = new Schema(
  {
    patientName: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    condition: { type: String, trim: true },
    quote: { type: String, required: true },
    consentGiven: { type: Boolean, default: false },
    consentRecordedAt: Date,
    published: { type: Boolean, default: false },
    isPlaceholder: { type: Boolean, default: false },
    media: [{ kind: { type: String, enum: ["image", "video"] }, url: String, alt: String, _id: false }],
  },
  { timestamps: true },
);

const CONSENT_ERROR = "A testimonial cannot be published without recorded patient consent.";

// Consent gate — enforced at the data layer so no route or admin action can bypass it.
TestimonialSchema.pre("save", function () {
  if (this.published && !this.consentGiven) throw new Error(CONSENT_ERROR);
  if (this.isModified("consentGiven") && this.consentGiven && !this.consentRecordedAt) this.consentRecordedAt = new Date();
});

TestimonialSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], async function () {
  const update = (this.getUpdate() ?? {}) as Record<string, unknown> & { $set?: Record<string, unknown> };
  const set = { ...update, ...(update.$set ?? {}) } as Record<string, unknown>;
  const touchesPublish = set.published === true;
  const revokesConsent = set.consentGiven === false;
  if (revokesConsent) {
    // Withdrawing consent always unpublishes.
    this.set({ published: false });
    return;
  }
  if (touchesPublish && set.consentGiven !== true) {
    const docs = await this.model.find(this.getFilter()).select("consentGiven").lean<{ consentGiven: boolean }[]>();
    if (docs.some((d) => !d.consentGiven)) throw new Error(CONSENT_ERROR);
  }
});

/** The only query public pages should use. */
export const PUBLISHABLE_TESTIMONIAL_FILTER = { published: true, consentGiven: true } as const;

export type TestimonialDoc = InferSchemaType<typeof TestimonialSchema> & { _id: Types.ObjectId };
export const Testimonial = model("Testimonial", TestimonialSchema);

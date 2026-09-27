import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

/** Self-assessment questionnaires. "dosha" is the Know Your Constitution check; "find_your_journey" is later. */
const QuizSubmissionSchema = new Schema(
  {
    quiz: { type: String, enum: ["dosha", "find_your_journey"], required: true, index: true },
    answers: { type: Schema.Types.Mixed, default: {} },
    /** For "dosha": { vata, pitta, kapha } percentages and the leading tendency. */
    result: { type: Schema.Types.Mixed },
    contactEmail: { type: String, lowercase: true, trim: true },
    followUpRequested: { type: Boolean, default: false },
    followedUp: { type: Boolean, default: false },
    followedUpAt: Date,
  },
  { timestamps: true },
);

export type QuizSubmissionDoc = InferSchemaType<typeof QuizSubmissionSchema> & { _id: Types.ObjectId; createdAt: Date };
export const QuizSubmission = model("QuizSubmission", QuizSubmissionSchema);

/**
 * Later-phase models (CLAUDE.md §4 "explicitly NOT in this phase").
 * Schemas exist so the data can be captured without a migration later — no UI or routes use them yet.
 */
import { Schema } from "mongoose";
import { model } from "./_util";

/** Ask Ayurveda — public questions answered by the physician. */
export const AyurvedaQuestion = model(
  "AyurvedaQuestion",
  new Schema(
    {
      question: { type: String, required: true },
      askerName: String,
      askerEmail: String,
      answer: String,
      answeredBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
      published: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);

/** Stay planner drafts. */
export const StayPlan = model(
  "StayPlan",
  new Schema(
    {
      email: String,
      arrival: Date,
      nights: Number,
      guests: Number,
      interests: [String],
      notes: String,
    },
    { timestamps: true },
  ),
);

/** Seasonal calendar entries (Ritucharya). */
export const SeasonalEntry = model(
  "SeasonalEntry",
  new Schema({ season: String, months: [Number], title: String, body: String }, { timestamps: true }),
);

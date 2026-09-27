import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";

/**
 * Admin-editable copy for Home / About / Your Stay etc. Each section is a flexible JSON block,
 * keyed so page components can look it up: `{ key: "hero", data: { heading, body, ... } }`.
 */
const PageContentSchema = new Schema(
  {
    pageKey: { type: String, required: true, unique: true },
    sections: [{ key: { type: String, required: true }, data: { type: Schema.Types.Mixed, default: {} }, _id: false }],
  },
  { timestamps: true, minimize: false },
);

export type PageContentDoc = InferSchemaType<typeof PageContentSchema> & { _id: Types.ObjectId };
export const PageContent = model("PageContent", PageContentSchema);

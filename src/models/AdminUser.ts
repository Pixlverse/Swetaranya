import { Schema, type InferSchemaType, Types } from "mongoose";
import { model } from "./_util";
import { ADMIN_ROLES } from "@/lib/constants";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: "staff" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema> & { _id: Types.ObjectId };
export const AdminUser = model("AdminUser", AdminUserSchema);

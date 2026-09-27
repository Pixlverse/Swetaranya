import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AdminUser } from "@/models";
import { userCreateSchema } from "@/lib/validation/admin";
import { guard, handleDbError, parseBody } from "../_lib/http";

export async function POST(req: Request) {
  const g = await guard(["admin"]);
  if (!g.ok) return g.response;
  const body = await parseBody(req, userCreateSchema);
  if (!body.ok) return body.response;
  const { password, ...rest } = body.data;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const doc = await AdminUser.create({ ...rest, passwordHash, active: true });
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}

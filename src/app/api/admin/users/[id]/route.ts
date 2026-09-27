import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AdminUser } from "@/models";
import { userUpdateSchema } from "@/lib/validation/admin";
import { guard, handleDbError, jsonError, parseBody, validId } from "../../_lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard(["admin"]);
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!validId(id)) return jsonError("User not found.", 404);
  const body = await parseBody(req, userUpdateSchema);
  if (!body.ok) return body.response;
  const { password, ...changes } = body.data;

  const user = await AdminUser.findById(id);
  if (!user) return jsonError("User not found.", 404);

  const isSelf = id === g.session.user.id;
  const demoting = changes.role !== undefined && changes.role !== "admin" && user.role === "admin";
  const deactivating = changes.active === false && user.active;
  if (isSelf && demoting) return jsonError("You cannot change your own admin role.", 400);
  if (isSelf && deactivating) return jsonError("You cannot deactivate your own account.", 400);
  if ((demoting || deactivating) && user.role === "admin") {
    const otherAdmins = await AdminUser.countDocuments({ _id: { $ne: id }, role: "admin", active: true });
    if (otherAdmins === 0) return jsonError("There must always be at least one active admin.", 400);
  }

  user.set(changes);
  if (password) user.passwordHash = await bcrypt.hash(password, 12);
  try {
    await user.save();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}

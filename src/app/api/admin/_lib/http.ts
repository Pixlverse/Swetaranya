import "server-only";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import type { z } from "zod";
import { adminFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import type { AdminRole } from "@/lib/constants";
import { objectIdSchema, zodMessage } from "@/lib/validation/admin";

export const jsonError = (error: string, status: number) => NextResponse.json({ error }, { status });

type Guarded =
  | { ok: true; session: NonNullable<Awaited<ReturnType<typeof adminFromRequest>>["session"]> }
  | { ok: false; response: NextResponse };

/** Auth + role check + DB connection for every /api/admin handler. */
export async function guard(roles?: AdminRole[]): Promise<Guarded> {
  const { session, status } = await adminFromRequest(roles);
  if (!session) {
    return { ok: false, response: jsonError(status === 401 ? "Please sign in again." : "Your role does not allow this.", status) };
  }
  await connectDB();
  return { ok: true, session };
}

export async function parseBody<S extends z.ZodType>(
  req: Request,
  schema: S,
): Promise<{ ok: true; data: z.output<S> } | { ok: false; response: NextResponse }> {
  const raw = await req.json().catch(() => undefined);
  if (raw === undefined) return { ok: false, response: jsonError("Request body must be JSON.", 400) };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, response: jsonError(zodMessage(parsed.error), 400) };
  return { ok: true, data: parsed.data };
}

export const validId = (id: string) => objectIdSchema.safeParse(id).success;

/** Map Mongo/Mongoose errors to friendly JSON responses. */
export function handleDbError(err: unknown) {
  if (typeof err === "object" && err && "code" in err && (err as { code: unknown }).code === 11000) {
    const key = Object.keys((err as { keyValue?: object }).keyValue ?? {})[0] ?? "value";
    return jsonError(`That ${key} is already in use.`, 409);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return jsonError(Object.values(err.errors)[0]?.message ?? "Validation failed.", 400);
  }
  console.error("[admin api]", err);
  return jsonError("Something went wrong. Please try again.", 500);
}

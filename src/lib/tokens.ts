import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const secret = () => {
  const s = process.env.SIGNING_SECRET;
  if (!s) throw new Error("SIGNING_SECRET is not set");
  return s;
};

export const randomToken = () => randomBytes(32).toString("base64url");
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/**
 * Stateless signed link token: `<payload>.<hmac>`, payload = base64url(JSON{ sub, purpose, exp }).
 * Used for the booking link sent after an enquiry, so visitors can book without an account.
 */
export function signToken(sub: string, purpose: string, ttlSeconds: number) {
  const payload = Buffer.from(JSON.stringify({ sub, purpose, exp: Math.floor(Date.now() / 1000) + ttlSeconds })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string | null | undefined, purpose: string): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  // Compare canonical strings, not decoded bytes: base64 decoding ignores trailing pad bits,
  // so byte comparison would accept several spellings of the same signature.
  const expected = Buffer.from(createHmac("sha256", secret()).update(payload).digest("base64url"));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.purpose !== purpose || typeof data.sub !== "string" || data.exp < Date.now() / 1000) return null;
    return data.sub;
  } catch {
    return null;
  }
}

export const BOOKING_TOKEN_TTL = 60 * 60 * 24 * 14; // 14 days

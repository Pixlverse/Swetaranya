import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; failedAt?: number };

/** After a failed connect, fail fast for this long so pages fall back to defaults instead of each waiting on the database. */
const RETRY_AFTER_MS = 15_000;

// Reuse the connection across hot reloads and serverless invocations.
const globalForMongoose = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!cache.promise && cache.failedAt && Date.now() - cache.failedAt < RETRY_AFTER_MS) {
    throw new Error("MongoDB unreachable (recent connection attempt failed)");
  }
  // Mongoose waits 30s for a server by default, which leaves every page on its loading screen when the DB is down.
  cache.promise ??= mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 5_000 });
  try {
    cache.conn = await cache.promise;
    cache.failedAt = undefined;
  } catch (err) {
    cache.promise = null;
    cache.failedAt = Date.now();
    throw err;
  }
  return cache.conn;
}

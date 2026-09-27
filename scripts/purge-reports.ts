/**
 * Medical report retention purge, for running by hand or from a scheduled job.
 *   npm run purge:reports
 * Deletes reports past retentionExpiresAt (and pending uploads older than 24h) from the private bucket.
 *
 * Run with `--conditions=react-server` (the npm script does) so the `server-only` guard in src/lib resolves.
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

async function main() {
  // Imported after dotenv on purpose: src/lib/spaces.ts reads the SPACES_* variables at load time,
  // and static imports would be hoisted above config().
  const [{ default: mongoose }, { purgeExpiredReports }] = await Promise.all([import("mongoose"), import("../src/lib/retention")]);
  try {
    const r = await purgeExpiredReports();
    console.log(`Retention purge: ${r.deleted} deleted (${r.expired} expired, ${r.stalePending} stale pending), ${r.failed} failed.`);
    process.exitCode = r.failed ? 1 : 0;
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

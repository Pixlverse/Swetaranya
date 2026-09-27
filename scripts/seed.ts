/**
 * Loads Phase 1 placeholder content into MongoDB.
 *   npm run seed            — upsert content, keep enquiries/bookings
 *   npm run seed -- --fresh — wipe seeded collections first
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });


import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/db";
import { AdminUser, AvailabilitySlot, Condition, Ebook, JournalPost, PageContent, Testimonial, Therapy, Video } from "../src/models";
import { conditions, ebooks, journalPosts, testimonials, therapies, videos } from "../src/content/seed-data";
import { PAGE_DEFAULTS } from "../src/content/pages";

const fresh = process.argv.includes("--fresh");

async function main() {
  await connectDB();
  console.log(`Seeding ${mongoose.connection.name}${fresh ? " (fresh)" : ""}…`);

  if (fresh) {
    await Promise.all([Therapy, Condition, JournalPost, Testimonial, PageContent, AvailabilitySlot, Video, Ebook].map((m) => m.deleteMany({})));
  }

  // Admin + physician accounts
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-now";
  const passwordHash = await bcrypt.hash(password, 12);
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@swetaranya.local";
  await AdminUser.updateOne(
    { email: adminEmail },
    { $setOnInsert: { name: "Site admin", email: adminEmail, passwordHash, role: "admin" } },
    { upsert: true },
  );
  const physician = await AdminUser.findOneAndUpdate(
    { email: "physician@swetaranya.local" },
    { $setOnInsert: { name: "Dr. Thrivikraman Veluthat", email: "physician@swetaranya.local", passwordHash, role: "physician" } },
    { upsert: true, returnDocument: "after" },
  );

  for (const t of therapies) await Therapy.updateOne({ slug: t.slug }, { $set: t }, { upsert: true });
  const therapyIds = new Map((await Therapy.find().select("slug").lean()).map((t) => [t.slug, t._id]));

  for (const { therapySlugs, ...c } of conditions) {
    const relatedTherapies = therapySlugs.map((s) => therapyIds.get(s)).filter(Boolean);
    await Condition.updateOne({ slug: c.slug }, { $set: { ...c, relatedTherapies } }, { upsert: true });
  }

  for (const p of journalPosts) await JournalPost.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  // Insert-only, so re-seeding never overwrites what the team has edited in admin.
  for (const v of videos) await Video.updateOne({ slug: v.slug }, { $setOnInsert: v }, { upsert: true });
  for (const b of ebooks) await Ebook.updateOne({ slug: b.slug }, { $setOnInsert: b }, { upsert: true });

  // Placeholders carry no patient data, so they are never "published" through the consent gate;
  // public pages show them only under an explicit placeholder label (see lib/queries.ts).
  for (const t of testimonials) {
    await Testimonial.updateOne(
      { patientName: t.patientName },
      { $set: { ...t, isPlaceholder: true, consentGiven: false, published: false } },
      { upsert: true },
    );
  }

  for (const [pageKey, sections] of Object.entries(PAGE_DEFAULTS)) {
    await PageContent.updateOne(
      { pageKey },
      { $setOnInsert: { pageKey, sections: Object.entries(sections).map(([key, data]) => ({ key, data })) } },
      { upsert: true },
    );
  }

  // Two weeks of consultation slots, in IST (UTC+5:30), weekdays only.
  if ((await AvailabilitySlot.countDocuments({ startTime: { $gte: new Date() } })) === 0) {
    const slots = [];
    const times: [number, number, "online" | "in_person"][] = [
      [10, 0, "online"],
      [11, 30, "in_person"],
      [15, 0, "online"],
      [17, 0, "online"],
    ];
    for (let d = 1; d <= 14; d++) {
      const day = new Date();
      day.setUTCDate(day.getUTCDate() + d);
      if ([0, 6].includes(day.getUTCDay())) continue;
      for (const [h, m, mode] of times) {
        const start = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h, m) - 330 * 60_000);
        slots.push({ physicianId: physician!._id, startTime: start, endTime: new Date(start.getTime() + 45 * 60_000), mode });
      }
    }
    await AvailabilitySlot.insertMany(slots);
    console.log(`  ${slots.length} availability slots`);
  }

  console.log(`  ${therapies.length} therapies, ${conditions.length} conditions, ${journalPosts.length} journal posts, ${testimonials.length} placeholder testimonials, ${videos.length} videos, ${ebooks.length} e-books`);
  console.log(`  admin login: ${adminEmail} / physician@swetaranya.local  (password from SEED_ADMIN_PASSWORD)`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});

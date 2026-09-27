# Swetaranya — Phase 1

Next.js 16 (App Router) · MongoDB/Mongoose · NextAuth v4 · Tailwind v4 · Framer Motion. Project brief: `CLAUDE.md`.

## Run locally

```bash
cp .env.example .env.local        # fill NEXTAUTH_SECRET and SIGNING_SECRET (openssl rand -base64 32)
npm install
npm run seed                      # or: npm run seed -- --fresh
npm run dev
```

Admin: `/admin`. The seed creates `admin@swetaranya.local` (admin) and `physician@swetaranya.local` (physician). Both use `SEED_ADMIN_PASSWORD`.

What works without external credentials in development:
- **Resend:** emails are logged to the console instead of sent.
- **WhatsApp:** stubbed; messages are logged (`src/lib/whatsapp.ts`).
- **Spaces:** report uploads go to `/api/uploads/dev-sink`, which throws the file away. Nothing is written to disk, and the route is disabled in production.

## Where things live

| Area | Path |
| --- | --- |
| Brand tokens (the only colours Tailwind knows) | `src/app/globals.css` |
| Logos: official files in `public/`, rendered via `BrandLogo` | `src/components/brand/Logo.tsx` |
| Symbol vectors (motion + background only) | `src/components/brand/brandmark-paths.ts` |
| Compliance copy (Lifestyle Check disclaimer, medical disclaimer) | `src/lib/constants.ts` |
| Models, plus later-phase stubs | `src/models/` (`future.ts`) |
| Default page copy (admin edits layer on top) | `src/content/pages.ts` |
| Public pages | `src/app/(site)/` |
| Admin | `src/app/admin/`, `src/app/api/admin/` |

## Public pages

| Page | Route | Content comes from |
| --- | --- | --- |
| Home, About, Your Stay | `/`, `/about`, `/your-stay` | Admin → Page sections |
| The Swetaranya Way, Treatments, FAQs | `/the-swetaranya-way`, `/treatments`, `/faqs` | Admin → Page sections (conditions/therapies from their own modules) |
| A Day at Swetaranya | `/a-day-at-swetaranya` | Admin → Page sections (`a-day`) — the same timeline feeds Home and Your Stay |
| Conditions, therapies | `/treatments/conditions/[slug]`, `/treatments/therapies/[slug]` | Admin → Conditions / Therapies |
| Journal | `/journal`, `/journal/[slug]` | Admin → Journal |
| Experience (video library) | `/experience` | Admin → Videos (the one marked *featured* leads, with chapters) |
| Guides to take home (e-books) | `/ebooks` | Admin → E-books; downloads are logged as leads |
| Lifestyle Check | `/lifestyle-check` | Questions in `src/content/lifestyle.ts` |
| Know Your Constitution | `/constitution-check` | Questions in `src/content/constitution.ts` (placeholder — pending physician review) |
| Talk to the Physician | `/talk-to-the-physician` | Enquiry form → booking link |
| Book a consultation | `/book-a-consultation` | Short details → slot picker (stored as an enquiry) |

Compliance copy (Lifestyle Check and Constitution disclaimers, medical disclaimer) lives only in `src/lib/constants.ts`.

## Private medical reports

1. The enquiry API issues a single-use `UploadGrant`. Only a hash of the grant is stored.
2. `/api/uploads/presign` consumes the grant atomically and returns a presigned PUT, valid for 5 minutes, to the **private** Spaces bucket.
3. `/api/uploads/complete` checks the object exists, then attaches it to the enquiry.
4. After booking, the guest is emailed a fresh 7-day link to `/upload/[token]`.

Reports can only be viewed by users with the `physician` role, through a 5-minute signed GET. `MedicalReportUpload.fileUrl` is `select: false` and is stripped in `toJSON`.

The Spaces bucket needs a CORS rule allowing `PUT` from the site origin with the `Content-Type` header. Keep it private (no public-read), and use keys separate from Cloudinary.

## Scheduled job

Medical reports past `retentionExpiresAt` are deleted by `POST /api/cron/purge-reports` with `Authorization: Bearer $CRON_SECRET`. Schedule it daily as a DigitalOcean job, or run `npm run purge:reports`. Admins and physicians can also run it from Admin → Enquiries.

## Not built yet
- WhatsApp Cloud API wiring.
- Consultation reminder sender (`reminderSent` flag is already in place).
- Real photography and films. Admin-set images and video URLs show automatically; everything else is an honest placeholder (`Placeholder.tsx`).
- Real e-book PDFs (all three guides currently point at `public/ebooks/placeholder-guide.pdf`).

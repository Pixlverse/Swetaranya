Swetaranya — Phase 1 Build Prompt (for Claude Code)
Paste this as your first message to Claude Code, or save it as CLAUDE.md in the project root so it persists as project context across sessions.

You are building Phase 1 of a new website for Swetaranya, a traditional Ayurvedic home in Kerala, India. Stack: Next.js (App Router, TypeScript) + MongoDB + Mongoose, deployed on DigitalOcean. Read this entire brief before writing any code — it defines the brand, the scope, the data model, and — most importantly — the visual design bar. Treat the design guardrails in Section 3 as hard constraints, not suggestions.

1. What Swetaranya is (internalize this before designing anything)
   Swetaranya is not a hospital and not a resort. It's a traditional Ayurvedic home — a heritage ancestral property being expanded to welcome more guests — where treatment, daily life, and learning happen together, led personally by Chief Physician Dr. Thrivikraman Veluthat (25+ years of practice, including Kottakkal Arya Vaidya Sala).

Positioning: "A traditional Ayurvedic home where one comes to experience and learn Ayurveda." Treatment is central but not the whole identity.
One-line concept: "You don't simply come to Swetaranya for a treatment. You experience another way of living."
Three pillars: Live (food, routine, rest, nature) · Heal (personalised, physician-led care) · Learn (understand your body, carry it home).
Voice: Warm, calm, unhurried, honest — a host and a physician talking, never a brochure.
Guardrails (never violate these in copy or UI): no "cure" or guaranteed-result claims; real photos and real patients only (with consent) — dummy content in this phase must look obviously placeholder, never like stock/generic wellness imagery; the Lifestyle Check is a self-awareness tool, explicitly never presented as a medical diagnosis.
Every page should feel like it could only belong to Swetaranya — not to a generic Ayurveda resort or hospital site. When in doubt, ask: would this layout/copy look equally at home on a competitor's site? If yes, it's too generic. 2. Tech stack (decided — do not substitute without asking)
Layer Choice
Framework Next.js (App Router), TypeScript
UI React + Tailwind CSS
Animation Framer Motion
Database MongoDB (DigitalOcean Managed MongoDB), via Mongoose
Validation Zod, shared between React Hook Form and API routes
Auth (admin only) NextAuth.js (Auth.js), credentials provider, JWT session
Public media storage Cloudinary
Private storage (medical reports only) DigitalOcean Spaces — a completely separate bucket/credentials from Cloudinary; never mix public and PHI storage
Email Resend
WhatsApp Stub/mock in Phase 1 (// TODO: wire WhatsApp Cloud API) — build the interface but don't require real credentials to run
Hosting DigitalOcean App Platform (single containerised Next.js service)
Fonts Fraunces (headings — Google Fonts) + Lato (body/UI — Google Fonts)
Single Next.js app — no separate Express server. API routes under app/api/ cover the backend; Mongoose covers the data layer.

3. Design system — read this section twice
   3.1 Brand tokens (do not invent your own palette)
   --color-keppel: #59AA99; /_ primary — CTAs, accents, symbol _/
   --color-nordic: #1D393C; /_ secondary — dark sections, headings _/
   --color-terracotta: #AA6A59; /_ tertiary — warm accents, dividers, used sparingly _/
   --color-clay: #5E2B1E; /_ tertiary — rare, deep accent _/
   --color-blush: #DD9188; /_ tertiary — soft accent, illustration _/
   --color-cream: #F7F9F8; /_ background _/
   --color-ink: #14201F; /_ body text _/

--font-heading: 'Fraunces', serif;
--font-body: 'Lato', sans-serif;
Keppel / Nordic / Cream should carry ~90% of every screen. Tertiary earth tones are accents only — illustration line-work, category tags, dividers — never a dominant background or button color.

3.2 Do NOT build a generic AI-templated site. Specifically avoid:
The SaaS-card kit — identical rounded cards, one border-radius applied everywhere regardless of hierarchy, the same soft grey box-shadow under every card, gradient washes as decoration. Every content type (condition, therapy, Journal post, testimonial) needs its own visual treatment, not a shared card component reused unchanged everywhere.
Default AI color clichés — do not reach for a warm-cream-plus-terracotta-orange combo or a near-black-plus-acid-accent combo "by default." Use the brand tokens above, deliberately, on every screen.
Template chrome — no tracked-out ALL-CAPS eyebrow labels above every heading, no meta text joined with middots ("A · B · C"), no "01 / 02 / 03" numbering unless the content is a genuine sequence (the 8-step arrival journey and the Day-at-Swetaranya timeline ARE sequences; the three pillars or a therapy grid are NOT), no arrow (→) appended to every button/link.
Single-word-accent headlines — don't italicize or color-highlight one word in an otherwise plain heading. If a heading needs emphasis, rewrite the heading.
Scattered motion — do not fade-and-slide-up every section as it scrolls into view and call it "interactive." That reads as templated. See §3.3 for the actual motion approach.
Typography is an active design element: Fraunces at large display sizes should be composed deliberately (line breaks, scale, placement against imagery) — not just "big text at the top of a section."
Before building any new page or major component: write a short 3–4 line design plan (color/type/layout choices specific to this page's content) and check it against the anti-patterns above. If your plan matches a generic default, revise it and note what you changed. Only then write the code.

3.3 Motion & transitions
Pick one orchestrated animated moment per page and keep the rest calm — e.g. the Home hero's entrance sequence, the Lifestyle Check result reveal, the Day-at-Swetaranya timeline interaction. Don't apply the same reveal animation to every section on every page.
Route/page transitions: use Framer Motion AnimatePresence for a smooth cross-fade/slide between pages — the site should feel like moving through one continuous home, not jumping between disconnected pages.
Interaction-triggered motion (hover, tap, expand, submit, slot select) should show what changed — a lifted card, a confirming check animation on form submit, an easing accordion — not decoration for its own sake.
Respect prefers-reduced-motion everywhere.
The lotus/drop line-art from the brandmark is the one signature animated motif (SVG line-draw on the Home hero, used again as a section-divider accent). This is the single "boldness" moment — don't add competing decorative animation elsewhere. 4. Phase 1 scope — build exactly this, nothing from later phases
Pages:

Home — hero, Live/Heal/Learn, A Day at Swetaranya snippet, Lifestyle Check teaser, Meet the Physician, Stay teaser, video teaser, patient experiences, Journal teaser, final CTA
The Swetaranya Way — Live.Heal.Learn / What Happens When You Arrive (8-step) / Food at Swetaranya / Take Ayurveda Home
Treatments — Treatment Journey, Therapies (Panchakarma + individual, one page each), Conditions (back/neck pain, arthritis, Parkinsonism, insomnia/stress, obesity — one page each, answer-first with FAQs)
Your Stay — the ancestral home and rooms, A Day at Swetaranya (interactive timeline), what's included, International Guest Journey
Experience Swetaranya — chaptered video page
Journal — list + post pages, 5 fixed categories (Living Ayurveda, Understanding Ayurveda, Ayurvedic Treatment, Food & Daily Routine, Your Ayurveda Stay)
Lifestyle Check — 8-question self-assessment with animated result snapshot
About — physician, family, ancestral home story
Talk to the Physician — the single enquiry form (name, country, WhatsApp, email, what you need help with, online/in-person, message, optional medical report upload)
Consultation slot booking, reachable from the enquiry flow
Explicitly NOT in this phase (model the schema so they slot in later, but build no UI): Find Your Journey quiz, Ask Ayurveda, Home Tour, ebook download, stay planner, dosha quiz, seasonal calendar, WhatsApp community.

Header: logo + main nav + one persistent CTA button, "Talk to the Physician." Footer: Contact, FAQs, WhatsApp, Newsletter, Privacy, Medical disclaimer, current year.

5. Data models (Mongoose — build these first)
   Condition — slug, name, summary, heroImage, faqs[], relatedTherapies[], seoTitle, seoDescription
   Therapy — slug, name, category ('panchakarma' | 'individual'), description, duration, image
   JournalPost — slug, title, category (enum of the 5 fixed categories), body, author (default Dr. Thrivikraman), publishedAt, tags
   Testimonial — patientName, country, condition, quote, consentGiven (boolean, must be true to publish, enforce server-side not just UI), media[]
   LifestyleCheckResult — responses{sleep, food, digestion, movement, stress, routine, rest, energy}, scorePercentages{}, contactEmail, createdAt, followUpRequested
   Enquiry — type ('talk_to_physician'), name, country, whatsapp, email, message, enquiringForSomeoneElse (boolean), reportUploads[] (refs), utmSource, utmMedium, utmCampaign, status, createdAt
   AvailabilitySlot — physicianId, startTime, endTime, mode ('online' | 'in_person'), isBooked
   ConsultationBooking — enquiryId (ref), slotId (ref), timezone, confirmationSent, reminderSent
   MedicalReportUpload — enquiryId (ref), fileUrl (private bucket only), fileType, uploadedAt, consentCheckboxAccepted, retentionExpiresAt — never expose this in any public-facing API response
   AdminUser — name, email, passwordHash, role ('physician' | 'staff' | 'admin')
   PageContent — pageKey, sections[] (flexible JSON blocks) — lets admin edit Home/About/Your Stay copy without a schema change
6. Key functional flows
   Enquiry form: capture UTM params client-side on first landing, write to Enquiry, send a Resend confirmation email, include an "I am enquiring for someone else" toggle (reveals a second name field — families often enquire for an older relative).
   Consultation booking: admin manually manages AvailabilitySlot entries (no calendar-sync integration yet); visitor sees times converted to their own timezone client-side; booking creates a ConsultationBooking and marks the slot booked.
   Lifestyle Check: multi-step client component, computes scores client-side, saves a LifestyleCheckResult, always renders with a fixed disclaimer string from one shared constant — never hardcode the disclaimer text per-page, since it's a compliance point.
   Medical report upload: optional field in the enquiry form, plus a standalone private upload link sent after booking. Uploads write to the private DigitalOcean Spaces bucket via a signed, single-use, expiring URL — not a public write endpoint. Require a consent checkbox and store a retention period on the document.
7. Admin panel (/admin, NextAuth-protected)
   Build these modules: Dashboard (enquiry counts by source, upcoming consultations, recent Lifestyle Check submissions) · Enquiries (filter/status, view attached reports — role-gated to physician role) · Consultations (manage slots, view bookings) · Content CRUD for Conditions / Therapies / Journal / generic Page Sections · Testimonials (consent toggle gates publishing) · Lifestyle Check results (read-only, export, mark followed-up) · Settings (admin users/roles).

Admin UI uses Lato only, no serif — it's a tool, not a brand surface. It can look clean and functional; it does not need the same design bar as the public site.

8. Dummy content
   Seed realistic placeholder content matching real shape — 5 named conditions exactly as listed in §4, a handful of therapies, 3–4 Journal posts spread across the 5 categories, 2–3 testimonials clearly marked as placeholders (e.g. "Guest from Oman — placeholder testimonial, pending consented patient story"). No real patient data or names. Build a scripts/seed.ts that loads this into MongoDB with one command.

9. Build order
   Next.js + Mongo connection + auth scaffolding + design tokens (fonts, colors, Tailwind config)
   Mongoose models + seed script
   Public pages on seeded dummy content
   Enquiry form + UTM capture + Enquiry storage
   Consultation slots + booking flow
   Admin panel CRUD
   Lifestyle Check + the signature interactive components (Day timeline, arrival stepper)
   Medical report upload flow (private bucket, signed URLs)
   Work through this sequence. At the start of each step, restate what you're about to build and check it against the design guardrails in §3 before writing code. At the end of each step, give a short summary of what was built and flag anything that needed a judgment call.

10. Quality bar before considering any page "done"
    Responsive down to mobile
    Visible keyboard focus states
    prefers-reduced-motion respected
    No content type sharing an unmodified generic card component with another unrelated content type
    Every screen built from the brand tokens in §3.1 — no ad hoc colors
    Real accessibility basics: alt text on images, semantic headings, form labels


@AGENTS.md

import { z } from "zod";
import { ACCEPTED_REPORT_TYPES, CONSULTATION_MODES, HELP_TOPICS, MAX_REPORT_BYTES } from "@/lib/constants";

/** Shared by the Talk to the Physician form (React Hook Form) and POST /api/enquiries. */
export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, "Please tell us your name.").max(120),
    enquiringForSomeoneElse: z.boolean(),
    patientName: z.string().trim().max(120).optional(),
    relationship: z.string().trim().max(60).optional(),
    country: z.string().trim().min(2, "Which country are you writing from?").max(80),
    whatsapp: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{7,20}$/, "Please include your country code, e.g. +44 7700 900123."),
    email: z.string().trim().email("That email doesn't look quite right.").max(200),
    helpWith: z.enum(HELP_TOPICS, { message: "Please choose what you need help with." }),
    consultationMode: z.enum(CONSULTATION_MODES, { message: "Please choose online or in person." }),
    message: z.string().trim().max(4000).optional(),
    wantsReportUpload: z.boolean().optional(),
    reportConsent: z.boolean().optional(),
    // attribution (captured client-side on first landing)
    utmSource: z.string().max(200).optional(),
    utmMedium: z.string().max(200).optional(),
    utmCampaign: z.string().max(200).optional(),
    utmTerm: z.string().max(200).optional(),
    utmContent: z.string().max(200).optional(),
    landingPage: z.string().max(500).optional(),
    referrer: z.string().max(1000).optional(),
    /** Honeypot — real people never fill this in. */
    website: z.string().max(0).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.enquiringForSomeoneElse && !v.patientName?.trim())
      ctx.addIssue({ code: "custom", path: ["patientName"], message: "Please tell us the name of the person who needs care." });
    if (v.wantsReportUpload && !v.reportConsent)
      ctx.addIssue({ code: "custom", path: ["reportConsent"], message: "Please agree to how we store your report, or remove the file." });
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const reportFileSchema = z.object({
  fileType: z.enum(ACCEPTED_REPORT_TYPES, { message: "Reports can be PDF, JPG or PNG." }),
  sizeBytes: z.number().int().positive().max(MAX_REPORT_BYTES, "Reports can be up to 15 MB."),
  originalName: z.string().max(255),
});

export const bookingSchema = z.object({
  token: z.string().min(10),
  slotId: z.string().regex(/^[a-f0-9]{24}$/),
  timezone: z.string().min(1).max(64),
});

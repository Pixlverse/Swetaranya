import { requireAdmin } from "@/lib/auth";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata = { title: "New testimonial" };

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New testimonial" actions={<ButtonLink variant="secondary" href="/admin/testimonials">Back to testimonials</ButtonLink>} />
      <TestimonialForm initial={{ patientName: "", country: "", condition: "", quote: "", consentGiven: false, published: false, media: [] }} />
    </>
  );
}

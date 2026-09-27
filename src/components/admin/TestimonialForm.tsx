"use client";

import { useState } from "react";
import type { TestimonialInput } from "@/lib/validation/admin";
import { Checkbox, FormFooter } from "./fields";
import { Button, Field, Notice, Panel, inputClass } from "./ui";
import { useSave } from "./useSave";
import { ImageUrlInput } from "./ImageField";
import { ActionButton } from "./actions";

export type TestimonialFormValues = TestimonialInput;

export function TestimonialForm({ id, initial, isPlaceholder = false }: { id?: string; initial: TestimonialFormValues; isPlaceholder?: boolean }) {
  const isNew = !id;
  const [v, setV] = useState(initial);
  const { save, busy, error, saved } = useSave({
    createUrl: "/api/admin/testimonials",
    updateUrl: id && `/api/admin/testimonials/${id}`,
    updateMethod: "PATCH",
    listHref: "/admin/testimonials",
  });
  const set = <K extends keyof TestimonialFormValues>(k: K, value: TestimonialFormValues[K]) => setV((p) => ({ ...p, [k]: value }));
  const setMedia = (i: number, patch: Partial<TestimonialFormValues["media"][number]>) =>
    set("media", v.media.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  const publishBlocked = isPlaceholder ? "Placeholder testimonials cannot be published." : !v.consentGiven ? "Record patient consent before publishing." : undefined;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(v);
      }}
      className="space-y-6"
    >
      {isPlaceholder && (
        <Notice tone="warning">
          This is a seeded placeholder. It is shown publicly only through the clearly labelled placeholder path, and it can never be published as a real
          patient story. Replace it with a consented testimonial when one is available.
        </Notice>
      )}
      <Panel title="Story">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Name as it should appear" htmlFor="ts-name" hint="Use the guest's preferred form, e.g. first name only.">
            <input id="ts-name" value={v.patientName} onChange={(e) => set("patientName", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Country" htmlFor="ts-country">
            <input id="ts-country" value={v.country} onChange={(e) => set("country", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Condition (optional)" htmlFor="ts-condition">
            <input id="ts-condition" value={v.condition} onChange={(e) => set("condition", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Quote" htmlFor="ts-quote" className="md:col-span-3" hint="The guest's own words. No cure or guaranteed-result claims.">
            <textarea id="ts-quote" rows={5} value={v.quote} onChange={(e) => set("quote", e.target.value)} required className={inputClass} />
          </Field>
        </div>
      </Panel>

      <Panel
        title={`Media (${v.media.length})`}
        actions={
          <Button variant="secondary" onClick={() => set("media", [...v.media, { kind: "image", url: "", alt: "" }])}>
            Add media
          </Button>
        }
      >
        {v.media.length === 0 ? (
          <p className="text-sm text-ink/60">No photos or video attached.</p>
        ) : (
          <ul className="space-y-3">
            {v.media.map((m, i) => (
              <li key={i} className="grid gap-3 rounded-hair border border-nordic/15 p-3 md:grid-cols-[8rem_1fr_1fr_auto] md:items-start">
                <Field label="Type" htmlFor={`m-kind-${i}`}>
                  <select id={`m-kind-${i}`} value={m.kind} onChange={(e) => setMedia(i, { kind: e.target.value as "image" | "video" })} className={inputClass}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </Field>
                <Field label="URL" htmlFor={`m-url-${i}`}>
                  {m.kind === "image" ? (
                    <ImageUrlInput id={`m-url-${i}`} value={m.url} onChange={(url) => setMedia(i, { url })} required />
                  ) : (
                    <input id={`m-url-${i}`} type="url" value={m.url} onChange={(e) => setMedia(i, { url: e.target.value })} required className={inputClass} />
                  )}
                </Field>
                <Field label="Alt text / caption" htmlFor={`m-alt-${i}`}>
                  <input id={`m-alt-${i}`} value={m.alt} onChange={(e) => setMedia(i, { alt: e.target.value })} className={inputClass} />
                </Field>
                <Button variant="ghost" className="md:mt-6" onClick={() => set("media", v.media.filter((_, j) => j !== i))} aria-label={`Remove media ${i + 1}`}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Consent and publishing">
        <div className="space-y-4">
          <Checkbox
            id="ts-consent"
            label="The patient has given written consent to publish this story"
            checked={v.consentGiven}
            onChange={(x) => setV((p) => ({ ...p, consentGiven: x, published: x ? p.published : false }))}
            hint="Withdrawing consent unpublishes the testimonial immediately on save."
          />
          <Checkbox
            id="ts-published"
            label="Published on the site"
            checked={v.published}
            disabled={Boolean(publishBlocked)}
            onChange={(x) => set("published", x)}
            hint={publishBlocked}
          />
        </div>
      </Panel>

      <FormFooter busy={busy} error={error} saved={saved} isNew={isNew}>
        {id && (
          <ActionButton
            url={`/api/admin/testimonials/${id}`}
            method="DELETE"
            label="Delete"
            variant="danger"
            confirm="Delete this testimonial? This cannot be undone."
            redirectTo="/admin/testimonials"
          />
        )}
      </FormFooter>
    </form>
  );
}

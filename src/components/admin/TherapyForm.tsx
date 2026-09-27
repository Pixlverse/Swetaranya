"use client";

import { useState } from "react";
import type { TherapyInput } from "@/lib/validation/admin";
import { Checkbox, FormFooter, MARKDOWN_HINT, SlugField, useSlug } from "./fields";
import { Field, Panel, inputClass } from "./ui";
import { useSave } from "./useSave";
import { ImageField } from "./ImageField";
import { ActionButton } from "./actions";

export type TherapyFormValues = Omit<TherapyInput, "slug" | "order"> & { order: number };

export function TherapyForm({ id, initial, initialSlug }: { id?: string; initial: TherapyFormValues; initialSlug: string }) {
  const isNew = !id;
  const [v, setV] = useState(initial);
  const slug = useSlug(initialSlug, isNew);
  const { save, busy, error, saved } = useSave({ createUrl: "/api/admin/therapies", updateUrl: id && `/api/admin/therapies/${id}`, listHref: "/admin/therapies" });
  const set = <K extends keyof TherapyFormValues>(k: K, value: TherapyFormValues[K]) => setV((p) => ({ ...p, [k]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save({ ...v, slug: slug.slug });
      }}
      className="space-y-6"
    >
      <Panel title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" htmlFor="t-name">
            <input
              id="t-name"
              value={v.name}
              onChange={(e) => {
                set("name", e.target.value);
                slug.follow(e.target.value);
              }}
              required
              className={inputClass}
            />
          </Field>
          <SlugField id="t-slug" value={slug.slug} onChange={slug.edit} onSuggest={() => slug.suggest(v.name)} publicPath="/treatments/therapies" />
          <Field label="Malayalam / Sanskrit name" htmlFor="t-ml">
            <input id="t-ml" value={v.malayalamName} onChange={(e) => set("malayalamName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Category" htmlFor="t-cat">
            <select id="t-cat" value={v.category} onChange={(e) => set("category", e.target.value as TherapyFormValues["category"])} className={inputClass}>
              <option value="panchakarma">Panchakarma</option>
              <option value="individual">Individual therapy</option>
            </select>
          </Field>
          <Field label="Duration" htmlFor="t-dur" hint="As guests should read it, e.g. “45–60 minutes, 7–14 days”.">
            <input id="t-dur" value={v.duration} onChange={(e) => set("duration", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Order" htmlFor="t-order" hint="Lower numbers are listed first.">
            <input id="t-order" type="number" min={0} value={v.order} onChange={(e) => set("order", Number(e.target.value))} className={inputClass} />
          </Field>
          <Field label="Summary" htmlFor="t-summary" className="md:col-span-2">
            <textarea id="t-summary" rows={2} value={v.summary} onChange={(e) => set("summary", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Description" htmlFor="t-desc" className="md:col-span-2" hint={MARKDOWN_HINT}>
            <textarea id="t-desc" rows={10} value={v.description} onChange={(e) => set("description", e.target.value)} required className={`${inputClass} font-mono`} />
          </Field>
        </div>
      </Panel>

      <Panel title="Image and publishing">
        <div className="grid gap-4 md:grid-cols-2">
          <ImageField id="t-img" value={v.image} onChange={(x) => set("image", x)} />
          <Checkbox id="t-published" label="Published" checked={v.published} onChange={(x) => set("published", x)} hint="Unpublished therapies are hidden from the public site." />
        </div>
      </Panel>

      <FormFooter busy={busy} error={error} saved={saved} isNew={isNew}>
        {id && (
          <ActionButton
            url={`/api/admin/therapies/${id}`}
            method="DELETE"
            label="Delete"
            variant="danger"
            confirm={`Delete “${v.name}”? It will also be removed from any condition's related therapies.`}
            redirectTo="/admin/therapies"
          />
        )}
      </FormFooter>
    </form>
  );
}

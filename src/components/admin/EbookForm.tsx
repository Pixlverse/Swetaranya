"use client";

import { useState } from "react";
import type { EbookInput } from "@/lib/validation/admin";
import { Checkbox, FormFooter, SlugField, StringListEditor, useSlug } from "./fields";
import { Field, Panel, inputClass } from "./ui";
import { useSave } from "./useSave";
import { ActionButton } from "./actions";
import { ImageField } from "./ImageField";

export type EbookFormValues = Omit<EbookInput, "slug" | "order" | "pages"> & { order: number; pages: number | null };

export function EbookForm({ id, initial, initialSlug }: { id?: string; initial: EbookFormValues; initialSlug: string }) {
  const isNew = !id;
  const [v, setV] = useState(initial);
  const slug = useSlug(initialSlug, isNew);
  const { save, busy, error, saved } = useSave({ createUrl: "/api/admin/ebooks", updateUrl: id && `/api/admin/ebooks/${id}`, listHref: "/admin/ebooks" });
  const set = <K extends keyof EbookFormValues>(k: K, value: EbookFormValues[K]) => setV((p) => ({ ...p, [k]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save({ ...v, slug: slug.slug, contents: v.contents.map((c) => c.trim()).filter(Boolean) });
      }}
      className="space-y-6"
    >
      <Panel title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" htmlFor="e-title">
            <input
              id="e-title"
              value={v.title}
              onChange={(e) => {
                set("title", e.target.value);
                slug.follow(e.target.value);
              }}
              required
              className={inputClass}
            />
          </Field>
          <SlugField id="e-slug" value={slug.slug} onChange={slug.edit} onSuggest={() => slug.suggest(v.title)} suggestLabel="From title" />
          <Field label="Subtitle" htmlFor="e-sub" className="md:col-span-2">
            <input id="e-sub" value={v.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Description" htmlFor="e-desc" className="md:col-span-2">
            <textarea id="e-desc" rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
          <div className="md:col-span-2">
            <StringListEditor
              id="e-contents"
              label="What's inside"
              hint="Short lines, one per point. Empty lines are dropped on save."
              items={v.contents}
              onChange={(x) => set("contents", x)}
              addLabel="Add a line"
            />
          </div>
        </div>
      </Panel>

      <Panel title="File and cover">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="File URL"
            htmlFor="e-file"
            className="md:col-span-2"
            hint="The PDF guests download: a full URL (e.g. Cloudinary) or a path on this site such as /ebooks/daily-routine.pdf. Public — never put anything private here."
          >
            <input id="e-file" value={v.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} className={inputClass} spellCheck={false} placeholder="/ebooks/…pdf" />
          </Field>
          <Field label="Pages" htmlFor="e-pages" hint="Optional.">
            <input
              id="e-pages"
              type="number"
              min={1}
              value={v.pages ?? ""}
              onChange={(e) => set("pages", e.target.value === "" ? null : Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Order" htmlFor="e-order" hint="Lower numbers are listed first.">
            <input id="e-order" type="number" min={0} value={v.order} onChange={(e) => set("order", Number(e.target.value))} className={inputClass} />
          </Field>
          <ImageField id="e-cover" label="Cover image URL (Cloudinary)" hint="Leave empty to show the placeholder cover." value={v.cover} onChange={(x) => set("cover", x)} />
        </div>
      </Panel>

      <Panel title="Download and publishing">
        <div className="space-y-3">
          <Checkbox
            id="e-email"
            label="Ask for an email before download"
            checked={v.requiresEmail}
            onChange={(x) => set("requiresEmail", x)}
            hint="Guests leave their name and email (listed under E-book downloads) before the file opens."
          />
          <Checkbox id="e-published" label="Published" checked={v.published} onChange={(x) => set("published", x)} hint="Unpublished e-books are hidden from the public site." />
        </div>
      </Panel>

      <FormFooter busy={busy} error={error} saved={saved} isNew={isNew}>
        {id && (
          <ActionButton
            url={`/api/admin/ebooks/${id}`}
            method="DELETE"
            label="Delete"
            variant="danger"
            confirm={`Delete “${v.title}”? Its download records are kept.`}
            redirectTo="/admin/ebooks"
          />
        )}
      </FormFooter>
    </form>
  );
}

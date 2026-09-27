"use client";

import { useState } from "react";
import { JOURNAL_CATEGORIES } from "@/lib/constants";
import type { JournalPostInput } from "@/lib/validation/admin";
import { Checkbox, FormFooter, MARKDOWN_HINT, SlugField, useSlug } from "./fields";
import { Field, Panel, inputClass } from "./ui";
import { useSave } from "./useSave";
import { ActionButton } from "./actions";

export type JournalFormValues = Omit<JournalPostInput, "slug" | "tags" | "publishedAt"> & { tags: string; publishedAt: string };

export function JournalForm({ id, initial, initialSlug }: { id?: string; initial: JournalFormValues; initialSlug: string }) {
  const isNew = !id;
  const [v, setV] = useState(initial);
  const slug = useSlug(initialSlug, isNew);
  const { save, busy, error, saved } = useSave({ createUrl: "/api/admin/journal", updateUrl: id && `/api/admin/journal/${id}`, listHref: "/admin/journal" });
  const set = <K extends keyof JournalFormValues>(k: K, value: JournalFormValues[K]) => setV((p) => ({ ...p, [k]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save({
          ...v,
          slug: slug.slug,
          // datetime-local is IST wall-clock in this panel.
          publishedAt: v.publishedAt ? `${v.publishedAt}:00+05:30` : "",
          tags: v.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        });
      }}
      className="space-y-6"
    >
      <Panel title="Post">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" htmlFor="j-title" className="md:col-span-2">
            <input
              id="j-title"
              value={v.title}
              onChange={(e) => {
                set("title", e.target.value);
                slug.follow(e.target.value);
              }}
              required
              className={inputClass}
            />
          </Field>
          <SlugField id="j-slug" value={slug.slug} onChange={slug.edit} onSuggest={() => slug.suggest(v.title)} publicPath="/journal" />
          <Field label="Category" htmlFor="j-cat">
            <select id="j-cat" value={v.category} onChange={(e) => set("category", e.target.value as JournalFormValues["category"])} className={inputClass}>
              {JOURNAL_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Excerpt" htmlFor="j-excerpt" className="md:col-span-2" hint="One or two sentences for the Journal list.">
            <textarea id="j-excerpt" rows={2} value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Body" htmlFor="j-body" className="md:col-span-2" hint={MARKDOWN_HINT}>
            <textarea id="j-body" rows={18} value={v.body} onChange={(e) => set("body", e.target.value)} required className={`${inputClass} font-mono leading-relaxed`} />
          </Field>
        </div>
      </Panel>

      <Panel title="Details and publishing">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Author" htmlFor="j-author">
            <input id="j-author" value={v.author} onChange={(e) => set("author", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Publish date (IST)" htmlFor="j-date">
            <input id="j-date" type="datetime-local" value={v.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Tags" htmlFor="j-tags" hint="Comma-separated.">
            <input id="j-tags" value={v.tags} onChange={(e) => set("tags", e.target.value)} className={inputClass} />
          </Field>
          <div className="self-end">
            <Checkbox id="j-published" label="Published" checked={v.published} onChange={(x) => set("published", x)} hint="Unpublished posts are hidden from the Journal." />
          </div>
        </div>
      </Panel>

      <FormFooter busy={busy} error={error} saved={saved} isNew={isNew}>
        {id && (
          <ActionButton url={`/api/admin/journal/${id}`} method="DELETE" label="Delete" variant="danger" confirm={`Delete “${v.title}”? This cannot be undone.`} redirectTo="/admin/journal" />
        )}
      </FormFooter>
    </form>
  );
}

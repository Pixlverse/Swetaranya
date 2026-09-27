"use client";

import { useState } from "react";
import { formatTimecode, parseTimecode, type VideoInput } from "@/lib/validation/admin";
import { Checkbox, FormFooter, ItemControls, SlugField, moveItem, useSlug } from "./fields";
import { Button, Field, Panel, inputClass } from "./ui";
import { useSave } from "./useSave";
import { ActionButton } from "./actions";
import { ImageField } from "./ImageField";

type Chapter = { title: string; time: string; body: string };
export type VideoFormValues = Omit<VideoInput, "slug" | "order" | "chapters"> & { order: number; chapters: { title: string; seconds: number; body: string }[] };

export function VideoForm({
  id,
  initial,
  initialSlug,
  categories,
}: {
  id?: string;
  initial: VideoFormValues;
  initialSlug: string;
  categories: { slug: string; label: string }[];
}) {
  const isNew = !id;
  const { chapters: initialChapters, ...rest } = initial;
  const [v, setV] = useState(rest);
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters.map((c) => ({ title: c.title, time: formatTimecode(c.seconds), body: c.body })));
  const [localError, setLocalError] = useState<string | null>(null);
  const slug = useSlug(initialSlug, isNew);
  const { save, busy, error, saved } = useSave({ createUrl: "/api/admin/videos", updateUrl: id && `/api/admin/videos/${id}`, listHref: "/admin/videos" });
  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => setV((p) => ({ ...p, [k]: value }));
  const setChapter = (i: number, patch: Partial<Chapter>) => setChapters((all) => all.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const parsed: VideoFormValues["chapters"] = [];
    for (const [i, c] of chapters.entries()) {
      const seconds = parseTimecode(c.time);
      if (seconds === null) return setLocalError(`Chapter ${i + 1}: enter the start time as m:ss, e.g. 1:30.`);
      parsed.push({ title: c.title, seconds, body: c.body });
    }
    save({ ...v, slug: slug.slug, chapters: parsed });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Panel title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" htmlFor="v-title">
            <input
              id="v-title"
              value={v.title}
              onChange={(e) => {
                set("title", e.target.value);
                slug.follow(e.target.value);
              }}
              required
              className={inputClass}
            />
          </Field>
          <SlugField id="v-slug" value={slug.slug} onChange={slug.edit} onSuggest={() => slug.suggest(v.title)} suggestLabel="From title" />
          <Field label="Category" htmlFor="v-cat">
            <select id="v-cat" value={v.category} onChange={(e) => set("category", e.target.value as VideoFormValues["category"])} className={inputClass}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Duration" htmlFor="v-dur" hint="As guests should read it, e.g. “6 min”.">
            <input id="v-dur" value={v.duration} onChange={(e) => set("duration", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Video URL" htmlFor="v-url" className="md:col-span-2" hint="A YouTube or Vimeo link, or a direct video file (e.g. a Cloudinary MP4). Leave empty until the film is ready.">
            <input id="v-url" type="url" value={v.url} onChange={(e) => set("url", e.target.value)} className={inputClass} placeholder="https://www.youtube.com/watch?v=…" />
          </Field>
          <Field label="Description" htmlFor="v-desc" className="md:col-span-2">
            <textarea id="v-desc" rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Panel>

      <Panel
        title={`Chapters (${chapters.length})`}
        actions={
          <Button variant="secondary" onClick={() => setChapters((all) => [...all, { title: "", time: "", body: "" }])}>
            Add chapter
          </Button>
        }
      >
        {chapters.length === 0 ? (
          <p className="text-sm text-ink/60">No chapters. Chapters let guests jump to the part of the film they are curious about.</p>
        ) : (
          <ol className="space-y-3">
            {chapters.map((c, i) => (
              <li key={i} className="rounded-hair border border-nordic/15 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-nordic">Chapter {i + 1}</span>
                  <ItemControls
                    index={i}
                    count={chapters.length}
                    itemLabel={`chapter ${i + 1}`}
                    onMove={(to) => setChapters((all) => moveItem(all, i, to))}
                    onRemove={() => setChapters((all) => all.filter((_, j) => j !== i))}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-[8rem_1fr]">
                  <Field label="Starts at" htmlFor={`ch-time-${i}`} hint="m:ss">
                    <input
                      id={`ch-time-${i}`}
                      value={c.time}
                      onChange={(e) => setChapter(i, { time: e.target.value })}
                      required
                      inputMode="numeric"
                      placeholder="1:30"
                      aria-invalid={c.time !== "" && parseTimecode(c.time) === null}
                      className={`${inputClass} tabular-nums`}
                    />
                  </Field>
                  <Field label="Title" htmlFor={`ch-title-${i}`}>
                    <input id={`ch-title-${i}`} value={c.title} onChange={(e) => setChapter(i, { title: e.target.value })} required className={inputClass} />
                  </Field>
                  <Field label="Note (optional)" htmlFor={`ch-body-${i}`} className="md:col-span-2">
                    <textarea id={`ch-body-${i}`} rows={2} value={c.body} onChange={(e) => setChapter(i, { body: e.target.value })} className={inputClass} />
                  </Field>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <Panel title="Thumbnail and publishing">
        <div className="grid gap-4 md:grid-cols-2">
          <ImageField id="v-thumb" label="Thumbnail URL (Cloudinary)" hint="A still from the film, taken at Swetaranya. Leave empty to show the placeholder." value={v.thumbnail} onChange={(x) => set("thumbnail", x)} />
          <Field label="Order" htmlFor="v-order" hint="Lower numbers are listed first.">
            <input id="v-order" type="number" min={0} value={v.order} onChange={(e) => set("order", Number(e.target.value))} className={inputClass} />
          </Field>
          <div className="space-y-3 md:col-span-2">
            <Checkbox
              id="v-featured"
              label="Featured"
              checked={v.featured}
              onChange={(x) => set("featured", x)}
              hint="The featured video leads the Experience page with its chapters. Only one can be featured: saving this un-features any other."
            />
            <Checkbox id="v-published" label="Published" checked={v.published} onChange={(x) => set("published", x)} hint="Unpublished videos are hidden from the public site." />
          </div>
        </div>
      </Panel>

      <FormFooter busy={busy} error={localError ?? error} saved={saved} isNew={isNew}>
        {id && (
          <ActionButton url={`/api/admin/videos/${id}`} method="DELETE" label="Delete" variant="danger" confirm={`Delete “${v.title}”?`} redirectTo="/admin/videos" />
        )}
      </FormFooter>
    </form>
  );
}

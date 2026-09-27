"use client";

import { useState } from "react";
import type { ConditionInput } from "@/lib/validation/admin";
import { Checkbox, FormFooter, MARKDOWN_HINT, SlugField, useSlug } from "./fields";
import { Button, Field, Panel, inputClass } from "./ui";
import { useSave } from "./useSave";
import { ImageField } from "./ImageField";
import { ActionButton } from "./actions";

export type ConditionFormValues = Omit<ConditionInput, "slug" | "order"> & { order: number };

export function ConditionForm({
  id,
  initial,
  initialSlug,
  therapies,
}: {
  id?: string;
  initial: ConditionFormValues;
  initialSlug: string;
  therapies: { id: string; name: string; category: string }[];
}) {
  const isNew = !id;
  const [v, setV] = useState(initial);
  const slug = useSlug(initialSlug, isNew);
  const { save, busy, error, saved } = useSave({ createUrl: "/api/admin/conditions", updateUrl: id && `/api/admin/conditions/${id}`, listHref: "/admin/conditions" });
  const set = <K extends keyof ConditionFormValues>(k: K, value: ConditionFormValues[K]) => setV((p) => ({ ...p, [k]: value }));

  const setFaq = (i: number, key: "question" | "answer", value: string) => set("faqs", v.faqs.map((f, j) => (j === i ? { ...f, [key]: value } : f)));
  const moveFaq = (i: number, dir: -1 | 1) => {
    const next = [...v.faqs];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set("faqs", next);
  };
  const toggleTherapy = (tid: string) =>
    set("relatedTherapies", v.relatedTherapies.includes(tid) ? v.relatedTherapies.filter((x) => x !== tid) : [...v.relatedTherapies, tid]);

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
          <Field label="Name" htmlFor="c-name">
            <input
              id="c-name"
              value={v.name}
              onChange={(e) => {
                set("name", e.target.value);
                slug.follow(e.target.value);
              }}
              required
              className={inputClass}
            />
          </Field>
          <SlugField id="c-slug" value={slug.slug} onChange={slug.edit} onSuggest={() => slug.suggest(v.name)} publicPath="/treatments/conditions" />
          <Field label="Summary (the direct answer shown first)" htmlFor="c-summary" className="md:col-span-2" hint="Plain, honest, no cure or guaranteed-result claims.">
            <textarea id="c-summary" rows={3} value={v.summary} onChange={(e) => set("summary", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="How Swetaranya approaches it" htmlFor="c-approach" className="md:col-span-2" hint={MARKDOWN_HINT}>
            <textarea id="c-approach" rows={8} value={v.approach} onChange={(e) => set("approach", e.target.value)} className={`${inputClass} font-mono`} />
          </Field>
          <Field label="What to expect" htmlFor="c-expect" className="md:col-span-2" hint={MARKDOWN_HINT}>
            <textarea id="c-expect" rows={6} value={v.whatToExpect} onChange={(e) => set("whatToExpect", e.target.value)} className={`${inputClass} font-mono`} />
          </Field>
        </div>
      </Panel>

      <Panel title="Hero image">
        <div className="grid gap-4 md:grid-cols-2">
          <ImageField id="c-img" value={v.heroImage} onChange={(x) => set("heroImage", x)} />
        </div>
      </Panel>

      <Panel
        title={`FAQs (${v.faqs.length})`}
        actions={
          <Button variant="secondary" onClick={() => set("faqs", [...v.faqs, { question: "", answer: "" }])}>
            Add FAQ
          </Button>
        }
      >
        {v.faqs.length === 0 ? (
          <p className="text-sm text-ink/60">No FAQs yet.</p>
        ) : (
          <ol className="space-y-4">
            {v.faqs.map((f, i) => (
              <li key={i} className="rounded-hair border border-nordic/15 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-nordic/70">FAQ {i + 1}</span>
                  <span className="flex gap-1">
                    <Button variant="ghost" onClick={() => moveFaq(i, -1)} disabled={i === 0} aria-label={`Move FAQ ${i + 1} up`}>
                      Up
                    </Button>
                    <Button variant="ghost" onClick={() => moveFaq(i, 1)} disabled={i === v.faqs.length - 1} aria-label={`Move FAQ ${i + 1} down`}>
                      Down
                    </Button>
                    <Button variant="ghost" onClick={() => set("faqs", v.faqs.filter((_, j) => j !== i))} aria-label={`Remove FAQ ${i + 1}`}>
                      Remove
                    </Button>
                  </span>
                </div>
                <Field label="Question" htmlFor={`faq-q-${i}`}>
                  <input id={`faq-q-${i}`} value={f.question} onChange={(e) => setFaq(i, "question", e.target.value)} required className={inputClass} />
                </Field>
                <Field label="Answer" htmlFor={`faq-a-${i}`} className="mt-2">
                  <textarea id={`faq-a-${i}`} rows={3} value={f.answer} onChange={(e) => setFaq(i, "answer", e.target.value)} required className={inputClass} />
                </Field>
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <Panel title={`Related therapies (${v.relatedTherapies.length} selected)`}>
        {therapies.length === 0 ? (
          <p className="text-sm text-ink/60">No therapies exist yet.</p>
        ) : (
          <fieldset>
            <legend className="sr-only">Related therapies</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {therapies.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={v.relatedTherapies.includes(t.id)} onChange={() => toggleTherapy(t.id)} className="size-4 accent-keppel" />
                  {t.name}
                  <span className="text-xs text-ink/50">{t.category === "panchakarma" ? "Panchakarma" : "Individual"}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </Panel>

      <Panel title="SEO and publishing">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SEO title" htmlFor="c-seo-title" hint={`${(v.seoTitle ?? "").length}/120. Falls back to the name.`}>
            <input id="c-seo-title" value={v.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} maxLength={120} className={inputClass} />
          </Field>
          <Field label="Order" htmlFor="c-order" hint="Lower numbers are listed first.">
            <input id="c-order" type="number" min={0} value={v.order} onChange={(e) => set("order", Number(e.target.value))} className={inputClass} />
          </Field>
          <Field label="SEO description" htmlFor="c-seo-desc" className="md:col-span-2" hint={`${(v.seoDescription ?? "").length}/320. Falls back to the summary.`}>
            <textarea id="c-seo-desc" rows={2} value={v.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} maxLength={320} className={inputClass} />
          </Field>
          <Checkbox id="c-published" label="Published" checked={v.published} onChange={(x) => set("published", x)} hint="Unpublished conditions are hidden from the public site." />
        </div>
      </Panel>

      <FormFooter busy={busy} error={error} saved={saved} isNew={isNew}>
        {id && (
          <ActionButton
            url={`/api/admin/conditions/${id}`}
            method="DELETE"
            label="Delete"
            variant="danger"
            confirm={`Delete “${v.name}”? This cannot be undone.`}
            redirectTo="/admin/conditions"
          />
        )}
      </FormFooter>
    </form>
  );
}

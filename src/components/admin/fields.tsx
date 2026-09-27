"use client";

import { useState } from "react";
import { slugify } from "@/lib/validation/admin";
import { Button, Field, inputClass } from "./ui";

/** Slug input that follows the name until someone edits it by hand. Existing records keep their slug. */
export function useSlug(initial: string, isNew: boolean) {
  const [slug, setSlug] = useState(initial);
  const [touched, setTouched] = useState(!isNew);
  return {
    slug,
    follow: (name: string) => {
      if (!touched) setSlug(slugify(name));
    },
    edit: (value: string) => {
      setTouched(true);
      setSlug(value);
    },
    suggest: (name: string) => {
      setTouched(true);
      setSlug(slugify(name));
    },
  };
}

export function SlugField({
  id,
  value,
  onChange,
  onSuggest,
  publicPath,
  suggestLabel = "From name",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onSuggest: () => void;
  /** Omit for content without its own page; the slug is then just a stable identifier. */
  publicPath?: string;
  suggestLabel?: string;
}) {
  const hint = publicPath ? (
    <>Public URL: {publicPath}/{value || "…"}. Changing a published slug breaks existing links.</>
  ) : (
    "A stable identifier used by the site. Lowercase letters, numbers and hyphens."
  );
  return (
    <Field label="Slug" htmlFor={id} hint={hint}>
      <div className="flex gap-2">
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} required className={inputClass} spellCheck={false} />
        <Button variant="secondary" onClick={onSuggest} className="shrink-0">
          {suggestLabel}
        </Button>
      </div>
    </Field>
  );
}

export function Checkbox({ id, label, checked, onChange, hint, disabled }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string; disabled?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className={`flex items-center gap-2 text-sm font-bold ${disabled ? "text-ink/50" : "text-nordic"}`}>
        <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-keppel" />
        {label}
      </label>
      {hint && <p className="mt-1 pl-6 text-xs text-ink/60">{hint}</p>}
    </div>
  );
}

export function FormFooter({ busy, error, saved, isNew, children }: { busy: boolean; error: string | null; saved: boolean; isNew: boolean; children?: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-nordic/10 bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : isNew ? "Create" : "Save changes"}
      </Button>
      {saved && (
        <span role="status" className="text-sm text-nordic">
          Saved.
        </span>
      )}
      {error && (
        <span role="alert" className="text-sm font-bold text-clay">
          {error}
        </span>
      )}
      <span className="ml-auto flex gap-2">{children}</span>
    </div>
  );
}

export const MARKDOWN_HINT = "Markdown-lite: separate paragraphs with a blank line; start a line with “## ” for a heading, “- ” for a list item, “> ” for a quote.";

/** Move an array item from one index to another, returning a new array. */
export function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Up / down / remove controls for one item in a repeatable list. */
export function ItemControls({ index, count, itemLabel, onMove, onRemove }: { index: number; count: number; itemLabel: string; onMove: (to: number) => void; onRemove: () => void }) {
  return (
    <span className="flex shrink-0 gap-1">
      <Button variant="ghost" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label={`Move ${itemLabel} up`} title="Move up">
        Up
      </Button>
      <Button variant="ghost" onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label={`Move ${itemLabel} down`} title="Move down">
        Down
      </Button>
      <Button variant="ghost" onClick={onRemove} aria-label={`Remove ${itemLabel}`}>
        Remove
      </Button>
    </span>
  );
}

/** Reorderable list of plain strings, with add and remove. */
export function StringListEditor({
  id,
  label,
  items,
  onChange,
  multiline = false,
  addLabel = "Add item",
  hint,
}: {
  id: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
  hint?: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-1 block text-sm font-bold text-nordic">{label}</legend>
      {hint && <p className="mb-2 text-xs text-ink/60">{hint}</p>}
      {items.length === 0 ? (
        <p className="mb-2 text-sm text-ink/60">None yet.</p>
      ) : (
        <ol className="mb-2 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-6 shrink-0 pt-2 text-right text-xs tabular-nums text-ink/50">{i + 1}.</span>
              <label htmlFor={`${id}-${i}`} className="sr-only">
                {label} {i + 1}
              </label>
              {multiline ? (
                <textarea id={`${id}-${i}`} rows={2} value={item} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={inputClass} />
              ) : (
                <input id={`${id}-${i}`} value={item} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={inputClass} />
              )}
              <ItemControls
                index={i}
                count={items.length}
                itemLabel={`${label} ${i + 1}`}
                onMove={(to) => onChange(moveItem(items, i, to))}
                onRemove={() => onChange(items.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ol>
      )}
      <Button variant="secondary" onClick={() => onChange([...items, ""])}>
        {addLabel}
      </Button>
    </fieldset>
  );
}

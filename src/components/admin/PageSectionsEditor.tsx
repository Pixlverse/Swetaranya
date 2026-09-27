"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pageKeySchema } from "@/lib/validation/admin";
import { adminRequest } from "./api";
import { FormFooter, ItemControls, moveItem } from "./fields";
import { Badge, Button, Field, Panel, inputClass } from "./ui";
import { ActionButton } from "./actions";
import { humanizeKey } from "./page-meta";

/**
 * Structured editor for PageContent sections. Section data is deliberately simple — strings,
 * string lists and lists of flat string objects — so the form is generated from the data's shape.
 * Built-in sections take their shape from the code default in src/content/pages.ts.
 */

type Data = Record<string, unknown>;
export type EditorSection = { key: string; builtIn: boolean; data: Data; defaults: Data | null };

type SectionState = EditorSection & {
  /** Fixed at load (or when leaving JSON mode) so field types don't flip while someone is typing. */
  shape: Data;
  mode: "form" | "json";
  json: string;
  jsonError: string | null;
};

type Kind =
  | { type: "text"; long: boolean }
  | { type: "list"; long: boolean }
  | { type: "objects"; keys: string[]; long: Record<string, boolean> }
  | { type: "unsupported" };

const LONG_KEYS = new Set(["body", "answer", "description", "quote"]);
const isLongText = (key: string, v: unknown) => typeof v === "string" && (v.length > 80 || v.includes("\n") || LONG_KEYS.has(key) || /Body$/.test(key));
const isFlatObject = (v: unknown): v is Record<string, string> =>
  Boolean(v) && typeof v === "object" && !Array.isArray(v) && Object.values(v as object).every((x) => typeof x === "string");

function kindOf(key: string, shapeValue: unknown, current: unknown): Kind {
  const sample = shapeValue ?? current;
  if (typeof sample === "string") return { type: "text", long: isLongText(key, shapeValue) || isLongText(key, current) };
  if (!Array.isArray(sample)) return { type: "unsupported" };
  const items = [...sample, ...(Array.isArray(current) ? current : [])];
  if (items.every((x) => typeof x === "string")) return { type: "list", long: items.some((x) => isLongText(key, x)) };
  if (!items.every(isFlatObject)) return { type: "unsupported" };
  const keys = [...new Set(items.flatMap((x) => Object.keys(x)))];
  return { type: "objects", keys, long: Object.fromEntries(keys.map((k) => [k, items.some((x) => isLongText(k, x[k]))])) };
}

const fieldsOf = (s: Pick<SectionState, "shape" | "data">) => [...new Set([...Object.keys(s.shape), ...Object.keys(s.data)])];
const formable = (s: Pick<SectionState, "shape" | "data">) => fieldsOf(s).every((k) => kindOf(k, s.shape[k], s.data[k]).type !== "unsupported");

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Data)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : 1));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function parseObject(json: string): { ok: true; value: Data } | { ok: false; error: string } {
  try {
    const value = JSON.parse(json);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, error: 'Each section must be a JSON object, e.g. { "heading": "…" }.' };
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
}

function toState(s: EditorSection): SectionState {
  // Default keys take their type from the default; any extra stored keys from their own value.
  const shape = s.defaults ? { ...s.data, ...s.defaults } : s.data;
  const state: SectionState = { ...s, shape, mode: "form", json: JSON.stringify(s.data, null, 2), jsonError: null };
  return formable(state) ? state : { ...state, mode: "json" };
}

const singular = (key: string) => humanizeKey(key.endsWith("ies") ? `${key.slice(0, -3)}y` : key.endsWith("s") ? key.slice(0, -1) : key);
const rowsFor = (v: string) => Math.min(14, Math.max(3, v.split("\n").length + Math.ceil(v.length / 90)));

function LineBreakHint({ value }: { value: string }) {
  if (!value.includes("\n")) return null;
  return <p className="mt-1 text-xs text-ink/60">This text has line breaks. Each one is kept exactly where it is on the site.</p>;
}

function TextInput({ id, label, value, long, onChange }: { id: string; label: string; value: string; long: boolean; onChange: (v: string) => void }) {
  return (
    <Field label={label} htmlFor={id}>
      {long ? (
        <textarea id={id} rows={rowsFor(value)} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
      <LineBreakHint value={value} />
    </Field>
  );
}

function ListInput({ id, fieldKey, label, items, long, onChange }: { id: string; fieldKey: string; label: string; items: string[]; long: boolean; onChange: (v: string[]) => void }) {
  const item = singular(fieldKey).toLowerCase();
  return (
    <fieldset className="rounded-hair border border-nordic/15 p-3">
      <legend className="px-1 text-sm font-bold text-nordic">
        {label} <span className="font-normal text-ink/60">({items.length})</span>
      </legend>
      {items.length > 0 && (
        <ol className="mb-3 space-y-2">
          {items.map((v, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-6 shrink-0 pt-2 text-right text-xs tabular-nums text-ink/50">{i + 1}.</span>
              <div className="min-w-0 flex-1">
                <label htmlFor={`${id}-${i}`} className="sr-only">
                  {label} {i + 1}
                </label>
                {long ? (
                  <textarea id={`${id}-${i}`} rows={rowsFor(v)} value={v} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={inputClass} />
                ) : (
                  <input id={`${id}-${i}`} value={v} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={inputClass} />
                )}
                <LineBreakHint value={v} />
              </div>
              <ItemControls
                index={i}
                count={items.length}
                itemLabel={`${item} ${i + 1}`}
                onMove={(to) => onChange(moveItem(items, i, to))}
                onRemove={() => onChange(items.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ol>
      )}
      <Button variant="secondary" onClick={() => onChange([...items, ""])}>
        Add {item}
      </Button>
    </fieldset>
  );
}

function ObjectListInput({
  id,
  fieldKey,
  label,
  items,
  keys,
  long,
  onChange,
}: {
  id: string;
  fieldKey: string;
  label: string;
  items: Record<string, string>[];
  keys: string[];
  long: Record<string, boolean>;
  onChange: (v: Record<string, string>[]) => void;
}) {
  const item = singular(fieldKey);
  const setField = (i: number, k: string, value: string) => onChange(items.map((x, j) => (j === i ? { ...x, [k]: value } : x)));
  const shortKeys = keys.filter((k) => !long[k]);
  const longKeys = keys.filter((k) => long[k]);
  return (
    <fieldset className="rounded-hair border border-nordic/15 p-3">
      <legend className="px-1 text-sm font-bold text-nordic">
        {label} <span className="font-normal text-ink/60">({items.length})</span>
      </legend>
      {items.length > 0 && (
        <ol className="mb-3 space-y-3">
          {items.map((x, i) => {
            const preview = keys.map((k) => x[k]).find((v) => v && v.length <= 80);
            return (
              <li key={i} className="rounded-hair border border-nordic/10 bg-cream/60 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-bold text-nordic">
                    {item} {i + 1}
                    {preview && <span className="font-normal text-ink/60"> — {preview}</span>}
                  </span>
                  <ItemControls
                    index={i}
                    count={items.length}
                    itemLabel={`${item.toLowerCase()} ${i + 1}`}
                    onMove={(to) => onChange(moveItem(items, i, to))}
                    onRemove={() => onChange(items.filter((_, j) => j !== i))}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[...shortKeys, ...longKeys].map((k) => (
                    <div key={k} className={long[k] ? "md:col-span-2" : ""}>
                      <TextInput id={`${id}-${i}-${k}`} label={humanizeKey(k)} value={x[k] ?? ""} long={long[k]} onChange={(v) => setField(i, k, v)} />
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <Button variant="secondary" onClick={() => onChange([...items, Object.fromEntries(keys.map((k) => [k, ""]))])}>
        Add {item.toLowerCase()}
      </Button>
    </fieldset>
  );
}

function SectionForm({ section, onChange }: { section: SectionState; onChange: (data: Data) => void }) {
  const keys = fieldsOf(section);
  if (keys.length === 0) return <p className="text-sm text-ink/60">This section has no fields yet. Use “Advanced: edit JSON” to add some.</p>;
  const set = (k: string, v: unknown) => onChange({ ...section.data, [k]: v });
  return (
    <div className="space-y-4">
      {keys.map((k) => {
        const kind = kindOf(k, section.shape[k], section.data[k]);
        const id = `s-${section.key}-${k}`;
        const label = humanizeKey(k);
        const value = section.data[k];
        if (kind.type === "text") return <TextInput key={k} id={id} label={label} value={typeof value === "string" ? value : ""} long={kind.long} onChange={(v) => set(k, v)} />;
        if (kind.type === "list")
          return <ListInput key={k} id={id} fieldKey={k} label={label} items={Array.isArray(value) ? (value as string[]) : []} long={kind.long} onChange={(v) => set(k, v)} />;
        if (kind.type === "objects")
          return (
            <ObjectListInput
              key={k}
              id={id}
              fieldKey={k}
              label={label}
              items={Array.isArray(value) ? (value as Record<string, string>[]) : []}
              keys={kind.keys}
              long={kind.long}
              onChange={(v) => set(k, v)}
            />
          );
        return null;
      })}
    </div>
  );
}

export function PageSectionsEditor({ pageKey, builtInPage, exists, initial }: { pageKey: string; builtInPage: boolean; exists: boolean; initial: EditorSection[] }) {
  const router = useRouter();
  const [sections, setSections] = useState<SectionState[]>(() => initial.map(toState));
  const [newKey, setNewKey] = useState("");
  const [state, setState] = useState<{ busy: boolean; error: string | null; saved: boolean }>({ busy: false, error: null, saved: false });

  const patch = (key: string, p: Partial<SectionState>) => {
    setSections((all) => all.map((s) => (s.key === key ? { ...s, ...p } : s)));
    setState((st) => ({ ...st, saved: false }));
  };

  function toJson(s: SectionState) {
    patch(s.key, { mode: "json", json: JSON.stringify(s.data, null, 2), jsonError: null });
  }
  function toForm(s: SectionState) {
    const res = parseObject(s.json);
    if (!res.ok) return patch(s.key, { jsonError: res.error });
    const next = { data: res.value, shape: s.defaults ? { ...res.value, ...s.defaults } : res.value };
    if (!formable(next)) return patch(s.key, { jsonError: "This JSON has values the form can't show (numbers, nested objects…). Keep editing it as JSON." });
    patch(s.key, { ...next, mode: "form", jsonError: null });
  }

  function addSection() {
    const key = newKey.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(key)) return setState((s) => ({ ...s, error: "Section keys start with a letter and use letters, numbers, - or _." }));
    if (sections.some((s) => s.key === key)) return setState((s) => ({ ...s, error: `A section called “${key}” already exists.` }));
    setSections((all) => [...all, { key, builtIn: false, data: {}, defaults: null, shape: {}, mode: "json", json: '{\n  "heading": ""\n}', jsonError: null }]);
    setNewKey("");
    setState((s) => ({ ...s, error: null }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: { key: string; data: Data }[] = [];
    let firstError: string | null = null;
    const checked = sections.map((s) => {
      if (s.mode === "form") {
        payload.push({ key: s.key, data: s.data });
        return s;
      }
      const res = parseObject(s.json);
      if (res.ok) {
        payload.push({ key: s.key, data: res.value });
        return { ...s, jsonError: null };
      }
      firstError ??= `Fix the JSON in “${humanizeKey(s.key)}” before saving.`;
      return { ...s, jsonError: res.error };
    });
    setSections(checked);
    if (firstError) return setState({ busy: false, error: firstError, saved: false });
    setState({ busy: true, error: null, saved: false });
    const res = await adminRequest(`/api/admin/pages/${pageKey}`, "PUT", { sections: payload });
    if (!res.ok) return setState({ busy: false, error: res.error, saved: false });
    setState({ busy: false, error: null, saved: true });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {sections.map((s) => {
        const isDefault = s.defaults !== null && s.mode === "form" && stable(s.data) === stable(s.defaults);
        return (
          <Panel
            key={s.key}
            title={humanizeKey(s.key)}
            actions={
              <span className="flex flex-wrap items-center justify-end gap-2">
                {s.builtIn ? <Badge tone="info">Built-in</Badge> : <Badge>Custom</Badge>}
                {s.builtIn && !isDefault && <Badge tone="warning">Edited</Badge>}
                {s.builtIn && s.defaults && !isDefault && (
                  <Button variant="ghost" onClick={() => patch(s.key, { data: s.defaults!, shape: s.defaults!, mode: "form", jsonError: null })}>
                    Reset to default
                  </Button>
                )}
                {!s.builtIn && (
                  <Button variant="ghost" onClick={() => (s.mode === "json" ? toForm(s) : toJson(s))} aria-pressed={s.mode === "json"}>
                    {s.mode === "json" ? "Back to form" : "Advanced: edit JSON"}
                  </Button>
                )}
                {!s.builtIn && (
                  <Button variant="ghost" onClick={() => setSections((all) => all.filter((x) => x.key !== s.key))}>
                    Remove section
                  </Button>
                )}
              </span>
            }
          >
            <p className="-mt-1 mb-3 text-xs text-ink/50">
              Key: <code>{s.key}</code>
            </p>
            {s.mode === "form" ? (
              <SectionForm section={s} onChange={(data) => patch(s.key, { data })} />
            ) : (
              <>
                <label htmlFor={`json-${s.key}`} className="mb-1 block text-sm font-bold text-nordic">
                  JSON
                </label>
                <textarea
                  id={`json-${s.key}`}
                  value={s.json}
                  onChange={(e) => patch(s.key, { json: e.target.value })}
                  onBlur={(e) => {
                    const res = parseObject(e.target.value);
                    patch(s.key, { jsonError: res.ok ? null : res.error });
                  }}
                  rows={Math.min(24, Math.max(5, s.json.split("\n").length + 1))}
                  spellCheck={false}
                  aria-invalid={Boolean(s.jsonError)}
                  className={`${inputClass} font-mono text-xs leading-relaxed ${s.jsonError ? "border-clay" : ""}`}
                />
                <p className="mt-1 text-xs text-ink/60">
                  Use strings, lists of strings, or lists of objects whose values are strings, so the form can show them. Line breaks inside a string are written{" "}
                  <code className="rounded-hair bg-nordic/10 px-1">\n</code>.
                </p>
              </>
            )}
            {s.jsonError && (
              <p role="alert" className="mt-1 text-xs font-bold text-clay">
                {s.jsonError}
              </p>
            )}
          </Panel>
        );
      })}

      <Panel title="Add a custom section">
        <div className="flex flex-wrap items-end gap-2">
          <Field label="Section key" htmlFor="new-section-key" className="min-w-48 flex-1" hint="Only shows on the site once a page component reads this key.">
            <input id="new-section-key" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. seasonalNote" className={inputClass} />
          </Field>
          <Button variant="secondary" onClick={addSection}>
            Add section
          </Button>
        </div>
      </Panel>

      <FormFooter busy={state.busy} error={state.error} saved={state.saved} isNew={false}>
        {!builtInPage && exists && (
          <ActionButton
            url={`/api/admin/pages/${pageKey}`}
            method="DELETE"
            label="Delete page key"
            variant="danger"
            confirm={`Delete all stored content for “${pageKey}”?`}
            redirectTo="/admin/pages"
          />
        )}
      </FormFooter>
    </form>
  );
}

export function NewPageKeyForm({ existing }: { existing: string[] }) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = pageKeySchema.safeParse(key);
        if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid key");
        if (existing.includes(parsed.data)) return setError("That page key already exists.");
        router.push(`/admin/pages/${parsed.data}`);
      }}
      className="rounded-soft border border-nordic/10 bg-white p-4"
    >
      <Field label="New page key" htmlFor="new-page-key" error={error} hint="Only useful once a page component reads this key. Lowercase with hyphens.">
        <div className="flex gap-2">
          <input id="new-page-key" value={key} onChange={(e) => setKey(e.target.value)} className={inputClass} placeholder="e.g. seasonal-notes" />
          <Button type="submit" variant="secondary" className="shrink-0">
            Create
          </Button>
        </div>
      </Field>
    </form>
  );
}
